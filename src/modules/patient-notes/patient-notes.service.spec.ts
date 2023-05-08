import { Test, TestingModule } from '@nestjs/testing';
import { PatientNotesService } from './patient-notes.service';

describe('PatientNotesService', () => {
  let service: PatientNotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientNotesService],
    }).compile();

    service = module.get<PatientNotesService>(PatientNotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
