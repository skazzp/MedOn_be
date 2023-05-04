import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from '@entities/Availability';
import { Repository, UpdateResult } from 'typeorm';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability) private repo: Repository<Availability>,
  ) {}

  async create(dto: CreateAvailabilityDto): Promise<Availability> {
    const availability = await this.repo.save(dto);
    return availability;
  }

  async findAll() {
    return this.repo.createQueryBuilder().getMany();
  }

  async findOne(id: number): Promise<Availability> {
    return this.repo
      .createQueryBuilder('availability')
      .where('availability.id = :id', { id })
      .getOne();
  }

  async update(id: number, dto: UpdateAvailabilityDto): Promise<UpdateResult> {
    return this.repo
      .createQueryBuilder('availability')
      .update(Availability)
      .set(dto)
      .where('availability.id = :id', { id })
      .execute();
  }

  async remove(id: number) {
    return this.repo
      .createQueryBuilder('availability')
      .delete()
      .where('availability.id = :id', { id })
      .execute();
  }
}
