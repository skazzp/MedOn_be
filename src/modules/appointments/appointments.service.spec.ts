import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { Appointment } from '@entities/Appointments';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  const mockAppointmentsRepo = {
    find: jest.fn(() => []),
    findOne: jest.fn(() => undefined),
    save: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentsRepo,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  describe('getAppointmentById', () => {
    it('should return the appointment', async () => {
      const id = 1;
      const appointment = new Appointment();
      jest
        .spyOn(mockAppointmentsRepo, 'findOne')
        .mockResolvedValueOnce(appointment);
      const result = await service.getAppointmentById(id);

      expect(result).toBe(appointment);
      expect(mockAppointmentsRepo.findOne).toBeCalledWith({ where: { id } });
    });
  });

  describe('createAppointment', () => {
    it('should create a new appointment and return the created appointment', async () => {
      const createAppointmentDto = new CreateAppointmentDto();
      const appointment = new Appointment();
      jest
        .spyOn(mockAppointmentsRepo, 'save')
        .mockResolvedValueOnce(appointment);
      const result = await service.createAppointment(createAppointmentDto);

      expect(result).toBe(appointment);
      expect(mockAppointmentsRepo.save).toBeCalledWith(createAppointmentDto);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete the appointment', async () => {
      const id = 1;
      await service.deleteAppointment(id);

      expect(mockAppointmentsRepo.delete).toBeCalledWith(id);
    });
  });
});
