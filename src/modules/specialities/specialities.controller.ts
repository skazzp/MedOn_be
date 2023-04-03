import { Controller, Get, NotFoundException } from '@nestjs/common';
import { SpecialitiesService } from './specialities.service';

@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @Get()
  async getAll() {
    const specialities = await this.specialitiesService.getAllSpecialities();
    if (!specialities)
      throw new NotFoundException('There is no any speciality!');
    return specialities;
  }
}
