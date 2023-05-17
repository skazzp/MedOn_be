import { ConflictException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { Appointment } from '@entities/Appointments';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import * as moment from 'moment-timezone';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    private readonly httpService: HttpService,
    private config: ConfigService,
  ) {}

  async createZoomMeeting(): Promise<string> {
    const zoomApiUrl = 'https://api.zoom.us/v2/users/me/meetings';
    const token = this.config.get('YOUR_ZOOM_API_JWT');

    const response = await firstValueFrom(
      this.httpService.post(
        zoomApiUrl,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );

    const { joinUrl } = response.data;
    return joinUrl;
  }

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
    const startTime = new Date(createAppointmentDto.startTime);
    startTime.setUTCMinutes(
      startTime.getUTCMinutes() + startTime.getTimezoneOffset(),
    );
    startTime.setUTCSeconds(0);

    const endTime = new Date(createAppointmentDto.endTime);
    endTime.setUTCMinutes(
      endTime.getUTCMinutes() + endTime.getTimezoneOffset(),
    );
    endTime.setUTCSeconds(0);

    const link = await this.createZoomMeeting();

    const appointment: DeepPartial<Appointment> = {
      startTime,
      endTime,
      localDoctorId: createAppointmentDto.localDoctorId,
      remoteDoctorId: createAppointmentDto.remoteDoctorId,
      patientId: createAppointmentDto.patientId,
    };

    if (link) {
      appointment.link = link;
    } else {
      appointment.link = 'https://api.zoom.us/';
    }

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
}
