import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
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
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
