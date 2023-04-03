import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../typeorm/entities/Patient';
import { PatientDto } from './dto/patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientsRepo: Repository<Patient>,
  ) {}

  getAllPatients(): Promise<Patient[]> {
    return this.patientsRepo.find();
  }

  getPatientById(id: number): Promise<Patient> {
    return this.patientsRepo
      .createQueryBuilder('Patients')
      .where('Patient.id = :id', { id })
      .getOne();
  }

  createPatient(dto: PatientDto): Promise<Patient> {
    const patient = this.patientsRepo.create(dto);
    return this.patientsRepo.save(patient);
  }
}
