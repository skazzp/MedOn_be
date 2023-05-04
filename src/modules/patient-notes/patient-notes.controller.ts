import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientNotes } from '@entities/PatientNotes';
import { PatientNotesService } from '@modules/patient-notes/patient-notes.service';
import { CreatePatientNoteDto } from '@modules/patient-notes/dto/create-patient-note.dto';
import { NotesSearchOptionsDto } from '@modules/patient-notes/dto/query-options.dto';
import {
  INoteRequest,
  NotesRes,
} from '@modules/patient-notes/interfaces/notes-responce';
import { IServerResponse } from '@common/interfaces/serverResponses';

@ApiTags('patient-notes')
@Controller('patient-notes')
@UseGuards(AuthGuard('jwt'))
export class PatientNotesController {
  constructor(private readonly notesService: PatientNotesService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Get patient notes by patients id' })
  @ApiResponse({
    status: 201,
    description: 'List of the notes found',
  })
  async getNotes(
    @Param() params: { id: number },
    @Query() searchOptions: NotesSearchOptionsDto,
  ): Promise<IServerResponse<NotesRes>> {
    const response = await this.notesService.getNotes(params.id, searchOptions);

    return { statusCode: HttpStatus.OK, data: response };
  }

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

  @Delete('/remove/:id')
  @ApiOperation({ summary: 'Remove patient note' })
  @ApiResponse({
    status: 201,
    description: 'Patient note was deleted',
  })
  async removePatientNote(
    @Request() req: INoteRequest,
    @Param() params: { id: number },
  ): Promise<IServerResponse<PatientNotes>> {
    const removeNoteData = { id: params.id, doctorId: req.user.userId };
    await this.notesService.removePatientNote(removeNoteData);

    return {
      statusCode: HttpStatus.OK,
      message: 'Appointment note was removed',
    };
  }
}
