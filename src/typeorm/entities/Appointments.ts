import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '@entities/Doctor';
import { Patient } from '@entities/Patient';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'link' })
  link: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'local_doctor_id' })
  localDoctorId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  @JoinColumn({ name: 'local_doctor_id' })
  localDoctor: Doctor;

  @Column({ name: 'remote_doctor_id' })
  remoteDoctorId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  @JoinColumn({ name: 'remote_doctor_id' })
  remoteDoctor: Doctor;

  @Column({ name: 'patient_id' })
  patientId: number;

  @ManyToOne(() => Patient, (patient) => patient.id)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
