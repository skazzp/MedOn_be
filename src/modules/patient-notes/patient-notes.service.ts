import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';

import { PatientNotes } from '@entities/PatientNotes';
import { CreatePatientNoteDto } from '@modules/patient-notes/dto/create-patient-note.dto';
import { NotesSearchOptionsDto } from '@modules/patient-notes/dto/query-options.dto';
import { NotesRes } from '@modules/patient-notes/interfaces/notes-responce';
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

  async getNotes(
    id: number,
    searchOptions: NotesSearchOptionsDto,
  ): Promise<NotesRes> {
    const queryBuilder = this.notesRepo.createQueryBuilder('notes');
    const {
      text,
      order = 'DESC',
      limit = defaultLimit,
      page = defaultPage,
    } = searchOptions;
    const skip = (page - 1) * limit;

    const response = await queryBuilder
      .take(limit)
      .skip(skip)
      .where({
        patientId: id,
        ...(text && { note: Like(`%${text}%`) }),
      })
      .leftJoin('notes.doctor', 'doctor')
      .addSelect(['doctor.firstName', 'doctor.lastName'])
      .orderBy('notes.createdAt', order)
      .getManyAndCount();

    return { notes: response[0], total: response[1] };
  }

  async removePatientNote(data: RemoveNoteData): Promise<void> {
    const { id, doctorId } = data;
    const response = await this.notesRepo
      .createQueryBuilder('notes')
      .delete()
      .from(PatientNotes)
      .where({ id, doctorId })
      .execute();

    if (!response.affected) throw new NotFoundException('Note not found');
  }

  async updatePatientNote(
    patientId: number,
    noteId: number,
    updatedNote: CreatePatientNoteDto,
  ): Promise<void> {
    const result = await this.notesRepo.update(
      { id: noteId, patientId },
      updatedNote,
    );

    if (result.affected === 0) {
      throw new NotFoundException('Note not found');
    }
  }
}
