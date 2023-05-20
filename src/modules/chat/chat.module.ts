import { Module } from '@nestjs/common';
import { ChatGateway } from '@modules/chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from '@entities/Chats';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { UserModule } from '@modules/user/user.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), AppointmentsModule, UserModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
