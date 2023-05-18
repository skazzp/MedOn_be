import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { Appointment } from '@entities/Appointments';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@guards/roles.guard';
import { Roles } from '@decorators/roles.decorator';
import { Role } from '@common/enums';
import {
  IProfileResponse,
  IProfileResponseOne,
  RequestWithUser,
} from '@common/interfaces/Appointment';
import { AppointmentsService } from './appointments.service';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Get('/all')
  @ApiOperation({ summary: 'Get all appointments for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of appointments',
    type: Appointment,
    isArray: true,
  })
  async getAllAppointmentsForCurrentUser(
    @Req() request: RequestWithUser,
  ): Promise<IProfileResponse> {
    const { user } = request;
    const appointments = await this.appointmentsService.getAllAppointments(
      user.userId,
    );
    return {
      statusCode: HttpStatus.OK,
      data: appointments,
    };
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the appointment',
    type: Appointment,
  })
  async getAppointmentById(
    @Param('id') id: number,
  ): Promise<IProfileResponseOne> {
    const appointmentId = await this.appointmentsService.getAppointmentById(id);
    return {
      statusCode: HttpStatus.OK,
      data: appointmentId,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({
    status: 201,
    description: 'Returns the created appointment',
    type: Appointment,
  })
  @UseGuards(RolesGuard)
  @Roles(Role.LocalDoctor)
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted' })
  async deleteAppointment(@Param('id') id: number): Promise<void> {
    await this.appointmentsService.deleteAppointment(id);
  }
}
