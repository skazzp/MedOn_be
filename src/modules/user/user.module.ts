import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '@entities/Doctor';
import { Speciality } from '@entities/Speciality';
import { EmailModule } from '@modules/email/email.module';
import { AuthService } from '@modules/auth/auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([Doctor, Speciality]),
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
