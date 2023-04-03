import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from 'src/common/enums/Gender';

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

  @Column({ name: 'date_of_birth', type: 'datetime' })
  dateOfBirth: Date;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'overview', type: 'text' })
  overview: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
