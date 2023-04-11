import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { GoogleAuthController } from './auth.controller';
import { GoogleAuthGuard } from './google/guards/Guards';

describe('GoogleAuthController', () => {
  let controller: GoogleAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAuthController],
      providers: [
        {
          provide: 'AuthService',
          useValue: {
            login: jest.fn(() => 'access-token'),
          },
        },
      ],
    })
      .overrideGuard(GoogleAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<GoogleAuthController>(GoogleAuthController);
  });

  describe('handleLogin', () => {
    it('should return "Google Authentication"', () => {
      expect(controller.handleLogin()).toEqual({
        msg: 'Google Authentication',
      });
    });
  });

  describe('handleRedirect', () => {
    it('should return "OK"', () => {
      expect(controller.handleRedirect()).toEqual({ msg: 'OK' });
    });
  });

  describe('user', () => {
    it('should return "Not Authenticated" when user is not logged in', () => {
      const mockReq = { user: undefined } as Request;
      expect(controller.user(mockReq)).toEqual({ msg: 'Not Authenticated' });
    });

    it('should return "Authenticated" when user is logged in', () => {
      const mockReq = { user: {} } as Request;
      expect(controller.user(mockReq)).toEqual({ msg: 'Authenticated' });
    });
  });
});
