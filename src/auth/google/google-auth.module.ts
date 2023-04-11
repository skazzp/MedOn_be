import { Module } from '@nestjs/common';
import { GoogleStrategy } from '../strategies/google.strategy';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleStrategy],
})
export class GoogleAuthModule {}
