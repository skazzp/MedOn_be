import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { Appointment } from '@entities/Appointments';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

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
    timezone: string,
  ): Promise<Appointment> {
    const startTime = moment
      .tz(createAppointmentDto.startTime, timezone)
      .toDate();
    const endTime = moment.tz(createAppointmentDto.endTime, timezone).toDate();

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
    return this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('start_time < NOW() AND end_time > NOW()')
      .andWhere('(remote_doctor_id = :id OR local_doctor_id = :id)', { id })
      .getOne();
  }
}
