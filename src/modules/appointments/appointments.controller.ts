import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { Appointment } from '@entities/Appointments';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of appointments',
    type: Appointment,
    isArray: true,
  })
  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentsService.getAllAppointments();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the appointment',
    type: Appointment,
  })
  async getAppointmentById(@Param('id') id: number): Promise<Appointment> {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created appointment',
    type: Appointment,
  })
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Body('timezone') timezone: string,
  ): Promise<Appointment> {
    return this.appointmentsService.createAppointment(
      createAppointmentDto,
      timezone,
    );
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted' })
  async deleteAppointment(@Param('id') id: number): Promise<void> {
    await this.appointmentsService.deleteAppointment(id);
  }
}
