import * as moment from 'moment-timezone';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Patient } from '@entities/Patient';
import { Doctor } from '@entities/Doctor';
import {
  CreatePatientDto,
  PatientSearchOptionsDto,
  UpdatePatientDto,
} from '@modules/patients/dto';
import { PatientsRes } from '@modules/patients/interfaces/patients-responce';
import { defaultLimit, defaultPage } from '@common/constants/pagination-params';
import { Role } from '@common/enums';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private repo: Repository<Patient>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  addPatient(dto: CreatePatientDto): Promise<Patient> {
    return this.repo.save(dto);
  }

  async getPatients(
    id: number,
    query: PatientSearchOptionsDto,
  ): Promise<PatientsRes> {
    let queryBuilder = this.repo.createQueryBuilder('patient');

    const { name } = query;
    const limit = query.limit || defaultLimit;
    const page = query.page || defaultPage;
    const skip = (page - 1) * limit;

    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) {
      throw new UnauthorizedException('Doctor not found!');
    }

    const now = moment().utc().toDate();

    if (doctor.role === Role.RemoteDoctor) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('patient.appointments', 'appointments')
        .where('appointments.startTime >= :now', { now })
        .andWhere('appointments.remoteDoctor = :remoteDoctor', {
          remoteDoctor: id,
        });
    }

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

  async updatePatient(
    id: number,
    patientData: UpdatePatientDto,
  ): Promise<UpdatePatientDto> {
    try {
      const updateResult = await this.repo
        .createQueryBuilder('patient')
        .update(Patient)
        .set({
          ...patientData,
          updatedAt: new Date(),
        })
        .where('id = :id', { id })
        .execute();

      if (!updateResult.affected) {
        throw new UnauthorizedException('User not found!');
      }
      const updatedUser = { id, ...patientData };

      return updatedUser;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
