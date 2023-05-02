import { PatientNotes } from '@entities/PatientNotes';

export interface INoteRequest extends Request {
  user: {
    userId: number;
  };
}

export interface NotesRes {
  total: number;
  notes: PatientNotes[];
}
