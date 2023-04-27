import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '@entities/Patient';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;
  let mockRepository = Repository<Patient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    mockRepository = module.get(getRepositoryToken(Patient));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
