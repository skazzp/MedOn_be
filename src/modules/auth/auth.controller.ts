import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@modules/auth/auth.service';
import { LoginDoctorDto } from '@modules/auth/dto/login-doctor.dto';
import { IResetPasswordRequest } from '@common/interfaces/resetPassword';
import { ForgetPasswordDoctorDto } from '@modules/auth/dto/forgetPassword-doctor.dto';
import { ResetPasswordDoctorDto } from '@modules/auth/dto/resetPassword-doctor.dto';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { SignupDoctorDto } from '@modules/auth/dto/signup-doctor.dto';
import { ReconfirmDoctorDto } from '@modules/auth/dto/reconfirm-doctor.dto';
import { AuthGuard } from '@nestjs/passport';
import { Doctor } from '@entities/Doctor';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PasswordResetGuard } from './guards/passReset.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Doctor login' })
  async login(@Body() dto: LoginDoctorDto): Promise<object> {
    const token = await this.authService.login(dto);
    return token;
  }

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
    status: 200,
    description: 'New confirmation link was sent',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  async reconfirm(@Body() dto: ReconfirmDoctorDto): Promise<IServerResponse> {
    const confirmLink = await this.authService.reconfirm(dto);
    return { statusCode: HttpStatus.OK, message: confirmLink };
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
    description: 'Email does not exist',
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

  @UseGuards(PasswordResetGuard)
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

  @Get('google/login')
  @ApiOperation({ summary: 'Login with Google OAuth' })
  @UseGuards(AuthGuard('google'))
  handleLogin(): { msg: string } {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @ApiOperation({ summary: 'Google OAuth callback endpoint' })
  @UseGuards(AuthGuard('google'))
  async handleRedirect(
    @Req() req: Request & { user: Doctor },
    @Res() res: Response,
  ): Promise<void> {
    const accessToken = await this.authService.getToken({
      email: req.user.email,
    });

    return res.redirect(
      `${this.config.get('BASE_FRONT_URL')}/login?gtoken=${accessToken}`,
    );
  }
}
