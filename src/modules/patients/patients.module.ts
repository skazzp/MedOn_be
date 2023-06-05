import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '@entities/Patient';
import { PatientNotes } from '@entities/PatientNotes';
import { Doctor } from '@entities/Doctor';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Doctor, PatientNotes])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
