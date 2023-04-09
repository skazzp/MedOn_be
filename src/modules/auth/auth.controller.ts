import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

  async login(
    @Body() dto: LoginDoctorDto,
  ): Promise<{ access_token: string } | { message: string }> {
    try {
      const token = await this.authService.login(dto);
      return token;
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }

}