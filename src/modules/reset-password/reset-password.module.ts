import { Module } from '@nestjs/common';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService],
})
export class ResetPasswordModule {}
