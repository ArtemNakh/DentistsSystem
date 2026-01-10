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

import connectRedis from 'connect-redis';

//покроковий запуск
// docker-compose up -d      ( docker-compose down-v)
// npx ts-node ./node_modules/typeorm/cli.js migration:run -d ./src/database/data-source.ts
//npx ts-node ./seeds/runAllSeeds.ts
//npm run start           npm run start:dev
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const redis = new IORedis(configService.getOrThrow('REDIS_URI'));
  const RedisStore = connectRedis(session);

  app.use(cookieParser(configService.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis,
        prefix: configService.getOrThrow<string>('SESSION_FOLDER') + ':',
      }),
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      name: configService.getOrThrow<string>('SESSION_NAME'),
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
  const endDocsApi = '/api';
  
  SwaggerModule.setup(endDocsApi, app, documentFactory);
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`Docs api: http://localhost:${port}${endDocsApi}`);
}
bootstrap();
