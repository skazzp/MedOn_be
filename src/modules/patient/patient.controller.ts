import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
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
  async getAllPatients(): Promise<Patient[]> {
    const patients = await this.patientService.getAllPatients();
    if (patients.length === 0)
      throw new NotFoundException('There is no any record about patients');
    return patients;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient with special ID' })
  async getPatientById(@Param('id') id: number): Promise<Patient> {
    const patient = await this.patientService.getPatientById(id);
    if (!patient)
      throw new NotFoundException(`Patient with id ${id} doesn't exist`);
    return patient;
  }

  @Post()
  @ApiOperation({ summary: 'Create patient' })
  async createPatient(@Body() dto: PatientDto): Promise<Patient> {
    return this.patientService.createPatient(dto);
  }
}
