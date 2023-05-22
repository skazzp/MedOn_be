import { Module } from '@nestjs/common';
import { ChatGateway } from '@modules/chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from '@entities/ChatMessage';
import { UserModule } from '@modules/user/user.module';
import { AppointmentsModule } from '@modules/appointments/appointments.module';
import { ConfigModule } from '@nestjs/config';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    UserModule,
    AppointmentsModule,
    ConfigModule,
  ],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
