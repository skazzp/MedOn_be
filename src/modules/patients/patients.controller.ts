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
import { AuthGuard } from '@nestjs/passport';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { Role } from '@common/enums';
import {
  CreatePatientDto,
  PatientSearchOptionsDto,
  UpdatePatientDto,
} from '@modules/patients/dto';
import { PatientsRes } from '@modules/patients/interfaces/patients-responce';
import { Patient } from '@entities/Patient';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { PatientsService } from '@modules/patients/patients.service';
import { GetNotesParam } from './interfaces/patients-params';

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
  @Roles(Role.LocalDoctor)
  @UseGuards(RolesGuard)
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
    @Param() params: GetNotesParam,
    @Body() dto: UpdatePatientDto,
  ): Promise<IServerResponse<UpdatePatientDto>> {
    const patient = await this.patientsService.updatePatient(params.id, dto);

    return { statusCode: HttpStatus.OK, data: patient };
  }
}
