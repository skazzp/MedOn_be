import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from '@entities/Doctor';
import { Appointment } from '@entities/Appointments';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ type: 'datetime' })
  timestamp: Date;

  @ManyToOne(() => Appointment, (appointment) => appointment.chats)
  appointment: Appointment;

  @ManyToOne(() => Doctor, { eager: true })
  sender: Doctor;

  @ManyToOne(() => Doctor, { eager: true })
  recipient: Doctor;
}
