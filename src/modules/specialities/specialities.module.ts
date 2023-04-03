import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialitiesService } from './specialities.service';
import { SpecialitiesController } from './specialities.controller';
import { Speciality } from '../../typeorm/entities/Speciality';
import { Doctor } from '../../typeorm/entities/Doctor';

@Module({
  imports: [TypeOrmModule.forFeature([Speciality, Doctor])],
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService],
})
export class SpecialitiesModule {}
