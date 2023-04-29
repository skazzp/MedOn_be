import { Module } from '@nestjs/common';
import { PatientNotes } from '@entities/PatientNotes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientNotesController } from '@modules/patient-notes/patient-notes.controller';
import { PatientNotesService } from '@modules/patient-notes/patient-notes.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientNotes])],
  controllers: [PatientNotesController],
  providers: [PatientNotesService],
})
export class PatientNotesModule {}
