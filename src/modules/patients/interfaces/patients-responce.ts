import { Patient } from '@entities/Patient';
import { PatientNotes } from '@entities/PatientNotes';

export interface PatientsRes {
  total: number;
  patients: Patient[];
}

export interface PatientWithNotes extends Patient {
  notes: PatientNotes[];
}

export interface INoteRequest extends Request {
  user: {
    email: string;
    userId: number;
  };
}
