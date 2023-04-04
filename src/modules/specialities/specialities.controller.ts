import { Controller, Get, NotFoundException } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';
import { Speciality } from '../../typeorm/entities/Speciality';

@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @Get()
  async getAll(): Promise<Speciality[]> {
    const specialities = await this.specialitiesService.getAllSpecialities();
    if (!specialities)
      throw new NotFoundException('There is no any speciality!');
    return specialities;
  }
}
