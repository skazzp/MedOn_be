import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { CreatePatientDto } from '@modules/patients/dto/create-patient.dto';
import { Patient } from '@entities/Patient';
import { AuthGuard } from '@nestjs/passport';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'New patient registration' })
  @ApiResponse({
    status: 201,
    description: 'Patient was created',
  })
  @UseGuards(AuthGuard('jwt'))
  async addPatient(
    @Body() dto: CreatePatientDto,
  ): Promise<IServerResponse<Patient>> {
    const patient = await this.patientsService.addPatient(dto);
    return { statusCode: HttpStatus.OK, data: patient };
  }
}
