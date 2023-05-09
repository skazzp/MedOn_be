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
          startTime: availability.startTime,
          endTime: availability.endTime,
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
    startDate: Date,
  ): Promise<Availability[]> {
    const threeMonthsAgo = new Date(
      startDate.setMonth(startDate.getMonth() - 3),
    );
    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where('availability.doctorId = :doctorId', { doctorId })
      .andWhere('availability.startTime >= :threeMonthsAgo', {
        threeMonthsAgo: threeMonthsAgo.toISOString(),
      })
      .getMany();
    return availabilities;
  }

  async getAvailabilityByDay(dayString: string): Promise<Availability[]> {
    const day = new Date(dayString);
    const startOfDay = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      0,
      0,
      0,
    );
    const endOfDay = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      23,
      59,
      59,
    );
    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where('availability.startTime >= :startOfDay', {
        startOfDay: startOfDay.toISOString(),
      })
      .andWhere('availability.startTime <= :endOfDay', {
        endOfDay: endOfDay.toISOString(),
      })
      .getMany();

    if (availabilities.length === 0) {
      throw new NotFoundException(
        `No availability found for ${day.toISOString()} in any timezone`,
      );
    }

    return availabilities;
  }

  async remove(
    dto: { startTime: Date; endTime: Date }[],
    doctorId: number,
  ): Promise<void> {
    if (!Array.isArray(dto)) {
      throw new BadRequestException('Expect many availabilities');
    }
    // TODO: Implement ONLY IF NOT APPOINTMENT
    const qb = this.repo.createQueryBuilder('availability');
    dto.forEach(({ startTime, endTime }) => {
      qb.orWhere(
        '(startTime = :startTime AND endTime = :endTime AND doctorId = :doctorId)',
        { startTime, endTime, doctorId },
      );
    });
    const result = await qb.delete().execute();
    if (!result.affected) {
      throw new ConflictException('Availability not found');
    }
  }
}
