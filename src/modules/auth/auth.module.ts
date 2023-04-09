import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { Doctor } from '@entities/Doctor';
import { Speciality } from '@entities/Speciality';
import { AuthService } from '@modules/auth.service';
import { AuthController } from '@modules/auth.controller';
import { JwtStrategy } from '@modules/strategy/jwt.strategy';


@Module({
  imports: [
    ConfigModule,
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
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule { }
