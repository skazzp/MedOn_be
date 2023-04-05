import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('reset-password')
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Get()
  @ApiOperation({ summary: 'Get email of forgot password doctor' })
  async getDoctorByEmail(@Body() dto: ResetPasswordDto): Promise<Doctor> {
    const doctor = await this.resetPasswordService.findDoctorByEmail(dto.email);
    return doctor;
  }

  // @Post()
  // @ApiOperation({ summary: 'Create patients' })
  // createPatient(@Body() dto: ResetPasswordDto): Promise<Doctor> {
  //   return this.resetPasswordService.createPatient(dto);
  // }
}
