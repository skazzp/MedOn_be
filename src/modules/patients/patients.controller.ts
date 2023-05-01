import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
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
} from '@modules/patients/dto';
import { PatientsRes } from '@modules/patients/interfaces/patients-responce';
import { Patient } from '@entities/Patient';
import { Roles } from '@decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { PatientsService } from './patients.service';

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
}
