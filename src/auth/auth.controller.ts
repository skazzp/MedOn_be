import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GoogleAuthGuard } from './google/guards/Guards';

@Controller('auth')
export class GoogleAuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
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
