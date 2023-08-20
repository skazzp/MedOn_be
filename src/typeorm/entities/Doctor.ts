import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Speciality } from '@entities/Speciality';
import { Role } from '@common/enums/Role';
import { Availability } from './Availability';
import { Appointment } from './Appointments';

@Entity({ name: 'doctor' })
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'city', nullable: true })
  city: string;

  @Column({ name: 'country', nullable: true })
  country: string;

  @Column({ name: 'password', nullable: true })
  password: string;

  @Column({ name: 'token', nullable: true })
  token: string;

  @Column({ name: 'photo', nullable: true })
  photo: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'role', type: 'enum', enum: Role, nullable: true })
  role: Role;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'time_zone', nullable: true })
  timeZone: string;

  @Column({ name: 'speciality_id', nullable: true })
  specialityId: number;

  @ManyToOne(() => Speciality, (speciality) => speciality.doctors)
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality;

  @OneToMany(() => Availability, (availability) => availability.doctor)
  availability?: Availability[];

  @OneToMany(() => Appointment, (availability) => availability.remoteDoctor)
  appointments?: Appointment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
