import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

import { Appointment } from '@entities/Appointments';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';

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
    console.log('appointments:', appointments);

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

  async getFutureAppointmentsByDoctorId(id: number): Promise<Appointment[]> {
    const now = moment().toDate();

    const futureAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where(
        `appointment.startTime >= :now AND (appointment.localDoctorId = :id OR appointment.remoteDoctorId = :id)`,
        { now, id },
      )
      .getMany();

    return futureAppointments;
  }

  async getPastAppointmentsByDoctorId(id: number): Promise<Appointment[]> {
    const now = moment().toDate();

    const pastAppointments = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .where(
        `appointment.startTime < :now AND (appointment.localDoctorId = :id OR appointment.remoteDoctorId = :id)`,
        { now, id },
      )
      .getMany();
    return pastAppointments;
  }
}
