import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Patients' })
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: Date;

  @Column({ name: 'gender' })
  gender: string;

  @Column({ name: 'address' })
  address: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'overview' })
  overview: string;

  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
