import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/gobalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle('Medon API').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.setGlobalPrefix('api');
  app.use(
    session({
      secret: 'secret',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(app.get(ConfigService).get('PORT'));
}
bootstrap();
