import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('Twitter Clone')
        .setDescription('Twitter clone backend')
        .setVersion('1.0')
        .addTag('Twitty')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
    Logger.log('Server is running at PORT: 3000');
}
bootstrap();
