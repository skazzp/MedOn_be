import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { Role } from '@common/enums/Role';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IResetPasswordRequest } from '@common/interfaces/resetPasswordRequest';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signup: jest.fn(() => {
      return 'test_confirmation_link';
    }),
    forgetPassword: jest.fn(() => {}),
    resetPassword: jest.fn(() => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, ConfigService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
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
  });

  describe('forget and reset', () => {
    it('should return email was sent', async () => {
      const dto = {
        email: 'fakemail@gmail.com',
      };
      expect(await controller.forgetPassword(dto)).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Email was sent',
      });
    });
    it('should return password was updated', async () => {
      const req = {
        doctor: {
          email: 'fakemail@gmail.com',
        },
      } as IResetPasswordRequest;
      const dto = {
        email: req.doctor.email,
        newPassword: 'fakepass',
      };
      expect(await controller.resetPassword(req, dto)).toEqual({
        statusCode: HttpStatus.OK,
        message: 'Password was updated',
      });
    });
  });
});
