import * as moment from 'moment-timezone';
import {
  BadRequestException,
  ConflictException,
  Injectable,
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
    dtos: CreateAvailabilityDto[],
    doctorId: number,
  ): Promise<Availability[]> {
    if (!Array.isArray(dtos)) {
      throw new BadRequestException('Expected many Availabilities');
    }

    const availabilities = await Promise.all(
      dtos.map(async (dto) => {
        const doctorAvailability = await this.repo
          .createQueryBuilder('availability')
          .leftJoin('availability.doctor', 'doctor')
          .andWhere('doctor.id = :doctorId', { doctorId })
          .andWhere('availability.startTime <= :endTime', {
            endTime: dto.endTime,
          })
          .andWhere('availability.endTime >= :startTime', {
            startTime: dto.startTime,
          })
          .getMany();

        if (doctorAvailability.length > 0) {
          throw new ConflictException(
            'Doctor is already booked during the requested time slot',
          );
        }

        const availability = this.repo.create({
          doctorId,
          ...dto,
        });

        return availability;
      }),
    );

    const savedAvailabilities = await this.repo.save(availabilities);

    return savedAvailabilities;
  }

  async findAll(doctorId: number): Promise<Availability[]> {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      1,
    );
    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where('availability.doctorId = :doctorId', { doctorId })
      .andWhere('availability.startTime >= :threeMonthsAgo', { threeMonthsAgo })
      .getMany();
    return availabilities;
  }

  async getAvailabilityByDay(
    dayString: string,
    timezone = 'UTC',
  ): Promise<Availability[]> {
    const day = moment.tz(dayString, timezone);
    const startOfDay = day.clone().startOf('day');
    const endOfDay = day.clone().endOf('day');

    const availabilities = await this.repo
      .createQueryBuilder('availability')
      .where('availability.startTime >= :startOfDay', { startOfDay })
      .andWhere('availability.startTime <= :endOfDay', { endOfDay })
      .getMany();

    return availabilities;
  }

  async remove(ids: number[]) {
    // TODO: Implement ONLY IF NOT APPOINTMENT
    return this.repo
      .createQueryBuilder('availability')
      .delete()
      .whereInIds(ids)
      .execute();
  }
}
