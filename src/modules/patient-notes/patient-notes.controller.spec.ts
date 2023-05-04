import { Test, TestingModule } from '@nestjs/testing';
import { PatientNotes } from '@entities/PatientNotes';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PatientNotesController } from './patient-notes.controller';
import { PatientNotesService } from './patient-notes.service';
import { CreatePatientNoteDto } from './dto/create-patient-note.dto';
import { INoteRequest } from './interfaces/notes-responce';

describe('PatientNotesController', () => {
  let controller: PatientNotesController;
  let service: PatientNotesService;
  const mockNotesRepo = {
    save: jest.fn().mockReturnThis(),
    createQueryBuilder: {
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(() => []),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientNotesController],
      providers: [
        PatientNotesService,
        { provide: getRepositoryToken(PatientNotes), useValue: mockNotesRepo },
      ],
    }).compile();

    service = module.get<PatientNotesService>(PatientNotesService);
    controller = module.get<PatientNotesController>(PatientNotesController);
  });

  describe('getNotes', () => {
    it('should return an array of notes', async () => {
      const note = new PatientNotes();
      const serviceResult = { total: 0, notes: [note] };
      const params = { id: 1 };
      const searchOptions = {};
      jest.spyOn(service, 'getNotes').mockResolvedValueOnce(serviceResult);
      const result = await controller.getNotes(params, searchOptions);

      expect(result.data).toBe(serviceResult);
      expect(result.statusCode).toBe(200);
    });
  });

  describe('addPatientNote', () => {
    it('should create new note and return response', async () => {
      const note = new PatientNotes();
      const req = { user: { userId: 1 } } as unknown as INoteRequest;
      const dto = new CreatePatientNoteDto();
      jest.spyOn(service, 'addPatientNote').mockResolvedValueOnce(note);
      const result = await controller.addPatientNote(req, dto);

      expect(service.addPatientNote).toBeCalledWith({
        ...dto,
        doctorId: req.user.userId,
      });
      expect(result.data).toBe(note);
      expect(result.statusCode).toBe(200);
    });
  });
});
