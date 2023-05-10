import * as moment from 'moment-timezone';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Availability } from '@entities/Availability';
import { monthsToSeeBeforeToday } from '@common/constants/availability';
import { Repository } from 'typeorm';
import { AvailabilityDto } from './dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability) private repo: Repository<Availability>,
  ) {}

  async createMultiples(
    dto: AvailabilityDto[],
    timezone: string,
    doctorId: number,
  ): Promise<Availability[]> {
    if (!Array.isArray(dto)) {
      throw new BadRequestException('Expected Many Availabilities');
    }
    try {
      const newAvailabilities = dto.map((availability) => {
        const startTime = moment.tz(availability.startTime, timezone).toDate();
        const endTime = moment.tz(availability.endTime, timezone).toDate();
        return this.repo.create({
          doctorId,
          startTime,
          endTime,
          title: availability.title,
        });
      });
      const result = await this.repo.save(newAvailabilities);
      return result;
    } catch (e) {
      throw new ConflictException('Availability already exists');
    }
  }

  async findAvailabilitiesForLastThreeMonths(
    doctorId: number,
    timezone: string,
  ): Promise<Availability[]> {
    const threeMonthsAgo = moment()
      .subtract(monthsToSeeBeforeToday, 'months')
      .startOf('day')
      .utcOffset(timezone)
      .toDate();
    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where('availability.doctorId = :doctorId', { doctorId })
      .andWhere('availability.startTime >= :threeMonthsAgo', { threeMonthsAgo })
      .getMany();
    return availabilities;
  }

  async getAvailabilityByDay(
    dayString: Date,
    timezone: string,
  ): Promise<Availability[]> {
    const startOfDay = moment
      .tz(dayString, timezone)
      .startOf('day')
      .toISOString();
    const endOfDay = moment.tz(dayString, timezone).endOf('day').toISOString();
    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where(
        `availability.startTime >= '${startOfDay}' AND availability.startTime <= '${endOfDay}'`,
      )
      .getMany();
    return availabilities;
  }

  async remove(
    availabilities: AvailabilityDto[],
    timezone: string,
    doctorId: number,
  ): Promise<void> {
    const result = await this.repo
      .createQueryBuilder()
      .delete()
      .from(Availability)
      .where('doctorId = :doctorId', { doctorId })
      .andWhere((qb) => {
        qb.where('startTime IN (:...startTimes)', {
          startTimes: availabilities.map((a) =>
            moment(a.startTime).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
          ),
        }).andWhere('endTime IN (:...endTimes)', {
          endTimes: availabilities.map((a) =>
            moment(a.endTime).tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
          ),
        });
      })
      .execute();

    if (!result.affected) {
      throw new NotFoundException('Availability not found');
    }
  }

  async updateMultiples(
    toDelete: AvailabilityDto[],
    toCreate: AvailabilityDto[],
    timezone: string,
    doctorId: number,
  ): Promise<Availability[]> {
    if (!Array.isArray(toDelete) || !Array.isArray(toCreate)) {
      throw new BadRequestException('Expected Two Arrays');
    }

    await this.remove(toDelete, timezone, doctorId);

    const newAvailabilities = await this.createMultiples(
      toCreate,
      timezone,
      doctorId,
    );

    return newAvailabilities;
  }
}
