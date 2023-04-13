import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Doctor } from '@entities/Doctor';
import { Speciality } from '@entities/Speciality';
import { EmailModule } from '@modules/email/email.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([Doctor, Speciality]),
    JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
