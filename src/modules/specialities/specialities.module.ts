import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Speciality } from '@entities/Speciality';
import { Doctor } from '@entities/Doctor';
import { SpecialitiesService } from './specialities.service';
import { SpecialitiesController } from './specialities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Speciality, Doctor])],
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
})
export class SpecialitiesModule {}