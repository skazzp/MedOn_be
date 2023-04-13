import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Doctor } from '@entities/Doctor';

@Entity({ name: 'speciality' })
export class Speciality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => Doctor, (doctor) => doctor.speciality)
  doctors: Doctor[];
}
