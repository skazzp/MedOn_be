import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePatientNoteDto } from '@modules/patient-notes/dto/create-patient-note.dto';
import { IServerResponse } from '@common/interfaces/serverResponses';
import { PatientNotes } from '@entities/PatientNotes';
import { PatientNotesService } from '@modules/patient-notes/patient-notes.service';
import { INoteRequest } from '@modules/patient-notes/interfaces/patients-responce';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('patient-notes')
@Controller('patient-notes')
@UseGuards(AuthGuard('jwt'))
export class PatientNotesController {
  constructor(private readonly notesService: PatientNotesService) {}

  @Post('/create')
  @ApiOperation({ summary: 'New patient note' })
  @ApiResponse({
    status: 201,
    description: 'Patient note was created',
  })
  async addPatientNote(
    @Request() req: INoteRequest,
    @Body()
    dto: CreatePatientNoteDto,
  ): Promise<IServerResponse<PatientNotes>> {
    const newNoteData = { ...dto, doctorId: req.user.userId };
    const note = await this.notesService.addPatientNote(newNoteData);

    return { statusCode: HttpStatus.OK, data: note };
  }
}
