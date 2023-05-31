import * as moment from 'moment-timezone';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';

import { Appointment } from '@entities/Appointments';
import { Doctor } from '@entities/Doctor';

import { Role } from '@common/enums';

import { PaginationOptionsDto } from './dto/pagination-options.dto';

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

  async getFutureAppointmentsByDoctorId(
    id: number,
    pagination: PaginationOptionsDto,
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
    pagination: PaginationOptionsDto,
    filter: 'today' | 'future' | 'past',
    showAll: boolean,
  ): Promise<Appointment[]> {
    let appointments;
    let whereClause;
    let orderClause: 'ASC' | 'DESC';

    const doctor = await this.doctorRepository.findOne({ where: { id } });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    switch (filter) {
      case 'today':
        whereClause =
          'appointment.startTime >= :startOfDay AND appointment.endTime <= :endOfDay';
        orderClause = 'ASC';
        break;
      case 'future':
        whereClause = 'appointment.startTime > :endOfDay';
        orderClause = 'ASC';
        break;
      case 'past':
        whereClause = 'appointment.endTime < :startOfDay';
        orderClause = 'DESC';
        break;
      default:
        throw new BadRequestException(`Invalid filter: ${filter}`);
    }

    const now = moment().utc().toDate();

    if (doctor.role === Role.LocalDoctor) {
      let appointmentQueryBuilder = this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .leftJoinAndSelect('appointment.localDoctor', 'localDoctor')
        .leftJoinAndSelect('appointment.remoteDoctor', 'remoteDoctor')
        .where(whereClause, {
          startOfDay: moment().startOf('day').toDate(),
          endOfDay: moment().endOf('day').toDate(),
          now,
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
        ])
        .orderBy('appointment.startTime', orderClause)
        .skip(pagination.offset)
        .take(pagination.limit);

      if (!showAll) {
        appointmentQueryBuilder = appointmentQueryBuilder.andWhere(
          `appointment.localDoctorId = :id`,
          { id },
        );
      }

      appointments = await appointmentQueryBuilder.getMany();
    } else if (doctor.role === Role.RemoteDoctor) {
      appointments = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .leftJoinAndSelect('appointment.localDoctor', 'localDoctor')
        .leftJoinAndSelect('appointment.remoteDoctor', 'remoteDoctor')
        .where(whereClause, {
          startOfDay: moment().startOf('day').toDate(),
          endOfDay: moment().endOf('day').toDate(),
          now,
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
        ])
        .orderBy('appointment.startTime', orderClause)
        .skip(pagination.offset)
        .take(pagination.limit)
        .getMany();
    } else {
      throw new BadRequestException('Invalid role');
    }

    return appointments;
  }

  async postLinkAppointment(id: number, link: string): Promise<void> {
    await this.appointmentRepository.update(id, { link });
  }
}
