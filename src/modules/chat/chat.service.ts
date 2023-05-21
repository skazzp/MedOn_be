import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from '@entities/ChatMessage';
import { UserService } from '@modules/user/user.service';
import { AppointmentsService } from '@modules/appointments/appointments.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage) private chatRepo: Repository<ChatMessage>,
    private doctor: UserService,
    private appointment: AppointmentsService,
  ) {}

  async saveMassage(dto: CreateMessageDto): Promise<ChatMessage> {
    const newMessage = new ChatMessage();
    newMessage.sender = await this.doctor.getUserById(dto.senderId);
    newMessage.recipient = await this.doctor.getUserById(dto.recipientId);
    newMessage.appointment = await this.appointment.getAppointmentById(
      dto.appointmentId,
    );
    newMessage.value = dto.value;

    return this.chatRepo.save(newMessage);
  }

  async getAllMessagesByAppointmentId(id: number): Promise<ChatMessage[]> {
    return this.chatRepo
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.appointment', 'appointment')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.recipient', 'recipient')
      .where('appointment.id = :id', { id })
      .getMany();
  }
}
