import { Patient } from '@entities/Patient';

export interface PatientsRes {
  total: number;
  patients: Patient[];
}
