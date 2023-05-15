import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Availability } from '@entities/Availability';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AvailabilityService } from './availability.service';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let repo: Repository<Availability>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: getRepositoryToken(Availability),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    repo = module.get<Repository<Availability>>(
      getRepositoryToken(Availability),
    );
  });

  describe('findAvailabilitiesForLastThreeMonths', () => {
    const mockAvailabilities: Availability[] = [
      {
        id: 1,
        doctorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        endTime: new Date(),
        startTime: new Date(),
        isAvailable: true,
        title: 'test',
      },
      {
        id: 2,
        doctorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        endTime: new Date(),
        startTime: new Date(),
        isAvailable: true,
        title: 'test',
      },
      {
        id: 3,
        doctorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        endTime: new Date(),
        startTime: new Date(),
        isAvailable: true,
        title: 'test',
      },
    ];

    it('should return all availabilities ', async () => {
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockAvailabilities),
      } as any);

      const availabilities = await service.findAvailabilitiesForLastThreeMonths(
        1,
        'America/New_York',
      );
      expect(availabilities).toEqual(mockAvailabilities);
      expect(availabilities.length).toBe(3);
    });
  });
  describe('getAvailabilityByDay', () => {
    it('should return an array of availabilities for the given day and timezone', async () => {
      const mockAvailabilities: Availability[] = [
        {
          id: 1,
          doctorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          endTime: new Date(),
          startTime: new Date(),
          isAvailable: true,
          title: 'test',
        },
        {
          id: 2,
          doctorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          endTime: new Date(),
          startTime: new Date(),
          isAvailable: true,
          title: 'test',
        },
        {
          id: 3,
          doctorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          endTime: new Date(),
          startTime: new Date(),
          isAvailable: true,
          title: 'test',
        },
      ];

      jest.spyOn(service['repo'], 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce(mockAvailabilities),
      } as any);

      const availabilities = await service.getAvailabilityByDay(
        '2022-01-01',
        'America/New_York',
      );
      expect(availabilities).toEqual(mockAvailabilities);
      expect(availabilities.length).toBe(3);
    });

    it('should throw a BadRequestException if an invalid timezone is provided', async () => {
      expect.assertions(1);
      try {
        await service.getAvailabilityByDay('2022-01-01', 'invalid/timezone');
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
      }
    });

    it('should throw a NotFoundException if no availabilities are found for the given day and timezone', async () => {
      jest.spyOn(service['repo'], 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValueOnce([]),
      } as any);

      expect.assertions(1);
      try {
        await service.getAvailabilityByDay('2022-01-01', 'America/New_York');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
