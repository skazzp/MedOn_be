import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Patient } from '@entities/Patient';
import { PatientSearchOptionsDto } from './dto/pageOptions.dto';
import { PatientsRes } from './interfaces/patients-responce';

@Injectable()
export class PatientsService {
  constructor(@InjectRepository(Patient) private repo: Repository<Patient>) {}

  addPatient(dto: CreatePatientDto): Promise<Patient> {
    return this.repo.save(dto);
  }

  async getPatients(query: PatientSearchOptionsDto): Promise<PatientsRes> {
    const queryBuilder = this.repo.createQueryBuilder('patient');
    const { name } = query;
    const limit = query.limit || 5;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    if (name) {
      const total = await queryBuilder.getCount();
      const patients = await queryBuilder
        .take(limit)
        .skip(skip)
        .where('last_name like :lastName', { lastName: `%${name}%` })
        .orWhere('first_name like :firstName', {
          firstName: `%${name}%`,
        })
        .orderBy('patient.updatedAt', 'DESC')
        .getMany();

      return { total, patients };
    }

    const total = await queryBuilder.getCount();
    const patients = await queryBuilder
      .take(limit)
      .skip(skip)
      .orderBy('patient.updatedAt', 'DESC')
      .getMany();

    return { total, patients };
  }
}
