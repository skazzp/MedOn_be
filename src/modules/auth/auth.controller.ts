import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { AuthService } from './auth.service';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { ReconfirmDoctorDto } from './dto/reconfirm-doctor.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'New doctor registration' })
  @ApiResponse({
    status: 201,
    description: 'Doctor was created, verification link was sent.',
  })
  async signup(@Body() dto: SignupDoctorDto): Promise<IServerResponse> {
    const confirmLink = await this.authService.signup(dto);
    return { statusCode: HttpStatus.OK, message: confirmLink };
  }

  @Post('re-confirm')
  @ApiOperation({ summary: 'Request for new confirmation link' })
  @ApiResponse({
    status: 201,
    description: 'Verification link was sent.',
  })
  @ApiResponse({
    status: 401,
    description: 'Verification link request was rejected',
  })
  async reConfirm(@Body() dto: ReconfirmDoctorDto): Promise<IServerResponse> {
    const confirmLink = await this.authService.reconfirm(dto);
    return {
      statusCode: HttpStatus.OK,
      message: confirmLink,
    };
  }

  @Get('confirm/:token')
  @ApiOperation({ summary: "Doctor's account verification" })
  @ApiResponse({
    status: 201,
    description: 'User was confirmed by email',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid confirmation link',
  })
  async confirm(@Param() params: { token: string }): Promise<IServerResponse> {
    await this.authService.confirm(params.token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Account was successfully confirmed!',
    };
  }
}
