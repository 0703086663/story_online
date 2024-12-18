import Stripe from 'stripe'
import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/modules/prisma/prisma.service'
import { CreatePaymentDto, IntentDto } from './payment.dto'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createIntent(intentDto: IntentDto) {
    try {
      const { amount, description } = intentDto

      if (amount === null || amount === undefined) {
        throw new Error('Invalid amount')
      }

      if (amount < 50) {
        throw new Error('Amount must be at least 50 (~ $ 0.50)')
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        description,
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return paymentIntent
    } catch (error) {
      throw error
    }
  }

  async storePayment(createPaymentDto: CreatePaymentDto) {
    const { userId, amount, chapters } = createPaymentDto

    try {
      if (!userId) throw new BadRequestException('User ID can not be empty')

      if (!amount) throw new BadRequestException('Amount can not be empty')

      if (!chapters || chapters.length === 0) throw new BadRequestException('Chapters can not be empty')

      const chapter = await this.prisma.chapter.findFirst({
        where: { id: chapters[0].id },
        select: {
          users: true,
        },
      })

      if (chapter.users.includes(userId)) throw new BadRequestException('User already buy this chapter')

      const payment = await this.prisma.chapter.update({
        where: { id: chapters[0].id },
        data: {
          users: [...chapter.users, userId],
        },
      })

      // const payment = await this.prisma.paymentHistory.create({
      //   data: {
      //     userId,
      //     amount,
      //     chapters: {
      //       connect: chapters.map((chapter) => ({ id: chapter.id })),
      //     },
      //   },
      //   include: {
      //     chapters: {
      //       select: {
      //         id: true,
      //         users: true,
      //       },
      //     },
      //   },
      // });

      // for (const chapter of payment.chapters) {
      //   const userExists = chapter.users.includes(userId);

      //   if (!userExists) {
      //     await this.prisma.chapter.update({
      //       where: { id: chapter.id },
      //       data: {
      //         users: [...chapter.users, userId],
      //       },
      //     });
      //   }
      // }

      return payment
    } catch (error) {
      throw error
    }
  }
}
