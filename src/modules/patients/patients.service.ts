import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Patient } from '@entities/Patient';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { PatientSearchOptionsDto } from '@modules/patients/dto/page-options.dto';
import { PatientsRes } from '@modules/patients/interfaces/patients-responce';
import { defaultLimit, defaultPage } from '@common/constants/pagination-params';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(@InjectRepository(Patient) private repo: Repository<Patient>) {}

  addPatient(dto: CreatePatientDto): Promise<Patient> {
    return this.repo.save(dto);
  }

  async getPatients(query: PatientSearchOptionsDto): Promise<PatientsRes> {
    const queryBuilder = this.repo.createQueryBuilder('patient');
    const { name } = query;
    const limit = query.limit || defaultLimit;
    const page = query.page || defaultPage;
    const skip = (page - 1) * limit;

    if (name) {
      const response = await queryBuilder
        .take(limit)
        .skip(skip)
        .where('last_name like :lastName', { lastName: `%${name}%` })
        .orWhere('first_name like :firstName', {
          firstName: `%${name}%`,
        })
        .orderBy('patient.updatedAt', 'DESC')
        .getManyAndCount();

      return { patients: response[0], total: response[1] };
    }

    const response = await queryBuilder
      .take(limit)
      .skip(skip)
      .orderBy('patient.updatedAt', 'DESC')
      .getManyAndCount();

    return { patients: response[0], total: response[1] };
  }

  async getPatientById(id: number): Promise<Patient> {
    const queryBuilder = this.repo.createQueryBuilder('patient');
    const patient = await queryBuilder
      .where('patient.id = :id', { id })
      .getOne();
    return patient;
  }

  async updatePatient(id: number, payload: UpdatePatientDto): Promise<Patient> {
    try {
      const patient = await this.repo
        .createQueryBuilder('patient')
        .where('id = :id', { id })
        .getOne();

      if (!patient) throw new UnauthorizedException('User not found!');

      await this.repo
        .createQueryBuilder('patient')
        .update(Patient)
        .set({
          ...payload,
          updatedAt: new Date(),
        })
        .where('id = :id', { id })
        .execute();
      const updatedUser = { ...patient, ...payload };

      return updatedUser;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
