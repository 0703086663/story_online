// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'
import { categories, users } from './initial'

const prisma = new PrismaClient()

export async function seed() {
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true,
  })

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  })
}

seed()
  .then(async () => {
    if (Number(process.env.USE_FAKE_DATA) === 1) {
      await devMigrate(50)
    }
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

/**
 * Dummy data (fake data)
 * Dev only
 */
async function devMigrate(numberRecords: number) {
  for (let i = 0; i < numberRecords; i++) {
    // User
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('123456', Number(process.env.SALT_BCRYPT)),
        phone: faker.phone.number(),
        birthdate: faker.date.past(),
        image: faker.image.avatar(),
        money: parseFloat(faker.finance.amount({ min: 100, max: 10000, dec: 2 })),
        refreshToken: faker.string.uuid(),
        emailVerified: faker.datatype.boolean(),
      },
    })

    const allUsers = await prisma.user.findMany()
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)]

    const allCategories = await prisma.category.findMany()
    const randomCategories = faker.helpers.shuffle(allCategories).slice(0, faker.number.int({ max: 5 }))

    // Product
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        source: faker.internet.url(),
        image: faker.image.urlPlaceholder({ format: 'png' }),
        status: faker.helpers.arrayElement(['PROGRESS', 'DONE']),
        authorName: faker.person.fullName(),
        viewCount: 0,
        createdAt: faker.date.between({ from: '2000-01-01', to: Date.now() }),
        updatedAt: faker.date.between({ from: '2000-01-01', to: Date.now() }),
        categories: {
          connect: randomCategories.map(category => ({ id: category.id })),
        },
        createdBy: randomUser.id,
      },
    })

    const allProducts = await prisma.product.findMany()
    const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)]
    const randomProducts = faker.helpers.shuffle(allProducts).slice(0, faker.number.int({ max: 5 }))

    // Comment
    await prisma.comment.create({
      data: {
        createdBy: randomUser.id,
        productId: randomProduct.id,
        content: faker.lorem.paragraph(),
        createdAt: faker.date.between({ from: '2000-01-01', to: Date.now() }),
        updatedAt: faker.date.between({ from: '2000-01-01', to: Date.now() }),
      },
    })

    await prisma.rate.upsert({
      where: {
        createdBy_productId: { createdBy: randomUser.id, productId: randomProduct.id },
      },
      update: {
        rating: faker.number.int({ min: 1, max: 5 }),
        updatedAt: new Date(),
      },
      create: {
        createdBy: randomUser.id,
        productId: randomProduct.id,
        rating: faker.number.int({ min: 1, max: 5 }),
        createdAt: faker.date.between({ from: '2000-01-01', to: new Date() }),
        updatedAt: faker.date.between({ from: '2000-01-01', to: new Date() }),
      },
    })

    // Chapter
    const maxChapter = await prisma.chapter.findFirst({
      where: {
        productId: randomProduct.id,
      },
      orderBy: {
        chapterNumber: 'desc',
      },
    })
    await prisma.chapter.create({
      data: {
        productId: randomProduct.id,
        chapterName: faker.lorem.words(),
        content: faker.lorem.paragraphs({ min: 100, max: 150 }, '<br/>\n'),
        chapterNumber: (maxChapter?.chapterNumber ?? 0) + 1, // Increment from the max or start at 1
        price: Math.round(parseFloat(faker.finance.amount({ min: 50, max: 100, dec: 2 }))),
        users: [randomUser.id],
      },
    })

    // List
    const allChapters = await prisma.chapter.findMany()
    const randomChapters = faker.helpers.shuffle(allChapters).slice(0, faker.number.int({ max: 5 }))
    const randomClassification = faker.helpers.arrayElement(['READING', 'FAVORITE'])

    await prisma.list.create({
      data: {
        createdBy: randomUser.id,
        classification: randomClassification,
        chapters: {
          connect: randomClassification === 'READING' ? randomChapters.map(chapter => ({ id: chapter.id })) : [],
        },
        products: {
          connect: randomClassification === 'FAVORITE' ? randomProducts.map(product => ({ id: product.id })) : [],
        },
      },
    })

    // payment
    await prisma.payment.create({
      data: {
        createdBy: randomUser.id,
        amount: parseFloat(faker.finance.amount({ min: 100, max: 10000, dec: 2 })),
        createdAt: faker.date.between({ from: '2000-01-01', to: Date.now() }),
        chapters: {
          connect: randomChapters.map(chapter => ({ id: chapter.id })),
        },
      },
    })
  }
}
