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
  Query,
  Patch,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '@decorators/roles.decorator';
import { Appointment } from '@entities/Appointments';
import { RolesGuard } from '@guards/roles.guard';

import { Role } from '@common/enums';
import { RequestWithUser } from '@common/interfaces/Appointment';
import { IServerResponse } from '@common/interfaces/serverResponses';

import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { AvailabilityService } from '@modules/availability/availability.service';
import { AppointmentsService } from '@modules/appointments/appointments.service';
import { AppointmentsGateway } from '@modules/appointments/appointments.gateway';
import { FuturePaginationOptionsDto } from '@modules/appointments/dto/futurePagination-options.dto';
import { AllPaginationListOptionsDto } from '@modules/appointments/dto/allPaginationList-options.dto';
import { AllPaginationCalendarOptionsDto } from '@modules/appointments/dto/allPaginationCalendar-options.dto';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly availabilityService: AvailabilityService,
    private readonly appointmentsGateway: AppointmentsGateway,
  ) {}

  @Get('/list')
  @ApiOperation({ summary: 'Get appointments for the list' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of appointments',
    type: Appointment,
    isArray: true,
  })
  async getAllAppointmentsList(
    @Req() request: RequestWithUser,
    @Query() pagination: AllPaginationListOptionsDto,
  ): Promise<IServerResponse> {
    const appointments = await this.appointmentsService.getAllListAppointments(
      request.user.userId,
      pagination,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Appointments retrieved successfully',
      data: appointments,
    };
  }

  @Get('/calendar')
  @ApiOperation({ summary: 'Get appointments for the calendar' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of appointments',
    type: Appointment,
    isArray: true,
  })
  async getAllAppointmentsCalendar(
    @Req() request: RequestWithUser,
    @Query() pagination: AllPaginationCalendarOptionsDto,
  ): Promise<IServerResponse> {
    const appointments =
      await this.appointmentsService.getAllCalendarAppointments(
        request.user.userId,
        pagination,
      );
    return {
      statusCode: HttpStatus.OK,
      message: 'Appointments retrieved successfully',
      data: appointments,
    };
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get all appointments for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of appointments',
    type: Appointment,
    isArray: true,
  })
  async getAllAppointmentsForCurrentDoctor(
    @Req() request: RequestWithUser,
  ): Promise<IServerResponse> {
    const { user } = request;
    const appointments =
      await this.appointmentsService.getAllAppointmentsByDoctorId(user.userId);
    return {
      statusCode: HttpStatus.OK,
      data: appointments,
    };
  }

  @Get('/future')
  @ApiOperation({ summary: 'Get future appointments for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns an array of appointments',
    type: Appointment,
    isArray: true,
  })
  async getFutureAppointmentsForCurrentDoctor(
    @Req() request: RequestWithUser,
    @Query() pagination: FuturePaginationOptionsDto,
  ): Promise<IServerResponse> {
    const appointments =
      await this.appointmentsService.getFutureAppointmentsByDoctorId(
        request.user.userId,
        pagination,
      );

    return {
      statusCode: HttpStatus.OK,
      message: 'Future appointments retrieved successfully',
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
  async getAppointmentById(@Param('id') id: number): Promise<IServerResponse> {
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
    const appointment = await this.appointmentsService.createAppointment(
      createAppointmentDto,
    );

    await this.appointmentsGateway.sendAppointmentsHaveChanged(
      createAppointmentDto.remoteDoctorId,
    );
    await this.appointmentsGateway.sendAppointmentsHaveChanged(
      createAppointmentDto.localDoctorId,
    );

    const { startTime, endTime, remoteDoctorId } = createAppointmentDto;
    await this.availabilityService.updateAvailableStatus(
      startTime,
      endTime,
      remoteDoctorId,
    );

    return appointment;
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted' })
  async deleteAppointment(
    @Request() request: RequestWithUser,
    @Param('id') id: number,
  ): Promise<void> {
    const { remoteDoctorId, localDoctorId } =
      await this.appointmentsService.getAppointmentById(id);

    await this.appointmentsService.deleteAppointment(id);

    await this.appointmentsGateway.sendAppointmentsHaveChanged(remoteDoctorId);

    await this.appointmentsGateway.sendAppointmentsHaveChanged(localDoctorId);
  }

  @Get('/patient/:id')
  @ApiOperation({ summary: "Get appointments by patient's ID" })
  @ApiResponse({
    status: 200,
    description: "Returns appointment's array",
    type: Appointment,
  })
  async getAppointmentsByPatientId(
    @Param('id') id: number,
  ): Promise<IServerResponse> {
    const appointmentId =
      await this.appointmentsService.getAppointmentsByPatientId(id);
    return {
      statusCode: HttpStatus.OK,
      data: appointmentId,
    };
  }

  @Patch('/link/:id')
  @Roles(Role.LocalDoctor)
  @ApiOperation({ summary: 'Link appointment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Insert Link to Zoom call to appointment',
    type: Appointment,
  })
  async linkAppointment(
    @Param('id') id: number,
    @Body() dto: { link: string },
  ): Promise<IServerResponse> {
    await this.appointmentsService.postLinkAppointment(id, dto.link);
    return {
      statusCode: HttpStatus.OK,
      message: 'Link to Zoom call added successfully',
    };
  }

  @Get('/active/:id')
  @ApiOperation({
    summary: "Get all appointments for Doctor that haven't  finished yet",
  })
  async getActiveAppointments(
    @Param('id') id: number,
  ): Promise<IServerResponse<Appointment[]>> {
    const appointments =
      await this.appointmentsService.getActiveAppointmentsByUserId(id);
    return {
      statusCode: HttpStatus.OK,
      data: appointments,
    };
  }
}
