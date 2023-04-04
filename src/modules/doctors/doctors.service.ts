import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorDto } from './dto/doctor.dto';
import { Doctor } from '../../typeorm/entities/Doctor';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  getAllDoctors(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }

  createDoctor(doctorDto: DoctorDto): Promise<Doctor> {
    const doctor = this.doctorRepo.create(doctorDto);
    return this.doctorRepo.save(doctor);
  }
}
