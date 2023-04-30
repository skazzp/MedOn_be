import { Test, TestingModule } from '@nestjs/testing';
import { PatientNotesController } from './patient-notes.controller';

describe('PatientNotesController', () => {
  let controller: PatientNotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientNotesController],
    }).compile();

    controller = module.get<PatientNotesController>(PatientNotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
