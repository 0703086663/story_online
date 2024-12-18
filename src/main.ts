import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { seed } from 'prisma/seed'
import { LoggingInterceptor } from './app.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new LoggingInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Novel API docs')
    .setDescription('The novels API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('crawler')
    .addTag('product')
    .addTag('category')
    .addTag('chapter')
    .addTag('rate')
    .addTag('list')
    .addTag('comment')
    .addTag('payment')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, { swaggerOptions: { defaultModelsExpandDepth: -1 } })

  await seed()

  await app.listen(process.env.PORT || 3333)
}
bootstrap()
