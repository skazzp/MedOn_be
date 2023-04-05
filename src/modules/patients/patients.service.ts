import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from '@entities/Patient';
import { PatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
  ) {}

  getAllPatients(): Promise<Patient[]> {
    return this.patientRepo.find();
  }

  getPatientById(id: number): Promise<Patient> {
    return this.patientRepo
      .createQueryBuilder('Patients')
      .where('Patient.id = :id', { id })
      .getOne();
  }

  createPatient(dto: PatientDto): Promise<Patient> {
    const patient = this.patientRepo.create(dto);
    return this.patientRepo.save(patient);
  }
}
