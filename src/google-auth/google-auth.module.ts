import { Module } from '@nestjs/common';
import { GoogleAuthController } from './google-auth.controller';

@Module({
  controllers: [GoogleAuthController],
  providers: [],
})
export class GoogleAuthModule {}
