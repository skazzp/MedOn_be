import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Gender } from '@common/enums';
import { maxOverviewLength } from '@common/constants/validation';

import { PatientNotes } from '@entities/PatientNotes';
import { Appointment } from '@entities/Appointments';

@Entity({ name: 'patient' })
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'date_of_birth', type: 'datetime' })
  dateOfBirth: Date;

  @Column({ name: 'country' })
  country: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'overview', length: maxOverviewLength })
  overview: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Appointment[];

  @OneToMany(() => PatientNotes, (patientNote) => patientNote.patient)
  notes: PatientNotes[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
