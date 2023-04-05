import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from '../../common/enums/Role';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signup: jest.fn(() => {
      return 'test_confirmation_link';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create the doctor', async () => {
    const dto = {
      firstName: 'Alex',
      lastName: 'Belman',
      email: 'fakemail@gmail.com',
      password: 'fakepass',
      city: 'Kiev',
      country: 'Ukraine',
      dateOfBirth: new Date('1985-05-28'),
      role: Role.LocalDoctor,
      timeZone: 'Europe/Paris',
      specialityId: 1,
    };

    expect(await controller.signup(dto)).toEqual({
      statusCode: HttpStatus.OK,
      message: 'test_confirmation_link',
    });

    expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
  });
});
