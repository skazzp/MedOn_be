import * as moment from 'moment-timezone';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Appointment } from '@entities/Appointments';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { PaginationOptionsDto } from './dto/pagination-options.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
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

  async getPastAppointmentsByDoctorId(
    id: number,
    pagination: PaginationOptionsDto,
  ): Promise<Appointment[]> {
    const now = moment().utc().toDate();

    const pastAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.remoteDoctor', 'remoteDoctor')
      .leftJoinAndSelect('appointment.localDoctor', 'localDoctor')
      .where(
        `appointment.endTime < :now AND (appointment.localDoctorId = :id OR appointment.remoteDoctorId = :id)`,
        { now, id },
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
        'remoteDoctor.firstName',
        'remoteDoctor.lastName',
        'localDoctor.firstName',
        'localDoctor.lastName',
      ])
      .orderBy('appointment.startTime', 'DESC')
      .skip(pagination.offset)
      .take(pagination.limit)
      .getMany();

    return pastAppointments;
  }

  async postLinkAppointment(id: number, link: string): Promise<void> {
    await this.appointmentRepository.update(id, { link });
  }
}
