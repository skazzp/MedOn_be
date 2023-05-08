import * as moment from 'moment-timezone';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from '@entities/Availability';
import { Repository } from 'typeorm';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability) private repo: Repository<Availability>,
  ) {}

  async createMultiples(
    dto: CreateAvailabilityDto[],
    doctorId: number,
  ): Promise<Availability[]> {
    if (!Array.isArray(dto)) {
      throw new BadRequestException('Expected Many Availabilities');
    }
    try {
      const newAvailabilities = dto.map((availability) => {
        return this.repo.create({
          doctorId,
          ...availability,
        });
      });
      const result = await this.repo.save(newAvailabilities);
      return result;
    } catch {
      throw new ConflictException('This Availability Time Already Exists');
    }
  }

  async findAvailabilitiesForLastThreeMonths(
    doctorId: number,
    timezone: string,
  ): Promise<Availability[]> {
    const threeMonthsAgo = moment.tz(timezone).subtract(3, 'months');
    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where('availability.doctorId = :doctorId', { doctorId })
      .andWhere('availability.startTime >= :threeMonthsAgo', {
        threeMonthsAgo: threeMonthsAgo.toDate(),
      })
      .getMany();
    return availabilities;
  }

  async getAvailabilityByDay(
    dayString: string,
    timezone: string,
  ): Promise<Availability[]> {
    if (!moment.tz.zone(timezone)) {
      throw new BadRequestException(`Invalid timezone: ${timezone}`);
    }

    const day = moment.tz(dayString, timezone);
    const startOfDay = day.clone().startOf('day');
    const endOfDay = day.clone().endOf('day');
    const startOfDayInTimeZone = moment.tz(startOfDay, timezone).format();
    const endOfDayInTimeZone = moment.tz(endOfDay, timezone).format();

    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where('availability.startTime >= :startOfDay', {
        startOfDay: startOfDayInTimeZone,
      })
      .andWhere('availability.startTime <= :endOfDay', {
        endOfDay: endOfDayInTimeZone,
      })
      .getMany();

    if (availabilities.length === 0) {
      throw new NotFoundException(
        `No availability found for ${dayString} in ${timezone} timezone`,
      );
    }

    return availabilities;
  }

  async remove(ids: number[]): Promise<void> {
    if (!Array.isArray(ids)) {
      throw new BadRequestException('ids must be an array');
    }
    // TODO: Implement ONLY IF NOT APPOINTMENT
    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .delete()
      .whereInIds(ids)
      .execute();
    if (!availabilities.affected) {
      throw new ConflictException('Availability not found');
    }
  }
}
