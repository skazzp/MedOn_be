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
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'message' })
  message: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.chats)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: Doctor;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Doctor;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
