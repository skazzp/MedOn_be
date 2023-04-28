import { Patient } from '@entities/Patient';

export interface PatientsRes {
  total: number;
  patients: Patient[];
}

export interface INoteRequest extends Request {
  user: {
    email: string;
    userId: number;
  };
}
