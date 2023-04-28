import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Patient } from '@entities/Patient';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from '@modules/patients/patients.service';
import { PatientSearchOptionsDto } from '@modules/patients/dto/pageOptions.dto';
import {
  INoteRequest,
  PatientsRes,
} from '@modules/patients/interfaces/patients-responce';
import { PatientNotes } from '@entities/PatientNotes';
import { CreatePatientNoteDto } from '@modules/patients/dto/create-patient-note.dto';

@ApiTags('patients')
@Controller('patients')
@UseGuards(AuthGuard('jwt'))
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'New patient registration' })
  @ApiResponse({
    status: 201,
    description: 'Patient was created',
  })
  async addPatient(
    @Body() dto: CreatePatientDto,
  ): Promise<IServerResponse<Patient>> {
    const patient = await this.patientsService.addPatient(dto);

    return { statusCode: HttpStatus.OK, data: patient };
  }

  @Get()
  @ApiOperation({ summary: 'Get latest patients' })
  @ApiResponse({
    status: 201,
    description: 'Get latest patients or search by name',
  })
  async getAll(
    @Query() searchOptions: PatientSearchOptionsDto,
  ): Promise<PatientsRes> {
    const response = await this.patientsService.getPatients(searchOptions);
    if (!response) throw new NotFoundException('There are no patients!');

    return response;
  }

  @Get('/:id')
  @ApiOperation({ summary: "Doctor's account verification" })
  @ApiResponse({
    status: 201,
    description: 'User was confirmed by email',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid confirmation link',
  })
  async confirm(
    @Param() params: { id: number },
  ): Promise<IServerResponse<Patient>> {
    const patient = await this.patientsService.getPatientById(params.id);

    return {
      statusCode: HttpStatus.OK,
      data: patient,
    };
  }

  @Post('/create-note')
  @ApiOperation({ summary: 'New patient note' })
  @ApiResponse({
    status: 201,
    description: 'Patient note was created',
  })
  async addPatientNote(
    @Request() req: INoteRequest,
    @Body()
    dto: CreatePatientNoteDto,
  ): Promise<IServerResponse<PatientNotes>> {
    const newNoteData = { ...dto, doctorId: req.user.userId };
    const note = await this.patientsService.addPatientNote(newNoteData);

    return { statusCode: HttpStatus.OK, data: note };
  }
}
