import { Controller, Post, Body, Get, NotFoundException } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorDto } from './dto/doctor.dto';
import { Doctor } from '../../typeorm/entities/Doctor';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async getDoctorsList(): Promise<Doctor[]> {
    const doctors = await this.doctorsService.getAllDoctors();
    if (!doctors) throw new NotFoundException('List of doctors is empty');
    return doctors;
  }

  @Post()
  createDoctor(@Body() doctorDto: DoctorDto): Promise<Doctor> {
    return this.doctorsService.createDoctor(doctorDto);
  }
}
