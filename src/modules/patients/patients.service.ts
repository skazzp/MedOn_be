import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Patient } from '@entities/Patient';
import { PatientNotes } from '@entities/PatientNotes';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { PatientSearchOptionsDto } from '@modules/patients/dto/pageOptions.dto';
import { PatientsRes } from '@modules/patients/interfaces/patients-responce';
import { CreatePatientNoteDto } from '@modules/patients/dto/create-patient-note.dto';
import { defaultLimit, defaultPage } from '@common/constants/pagination-params';

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
