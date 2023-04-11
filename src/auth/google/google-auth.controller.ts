import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/Guards';

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
}
