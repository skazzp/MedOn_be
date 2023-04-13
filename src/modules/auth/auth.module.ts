import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Doctor } from '@entities/Doctor';
import { Speciality } from '@entities/Speciality';
import { EmailModule } from '@modules/email/email.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([Doctor, Speciality]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}