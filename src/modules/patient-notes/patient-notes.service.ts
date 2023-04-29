import { PatientNotes } from '@entities/PatientNotes';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientNoteDto } from '@modules/patient-notes/dto/create-patient-note.dto';

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
}
