import * as moment from 'moment-timezone';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

import { Role, Filter, ShowAll, Order } from '@common/enums';
import { oneAsString } from '@common/constants/appointments';

import { Appointment } from '@entities/Appointments';
import { Doctor } from '@entities/Doctor';

import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { AllPaginationCalendarOptionsDto } from '@modules/appointments/dto/allPaginationCalendar-options.dto';
import { AllPaginationListOptionsDto } from '@modules/appointments/dto/allPaginationList-options.dto';
import { FuturePaginationOptionsDto } from '@modules/appointments/dto/futurePagination-options.dto';
import { AvailabilityService } from '@modules/availability/availability.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly availabilityService: AvailabilityService,
    private config: ConfigService,
  ) {}

  async getAllAppointmentsByDoctorId(id: number): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.localDoctorId = :id', { id })
      .orWhere('appointment.remoteDoctorId = :id', { id })
      .getMany();
    if (appointments.length === 0)
      throw new UnauthorizedException('Appointments no found!');

    return appointments;
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    const options: FindOneOptions<Appointment> = { where: { id } };
    return this.appointmentRepository.findOne(options);
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const startTime = moment(createAppointmentDto.startTime).utc().toDate();
    const endTime = moment(createAppointmentDto.endTime).utc().toDate();

    const appointment: DeepPartial<Appointment> = {
      link: createAppointmentDto.link,
      startTime,
      endTime,
      localDoctorId: createAppointmentDto.localDoctorId,
      remoteDoctorId: createAppointmentDto.remoteDoctorId,
      patientId: createAppointmentDto.patientId,
    };

    try {
      const savedAppointment = await this.appointmentRepository.save(
        appointment,
      );

      return savedAppointment;
    } catch (error) {
      throw new ConflictException(
        'Error: An appointment with this time interval already exists.',
      );
    }
  }

  async deleteAppointment(id: number): Promise<void> {
    const appointment = await this.getAppointmentById(id);
    const { remoteDoctorId, startTime, endTime } = appointment;

    const now = moment().utc().toDate();
    const end = moment(endTime).utc().toDate();

    if (end > now) {
      const availability =
        await this.availabilityService.getAvailabilityByDoctorId(
          remoteDoctorId,
          startTime,
          endTime,
        );
      availability.isAvailable = true;
      await this.availabilityService.updateAvailability(availability);

      const appointmentQuery = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .delete()
        .where({
          id,
        })
        .execute();

      if (appointmentQuery.affected === 0) {
        throw new UnauthorizedException('No Appointments was found to delete');
      }
    } else {
      throw new BadRequestException('Only future appointments can be deleted');
    }
  }

  async getAppointmentsByPatientId(id: number): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.remoteDoctor', 'remoteDoctor')
      .leftJoinAndSelect('appointment.localDoctor', 'localDoctor')
      .select([
        'appointment.id',
        'appointment.link',
        'appointment.startTime',
        'appointment.endTime',
        'appointment.localDoctorId',
        'appointment.remoteDoctorId',
        'appointment.patientId',
        'appointment.createdAt',
        'appointment.updatedAt',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'localDoctor.firstName',
        'localDoctor.lastName',
      ])
      .where('appointment.patientId = :id', { id })
      .getMany();

    return appointments;
  }

  async getFutureAppointmentsByDoctorId(
    id: number,
    pagination: FuturePaginationOptionsDto,
  ): Promise<Appointment[]> {
    const now = moment().utc().toDate();

    const futureAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.remoteDoctor', 'remoteDoctor')
      .leftJoinAndSelect('appointment.localDoctor', 'localDoctor')
      .where(
        `appointment.endTime >= :now AND (appointment.localDoctorId = :id OR appointment.remoteDoctorId = :id)`,
        { now, id },
      )
      .orderBy('appointment.startTime', 'ASC')
      .select([
        'appointment.id',
        'appointment.link',
        'appointment.startTime',
        'appointment.endTime',
        'patient.id',
        'patient.firstName',
        'patient.lastName',
        'patient.dateOfBirth',
        'patient.gender',
        'patient.overview',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'localDoctor.firstName',
        'localDoctor.lastName',
      ])
      .skip(pagination.offset)
      .take(pagination.limit)
      .getMany();

    return futureAppointments;
  }

  async getAllListAppointments(
    id: number,
    pagination: AllPaginationListOptionsDto,
  ): Promise<Appointment[]> {
    const { page, filter, showAll, limit } = pagination;

    if (page <= 0) {
      throw new BadRequestException('Page must be greater than 0');
    }

    if (filter === Filter.today && page.toString() !== oneAsString) {
      throw new BadRequestException('Today page cannot be different than 1');
    }

    const doctor = await this.doctorRepository.findOne({ where: { id } });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    let whereClause: string;
    let orderClause: Order;

    switch (filter) {
      case Filter.today:
        whereClause =
          'appointment.startTime >= :startOfDay AND appointment.endTime <= :endOfDay';
        orderClause = Order.asc;
        break;

      case Filter.future:
        whereClause = 'appointment.startTime >= :nextDayStart';
        orderClause = Order.asc;
        break;

      case Filter.past:
        whereClause = 'appointment.endTime <= :pastDayStart';
        orderClause = Order.desc;
        break;

      default:
        throw new BadRequestException(`Invalid filter: ${filter}`);
    }

    let appointmentQueryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.localDoctor', 'localDoctor')
      .leftJoinAndSelect('appointment.remoteDoctor', 'remoteDoctor')
      .where(whereClause, {
        now: moment().utc().toDate(),
        startOfDay: moment().startOf('day').toDate(),
        endOfDay: moment().endOf('day').toDate(),
        nextDayStart: moment().add(page, 'day').startOf('day').toDate(),
        pastDayStart: moment().subtract(page, 'day').startOf('day').toDate(),
      })
      .select([
        'appointment.id',
        'appointment.link',
        'appointment.startTime',
        'appointment.endTime',
        'patient.id',
        'patient.firstName',
        'patient.lastName',
        'patient.dateOfBirth',
        'patient.gender',
        'patient.overview',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
      ]);

    if (!(showAll in ShowAll)) {
      throw new BadRequestException('Invalid showAll value');
    }

    if (doctor.role === Role.LocalDoctor && showAll === ShowAll.false) {
      appointmentQueryBuilder = appointmentQueryBuilder.andWhere(
        `appointment.localDoctorId = :id`,
        { id },
      );
    } else if (doctor.role === Role.RemoteDoctor) {
      appointmentQueryBuilder = appointmentQueryBuilder.andWhere(
        `appointment.remoteDoctorId = :id`,
        { id },
      );
    }

    appointmentQueryBuilder = appointmentQueryBuilder
      .orderBy('appointment.startTime', orderClause)
      .take(limit * page);

    const appointments = await appointmentQueryBuilder.getMany();

    return appointments;
  }

  async getAllCalendarAppointments(
    id: number,
    pagination: AllPaginationCalendarOptionsDto,
  ): Promise<Appointment[]> {
    const { showAll } = pagination;

    let appointmentsQueryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.localDoctor', 'localDoctor')
      .leftJoinAndSelect('appointment.remoteDoctor', 'remoteDoctor')
      .where(
        'appointment.startTime >= :sixMonthsAgo AND appointment.startTime <= :sixMonthsAhead',
        {
          sixMonthsAgo: moment().subtract(6, 'months').startOf('day').toDate(),
          sixMonthsAhead: moment().add(6, 'months').endOf('day').toDate(),
        },
      )
      .select([
        'appointment.id',
        'appointment.link',
        'appointment.startTime',
        'appointment.endTime',
        'patient.id',
        'patient.firstName',
        'patient.lastName',
        'patient.dateOfBirth',
        'patient.gender',
        'patient.overview',
        'localDoctor.id',
        'localDoctor.firstName',
        'localDoctor.lastName',
        'remoteDoctor.id',
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
      ]);

    const doctor = await this.doctorRepository.findOne({ where: { id } });

    if (!(showAll in ShowAll)) {
      throw new BadRequestException('Invalid showAll value');
    }

    if (doctor.role === Role.LocalDoctor && showAll === ShowAll.false) {
      appointmentsQueryBuilder = appointmentsQueryBuilder.andWhere(
        'appointment.localDoctorId = :id',
        {
          id,
        },
      );
    } else if (doctor.role === Role.RemoteDoctor) {
      appointmentsQueryBuilder = appointmentsQueryBuilder.andWhere(
        'appointment.remoteDoctorId = :id',
        {
          id,
        },
      );
    }

    const appointments = await appointmentsQueryBuilder.getMany();

    return appointments;
  }

  async postLinkAppointment(id: number, link: string): Promise<void> {
    await this.appointmentRepository.update(id, { link });
  }

  async getActiveAppointmentsByUserId(id: number): Promise<Appointment[]> {
    return this.appointmentRepository
      .createQueryBuilder('appointments')
      .leftJoinAndSelect('appointments.patient', 'patient')
      .leftJoinAndSelect('appointments.remoteDoctor', 'remoteDoctor')
      .leftJoinAndSelect('appointments.localDoctor', 'localDoctor')
      .where(
        '(appointments.localDoctorId = :id OR appointments.remoteDoctorId = :id)',
        { id },
      )
      .andWhere('(appointments.endTime > :now)', {
        now: moment().utc().toDate(),
      })
      .orderBy('appointments.startTime')
      .getMany();
  }
}
