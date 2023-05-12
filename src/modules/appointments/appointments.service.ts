import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { Appointment } from '@entities/Appointments';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find();
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    const options: FindOneOptions<Appointment> = { where: { id } };
    return this.appointmentRepository.findOne(options);
  }

  async createAppointment(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const appointment: DeepPartial<Appointment> = {
      date: createAppointmentDto.date,
      time: createAppointmentDto.time,
      doctorId: createAppointmentDto.doctorId,
    };
    return this.appointmentRepository.save(appointment);
  }

  async deleteAppointment(id: number): Promise<void> {
    await this.appointmentRepository.delete(id);
  }
}
