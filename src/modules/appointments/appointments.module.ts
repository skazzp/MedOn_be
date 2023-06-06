import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '@entities/Appointments';
import { HttpModule } from '@nestjs/axios';
import { AvailabilityModule } from '@modules/availability/availability.module';
import { AppointmentsGateway } from './appointments.gateway';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    HttpModule,
    AvailabilityModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsGateway],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
