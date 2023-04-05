import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDoctorDto } from './dto/signup-doctor.dto';
import { ReconfirmDoctorDto } from './dto/reconfirm-doctor.dto';
import { IServerResponse } from '../../common/interfaces/serverResponses';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @ApiOperation({ summary: 'New doctor registration' })
  async signup(@Body() dto: SignupDoctorDto): Promise<IServerResponse> {
    const confirmLink = await this.authService.signup(dto);
    return { statusCode: HttpStatus.OK, message: confirmLink };
  }

  @Post('re-confirm')
  @ApiOperation({ summary: 'Request for new confirmation link' })
  async reConfirm(@Body() dto: ReconfirmDoctorDto): Promise<IServerResponse> {
    const confirmLink = await this.authService.reconfirm(dto);
    return {
      statusCode: HttpStatus.OK,
      message: confirmLink,
    };
  }

  @Get('confirm/:token')
  @ApiOperation({ summary: "Doctor's account verification" })
  async confirm(@Param() { token }): Promise<IServerResponse> {
    await this.authService.confirm(token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Account was successfully confirmed!',
    };
  }
}
