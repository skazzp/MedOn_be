import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Doctor } from '@entities/Doctor';
import { AuthService } from '@modules/auth.service';
import { LoginDoctorDto } from '@modules/dto/login-doctor.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Doctor login' })
  @ApiResponse({
    status: 200,
    description: 'Doctor was logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async login(@Body() dto: LoginDoctorDto) {
    const token = await this.authService.login(dto);
    return token;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getMe(@Req() req: Request & { user: Doctor }) {
    return req.user;
  }
}
