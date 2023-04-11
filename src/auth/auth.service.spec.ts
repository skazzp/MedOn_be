import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleUser } from '../typeorm/entities/GoogleUser';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<GoogleUser>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(GoogleUser),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userRepository = moduleRef.get<Repository<GoogleUser>>(
      getRepositoryToken(GoogleUser),
    );
  });

  describe('validateGoogleUser', () => {
    it('should return an existing user if found', async () => {
      const existingUser = new GoogleUser();
      existingUser.email = 'test@test.com';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);

      const result = await authService.validateGoogleUser({
        email: 'test@test.com',
        displayName: '',
      });

      expect(result).toBe(existingUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@test.com',
      });
    });

    it('should throw an error if there is an error fetching from the database', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockRejectedValue(new Error());

      await expect(
        authService.validateGoogleUser({
          email: 'test@test.com',
          displayName: '',
        }),
      ).rejects.toThrow('Error validating Google user');
    });
  });

  describe('findUser', () => {
    it('should return a user if found', async () => {
      const existingUser = new GoogleUser();
      existingUser.email = 'test@test.com';
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);

      const result = await authService.findUser('test@test.com');

      expect(result).toBe(existingUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@test.com',
      });
    });

    it('should return undefined if not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

      const result = await authService.findUser('test@test.com');

      expect(result).toBeUndefined();
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@test.com',
      });
    });

    it('should throw an error if there is an error fetching from the database', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockRejectedValue(new Error());

      await expect(authService.findUser('test@test.com')).rejects.toThrow(
        'Error finding user',
      );
    });
  });
});
