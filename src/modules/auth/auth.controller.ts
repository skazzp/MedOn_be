import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDoctorDto } from './dto/signup-doctor.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @ApiOperation({ summary: 'New doctor registration' })
  signup(
    @Body() doctorDto: SignupDoctorDto,
  ): Promise<{ confirmationLink: string }> {
    return this.authService.signup(doctorDto);
  }

  @Get('confirm/:token')
  @ApiOperation({ summary: "Doctor's account verification" })
  confirm(@Param() { token }): Promise<{ account_confirmed: boolean }> {
    return this.authService.confirm(token);
  }
}
