import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { Doctor } from '@entities/Doctor';
import { Speciality } from '@entities/Speciality';
import { AuthController } from '@modules/auth/auth.controller';
import { AuthService } from '@modules/auth/auth.service';
import { EmailModule } from '@modules/email/email.module';
import { GoogleStrategy } from '@modules/auth/strategy/google.strategy';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    TypeOrmModule.forFeature([Doctor, Speciality]),
    PassportModule,
    JwtModule.register({}),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
