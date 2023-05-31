import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from '@modules/chat/chat.service';
import { CreateMessageDto } from '@modules/chat/dto/create-message.dto';
import { ChatMessage } from '@entities/ChatMessage';

@WebSocketGateway({ cors: true, namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private chat: ChatService) {}

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoomByAppointmentId')
  handleJoinRoom(client: Socket, appointmentId: number): void {
    client.join(`app-${appointmentId}`);

    this.logger.log(
      `Client ${client.id} joined appointment room app-${appointmentId}`,
    );
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    dto: CreateMessageDto,
  ): Promise<void> {
    const message = await this.chat.saveMassage(dto);
    this.server
      .to(Array.from(client.rooms)[1])
      .except(client.id)
      .emit('message', message);
  }

  @SubscribeMessage('getMessagesByAppointmentId')
  async getAllMessages(
    client: Socket,
    appointmentId: number,
  ): Promise<ChatMessage[]> {
    return this.chat.getAllMessagesByAppointmentId(appointmentId);
  }
}
