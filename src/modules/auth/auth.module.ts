import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { Doctor } from '@entities/Doctor';
import { Speciality } from '@entities/Speciality';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { EmailModule } from '@modules/email/email.module';
import { GoogleStrategy } from '@modules/auth/strategy/GoogleStrategy';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    TypeOrmModule.forFeature([Doctor, Speciality]),
    PassportModule,
    JwtModule.register({}),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_SERVER'),
          auth: {
            user: configService.get('SMTP_LOGIN'),
            pass: configService.get('SMTP_PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
