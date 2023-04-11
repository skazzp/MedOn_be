import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './google/guards/Guards';

@Controller('auth')
export class GoogleAuthController {
  // this method will handle the login from users.
  @Get('google/login') // endpoint: api/auth/google/login
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // it has to match the authorized redirect url in google developer console
  @Get('google/redirect') // endpoint: api/auth/google/redirect
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'OK' };
  }

  @Get('status')
  user(@Req() request: Request) {
    if (request.user) {
      return { msg: 'Authenticated' };
    }
    return { msg: 'Not Authenticated' };
  }
}
