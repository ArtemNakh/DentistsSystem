import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  

  const configSwagger = new DocumentBuilder()
    .setTitle(
      'Інформаційна система керування взаємодією з клієнтами (CPM) стоматологічної клініки',
    )
    .setDescription('  Це API для управління стоматологічними клініками')
    .setVersion('0.1')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') ?? 3000;

  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
