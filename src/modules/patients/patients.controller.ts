import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Patient } from '@entities/Patient';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from '@modules/patients/patients.service';
import { PatientSearchOptionsDto } from '@modules/patients/dto/page-options.dto';
import { PatientsRes } from '@modules/patients/interfaces/patients-responce';
import { UpdatePatientDto } from './dto/update-patient.dto';

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
  @ApiOperation({ summary: 'Get latest patients or search by name' })
  @ApiResponse({
    status: 201,
    description: 'List of the patients found',
  })
  async getAll(
    @Query() searchOptions: PatientSearchOptionsDto,
  ): Promise<PatientsRes> {
    const response = await this.patientsService.getPatients(searchOptions);
    if (!response) throw new NotFoundException('There are no patients!');

    return response;
  }

  @Get('/:id')
  @ApiOperation({ summary: "Get full patient's info" })
  @ApiResponse({
    status: 201,
    description: 'Patient information with appointment notes',
  })
  @ApiResponse({
    status: 401,
    description: 'Patient not found',
  })
  async getPatientWithNotes(
    @Param() params: { id: number },
  ): Promise<IServerResponse<Patient>> {
    const patient = await this.patientsService.getPatientById(params.id);

    return {
      statusCode: HttpStatus.OK,
      data: patient,
    };
  }

  @Patch('update/:id')
  @ApiOperation({ summary: "Update patient's info" })
  @ApiResponse({
    status: 201,
    description: 'Patient information updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Patient not found',
  })
  async confirm(
    @Param() params: { id: number },
    @Body() dto: UpdatePatientDto,
  ): Promise<IServerResponse<UpdatePatientDto>> {
    const patient = await this.patientsService.updatePatient(+params.id, dto);

    return { statusCode: HttpStatus.OK, data: patient };
  }
}
