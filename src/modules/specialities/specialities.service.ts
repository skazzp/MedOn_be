import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Speciality } from '../../typeorm/entities/Speciality';

@Injectable()
export class SpecialitiesService {
  constructor(
    @InjectRepository(Speciality)
    private specialityRepo: Repository<Speciality>,
  ) {}

  getAllSpecialities(): Promise<Speciality[]> {
    return this.specialityRepo.find();
  }
}
