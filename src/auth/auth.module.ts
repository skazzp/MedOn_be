import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleUser } from 'src/typeorm/entities/GoogleUser';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleAuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([GoogleUser])],
  controllers: [GoogleAuthController],
  providers: [
    GoogleStrategy,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class GoogleAuthModule {}
