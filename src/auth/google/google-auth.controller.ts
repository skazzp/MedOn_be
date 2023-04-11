import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class GoogleAuthController {
  // this method will handle the login from users.
  @Get('google/login') // endpoint: api/auth/google/login
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // it has to match the authorized redirect url in google developer console
  @Get('google/redirect') // endpoint: api/auth/google/redirect
  handleRedirect() {
    return { msg: 'OK' };
  }
}
