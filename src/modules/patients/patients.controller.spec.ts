import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PatientsController } from '@modules/patients/patients.controller';
import { PatientsService } from '@modules/patients/patients.service';
import { PatientSearchOptionsDto } from '@modules/patients/dto/page-options.dto';

describe('PatientsController', () => {
  let controller: PatientsController;

  const mockAuthService = {
    getPatients: jest.fn((x: PatientSearchOptionsDto) => {
      return x;
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
  });

  it('should return result with or without parameters', async () => {
    const dto = {
      page: 1,
      limit: 5,
      name: 'Smith',
    };

    expect(await controller.getAll(dto)).toEqual(dto);
    expect(await controller.getAll({})).toEqual({});
  });
});
