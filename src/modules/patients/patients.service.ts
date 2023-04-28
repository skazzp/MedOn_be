import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Patient } from '@entities/Patient';
import { PatientSearchOptionsDto } from '@modules/patients/dto/pageOptions.dto';
import { PatientsRes } from '@modules/patients/interfaces/patients-responce';
import { defaultLimit, defaultPage } from '@common/constants/pagination-params';
import { PatientNotes } from '@entities/PatientNotes';
import { CreatePatientNoteDto } from './dto/create-patient-note.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private repo: Repository<Patient>,
    @InjectRepository(PatientNotes)
    private notesRepo: Repository<PatientNotes>,
  ) {}

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
      const total = await queryBuilder
        .where('last_name like :lastName', { lastName: `%${name}%` })
        .orWhere('first_name like :firstName', {
          firstName: `%${name}%`,
        })
        .getCount();
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

  async getPatientById(id: number): Promise<Patient> {
    const queryBuilder = this.repo.createQueryBuilder('patient');
    const patient = await queryBuilder
      .where('patient.id = :id', { id })
      .leftJoinAndSelect('patient.notes', 'notes', 'notes.patientId = :id', {
        id,
      })
      .getOne();
    return patient;
  }

  async addPatientNote(dto: CreatePatientNoteDto): Promise<PatientNotes> {
    const note = await this.notesRepo.save(dto);

    return note;
  }
}
