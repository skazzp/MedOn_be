import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '@entities/Doctor';
import { Speciality } from '@entities/Speciality';
import { EmailModule } from '@modules/email/email.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [EmailModule, TypeOrmModule.forFeature([Doctor, Speciality])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
