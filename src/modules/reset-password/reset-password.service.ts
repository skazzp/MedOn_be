import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { Repository } from 'typeorm';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  findDoctorByEmail(email: string): Promise<Doctor> {
    return this.doctorRepo.findOne({ where: { email } });
  }
}
