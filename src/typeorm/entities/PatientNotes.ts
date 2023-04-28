import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Doctor } from '@entities/Doctor';
import { Patient } from '@entities/Patient';

@Entity({ name: 'patient_notes' })
export class PatientNotes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'note' })
  note: string;

  @Column({ name: 'doctor_id' })
  doctorId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'patient_id' })
  patientId: number;

  @ManyToOne(() => Patient, (patient) => patient.id)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
