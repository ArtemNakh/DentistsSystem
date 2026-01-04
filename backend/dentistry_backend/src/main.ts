import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import IORedis from 'ioredis';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { ms, StringValue } from './libs/common/ms.util';
import { parseBoolean } from './libs/common/parse-boolean.util';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // const redis = new IORedis(configService.getOrThrow('REDIS_URI'));
  const redis = new IORedis({
    host: configService.getOrThrow('REDIS_HOST'),
    port: parseInt(configService.getOrThrow('REDIS_PORT'), 10),
    password: configService.getOrThrow('REDIS_PASSWORD'),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      name: configService.getOrThrow<string>('SESSION_SECRET'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: configService.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(configService.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(
          configService.getOrThrow<string>('SESSION_HTTP_ONLY'),
        ),
        secure: parseBoolean(
          configService.getOrThrow<string>('SESSION_SECURE'),
        ),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: configService.getOrThrow<string>('SESSION_FOLDER'),
      }),
    }),
  );

  app.enableCors({
    origin: configService.getOrThrow<string>('APPLICATION_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  const configSwagger = new DocumentBuilder()
    .setTitle(
      'Інформаційна система керування взаємодією з клієнтами (CPM) стоматологічної клініки',
    )
    .setDescription('  Це API для управління стоматологічними клініками')
    .setVersion('0.1')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);

  const port = configService.get<number>('APPLICATION_PORT') ?? 3000;

  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
}
bootstrap();
