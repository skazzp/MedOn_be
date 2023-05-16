import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from '@entities/Availability';
import { HttpStatus } from '@nestjs/common';
import { AvailabilityReq } from '@common/interfaces/Availability';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { AvailabilityDto } from './dto/availability.dto';

describe('AvailabilityController', () => {
  let controller: AvailabilityController;
  let availabilityService: AvailabilityService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AvailabilityController],
      providers: [
        AvailabilityService,
        {
          provide: getRepositoryToken(Availability),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AvailabilityController>(AvailabilityController);
    availabilityService = module.get<AvailabilityService>(AvailabilityService);
  });

  describe('create', () => {
    it('should create availabilities and return a success message', async () => {
      const mockDto: AvailabilityDto[] = [
        {
          startTime: new Date('2022-01-01T04:00:00.000Z'),
          endTime: new Date('2022-01-01T08:00:00.000Z'),
          title: 'Availability 1',
        },
      ];
      const mockUser = {
        user: {
          userId: 1,
          email: 'test@example.com',
          id: '1234',
          role: 'remote',
        },
      } as unknown as AvailabilityReq;

      const mockResponse = {
        statusCode: HttpStatus.CREATED,
        message: 'Availability was created',
      };
      const createMultiplesSpy = jest.spyOn(
        availabilityService,
        'createMultiples',
      );
      createMultiplesSpy.mockImplementation(() => Promise.resolve([]));

      const result = await controller.create(mockDto, mockUser);

      expect(result).toEqual(mockResponse);
      expect(createMultiplesSpy).toHaveBeenCalledWith(
        mockDto,
        mockUser.user.userId,
      );
    });
  });
});
