import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '@entities/Doctor';

@Entity({ name: 'appointments' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ name: 'time', default: ' ' })
  time: string;

  @Column({ name: 'doctor_id' })
  doctorId: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.id)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;
}
