import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Appointment } from '@entities/Appointments';
import { CreateAppointmentDto } from '@modules/appointments/dto/create-appointment.dto';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;
  const mockAppointmentsRepo = {
    find: jest.fn(() => []),
    findOne: jest.fn(() => undefined),
    save: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentsRepo,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  describe('getAppointmentById', () => {
    it('should return the appointment', async () => {
      const id = 1;
      const appointment = new Appointment();
      jest
        .spyOn(service, 'getAppointmentById')
        .mockResolvedValueOnce(appointment);
      const result = await controller.getAppointmentById(id);

      expect(result).toBe(appointment);
      expect(service.getAppointmentById).toBeCalledWith(id);
    });
  });

  describe('createAppointment', () => {
    it('should create a new appointment and return the created appointment', async () => {
      const createAppointmentDto = new CreateAppointmentDto();
      const appointment = new Appointment();
      jest
        .spyOn(service, 'createAppointment')
        .mockResolvedValueOnce(appointment);
      const result = await controller.createAppointment(createAppointmentDto);

      expect(result).toBe(appointment);
      expect(service.createAppointment).toBeCalledWith(createAppointmentDto);
    });
  });

  describe('deleteAppointment', () => {
    it('should delete the appointment', async () => {
      const id = 1;
      jest.spyOn(service, 'deleteAppointment').mockResolvedValueOnce();
      await controller.deleteAppointment(id);

      expect(service.deleteAppointment).toBeCalledWith(id);
    });
  });
});
