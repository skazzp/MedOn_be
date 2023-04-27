import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PatientsController } from '@modules/patients/patients.controller';
import { PatientsService } from '@modules/patients/patients.service';
import { PatientSearchOptionsDto } from '@modules/patients/dto/pageOptions.dto';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  const mockAuthService = {
    getPatients: jest.fn((x: PatientSearchOptionsDto) => {
      return { total: 0, patients: [] };
    }),
    addPatient: jest.fn(() => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [PatientsService, JwtService, ConfigService],
    })
      .overrideProvider(PatientsService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('patientsService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return result with or without parameters', async () => {
    const dto = {
      page: 1,
      limit: 5,
      name: 'Smith',
    };

    expect(await controller.getAll(dto)).toEqual({ total: 0, patients: [] });
    expect(await controller.getAll({})).toEqual({ total: 0, patients: [] });
  });
});
