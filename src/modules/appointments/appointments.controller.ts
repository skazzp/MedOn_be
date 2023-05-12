import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { Appointment } from '@entities/Appointments';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentsService.getAllAppointments();
  }

  @Get(':id')
  async getAppointmentById(
    @Param('id') id: number,
  ): Promise<Appointment | undefined> {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Post()
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @Delete(':id')
  async deleteAppointment(@Param('id') id: number): Promise<void> {
    await this.appointmentsService.deleteAppointment(id);
  }
}
