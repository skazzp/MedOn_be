import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatientDto } from './dto/patient.dto';
import { PatientService } from './patient.service';
import { Patient } from '../../typeorm/entities/Patient';

@ApiTags('patients')
@Controller('patient')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get()
  @ApiOperation({ summary: "Get list of all patient's" })
  getAllPatients(): Promise<Patient[]> {
    return this.patientService.getAllPatients();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient with special ID' })
  getPatientById(@Param('id') id: number): Promise<Patient> {
    return this.patientService.getPatientById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create patient' })
  createPatient(@Body() dto: PatientDto): Promise<Patient> {
    return this.patientService.createPatient(dto);
  }
}
