import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctor } from '../../typeorm/entities/Doctor';
import { Speciality } from '../../typeorm/entities/Speciality';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Speciality])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
