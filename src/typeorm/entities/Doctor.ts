import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { Speciality } from '@entities/Speciality';
import { Role } from '@common/enums/Role';

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

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'country' })
  country: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'token', nullable: true })
  token: string;

  @Column({ name: 'photo', nullable: true })
  photo: string;

  @Column({ name: 'date_of_birth', type: 'datetime' })
  dateOfBirth: Date;

  @Column({ name: 'role', type: 'enum', enum: Role })
  role: Role;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'time_zone' })
  timeZone: string;

  @Column({ name: 'speciality_id', nullable: true })
  specialityId: number;

  @ManyToOne(() => Speciality, (speciality) => speciality.doctors)
  @JoinColumn({ name: 'speciality_id' })
  speciality: Speciality;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
