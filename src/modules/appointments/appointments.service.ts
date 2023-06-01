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

import { Role, Filter, ShowAll } from '@common/enums';

import { Appointment } from '@entities/Appointments';
import { Doctor } from '@entities/Doctor';

import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { AllPaginationOptionsDto } from '@modules/appointments/dto/allPagination-options.dto';
import { FuturePaginationOptionsDto } from '@modules/appointments/dto/futurePagination-options.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
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
    await this.appointmentRepository.delete(id);
  }

  async getAppointmentsByPatientId(id: number): Promise<Appointment[]> {
    const appointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.patientId = :id', { id })
      .getMany();

    return appointments;
  }

  async getActiveAppointmentByDoctorId(id: number): Promise<Appointment> {
    const now = moment().utc().toDate();
    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('start_time < :now AND end_time > :now', { now })
      .andWhere('(remote_doctor_id = :id OR local_doctor_id = :id)', { id })
      .getOne();
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

  async getAllAppointments(
    id: number,
    pagination: AllPaginationOptionsDto,
  ): Promise<Appointment[]> {
    const { page, filter, showAll } = pagination;

    if (page <= 0) {
      throw new BadRequestException('Page must be greater than 0');
    }

    if (filter === Filter.today && page.toString() !== '1') {
      throw new BadRequestException('Today page cannot be different than 1');
    }

    const doctor = await this.doctorRepository.findOne({ where: { id } });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    let whereClause: string;

    switch (filter) {
      case Filter.today:
        whereClause =
          'appointment.startTime >= :startOfDay AND appointment.endTime <= :endOfDay';
        break;

      case Filter.future:
        whereClause =
          'appointment.startTime >= :nextDayStart AND appointment.endTime <= :nextDayEnd';
        break;

      case Filter.past:
        whereClause =
          'appointment.endTime >= :pastDayStart AND appointment.endTime < :pastDayEnd';
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
        nextDayEnd: moment().add(page, 'day').endOf('day').toDate(),
        pastDayStart: moment().subtract(page, 'day').startOf('day').toDate(),
        pastDayEnd: moment().subtract(page, 'day').endOf('day').toDate(),
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
    } else {
      throw new BadRequestException('Invalid role');
    }

    appointmentQueryBuilder = appointmentQueryBuilder.orderBy(
      'appointment.startTime',
      'ASC',
    );

    const appointments = await appointmentQueryBuilder.getMany();

    return appointments;
  }

  async postLinkAppointment(id: number, link: string): Promise<void> {
    await this.appointmentRepository.update(id, { link });
  }
}
