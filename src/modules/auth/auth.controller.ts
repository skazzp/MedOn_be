import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { IResetPasswordRequest } from '@common/interfaces/resetPasswordRequest';
import { ForgetPasswordDoctorDto } from '@modules/auth/dto/forgetPassword-doctor.dto';
import { ResetPasswordDoctorDto } from '@modules/auth/dto/resetPassword-doctor.dto';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { AuthService } from '@modules/auth/auth.service';
import { SignupDoctorDto } from '@modules/auth/dto/signup-doctor.dto';
import { ReconfirmDoctorDto } from '@modules/auth/dto/reconfirm-doctor.dto';
import { AuthResetPasswordGuard } from '@modules/auth/auth.guard';
import { LoginDoctorDto } from '@modules/auth/dto/login-doctor.dto';
import { AuthGuard } from '@nestjs/passport';
import { IDoctorResponse } from '@modules/auth/type/IDoctorResponse';

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

  @Post('forget')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({
    status: 201,
    description: 'Email was sent',
  })
  @ApiResponse({
    status: 401,
    description: 'Email do not exist',
  })
  async forgetPassword(
    @Body() dto: ForgetPasswordDoctorDto,
  ): Promise<IServerResponse> {
    await this.authService.forgetPassword({ email: dto.email });
    return {
      statusCode: HttpStatus.OK,
      message: 'Email was sent',
    };
  }

  @UseGuards(AuthResetPasswordGuard)
  @Post('reset')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: 201,
    description: 'Password was updated',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid token',
  })
  async resetPassword(
    @Request() req: IResetPasswordRequest,
    @Body() dto: ResetPasswordDoctorDto,
  ): Promise<IServerResponse> {
    await this.authService.resetPassword({
      email: req.doctor?.email,
      newPassword: dto.newPassword,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Password was updated',
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Doctor login' })
  async login(@Body() dto: LoginDoctorDto): Promise<object> {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getMe(@Req() req: Request & { user: IDoctorResponse }) {
    return req.user;
  }
}
