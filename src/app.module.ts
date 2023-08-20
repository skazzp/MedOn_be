import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Doctor,
  Patient,
  Speciality,
  PatientNotes,
  Availability,
  Appointment,
  ChatMessage,
} from '@entities/index';

import { AuthModule } from '@modules/auth/auth.module';
import { EmailModule } from '@modules/email/email.module';
import { UserModule } from '@modules/user/user.module';
import { SpecialitiesModule } from '@modules/specialities/specialities.module';
import { AvailabilityModule } from '@modules/availability/availability.module';
import { PatientsModule } from '@modules/patients/patients.module';
import { PatientNotesModule } from '@modules/patient-notes/patient-notes.module';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { FilesModule } from '@modules/files/files.module';
import { RolesGuard } from '@guards/roles.guard';
import { ChatModule } from '@modules/chat/chat.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        timezone: '+00:00',
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        entities: [
          Patient,
          Speciality,
          Doctor,
          Availability,
          Appointment,
          PatientNotes,
          ChatMessage,
          PatientNotes,
        ],
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EmailModule,
    UserModule,
    SpecialitiesModule,
    PatientsModule,
    AvailabilityModule,
    PatientNotesModule,
    AppointmentsModule,
    FilesModule,
  ],
  providers: [JwtStrategy, RolesGuard],
})
export class AppModule {}
