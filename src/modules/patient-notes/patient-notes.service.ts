import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PatientNotes } from '@entities/PatientNotes';
import { CreatePatientNoteDto } from '@modules/patient-notes/dto/create-patient-note.dto';
import { NotesSearchOptionsDto } from '@modules/patient-notes/dto/query-options.dto';
import { NotesRes } from '@modules/patient-notes/interfaces/patients-responce';
import { defaultLimit, defaultPage } from '@common/constants/pagination-params';

interface RemoveNoteData {
  id: number;
  doctorId: number;
}
@Injectable()
export class PatientNotesService {
  constructor(
    @InjectRepository(PatientNotes)
    private notesRepo: Repository<PatientNotes>,
  ) {}

  async addPatientNote(dto: CreatePatientNoteDto): Promise<PatientNotes> {
    const note = await this.notesRepo.save(dto);

    return note;
  }

  async getNotes(id: number, query: NotesSearchOptionsDto): Promise<NotesRes> {
    const queryBuilder = this.notesRepo.createQueryBuilder('notes');
    const { text, order = 'DESC' } = query;
    const limit = query.limit || defaultLimit;
    const page = query.page || defaultPage;
    const skip = (page - 1) * limit;

    if (text) {
      const response = await queryBuilder
        .take(limit)
        .skip(skip)
        .where('notes.patient_id = :id', { id })
        .andWhere('notes.note like :text', { text: `%${text}%` })
        .leftJoin('notes.doctor', 'doctor')
        .addSelect(['doctor.firstName', 'doctor.lastName'])
        .orderBy('notes.updatedAt', order)
        .getManyAndCount();

      return { notes: response[0], total: response[1] };
    }

    const response = await queryBuilder
      .take(limit)
      .skip(skip)
      .where('notes.patient_id = :id', { id })
      .leftJoin('notes.doctor', 'doctor')
      .addSelect(['doctor.firstName', 'doctor.lastName'])
      .orderBy('notes.updatedAt', order)
      .getManyAndCount();

    return { notes: response[0], total: response[1] };
  }

  async removePatientNote(data: RemoveNoteData): Promise<void> {
    const { id, doctorId } = data;
    const response = await this.notesRepo
      .createQueryBuilder('notes')
      .delete()
      .from(PatientNotes)
      .where('id = :id', { id })
      .andWhere('doctor_id = :doctorId', { doctorId })
      .execute();

    if (!response.affected) throw new NotFoundException('Note not found');
  }
}
