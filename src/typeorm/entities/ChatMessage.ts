import * as moment from 'moment-timezone';
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
import { Appointment } from '@entities/Appointments';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'message' })
  value: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.messages, {
    eager: true,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: Doctor;

  @CreateDateColumn({
    name: 'created_at',
    transformer: {
      to(value: Date): Date {
        return moment(value).utc().toDate();
      },
      from(value: Date): Date {
        return moment(value).toDate();
      },
    },
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    transformer: {
      to(value: Date): Date {
        return moment(value).utc().toDate();
      },
      from(value: Date): Date {
        return moment(value).toDate();
      },
    },
  })
  updatedAt: Date;
}
