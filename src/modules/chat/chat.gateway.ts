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

@WebSocketGateway(4000, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private appointmentId: number | null;

  private room: string | null;

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
    this.appointmentId = appointmentId;
    this.room = `app-${this.appointmentId}`;
    client.join(this.room);

    this.logger.log(`Client ${client.id} joined appointment room ${this.room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket): void {
    client.leave(this.room);

    this.logger.log(`Client ${client.id} left appointment room ${this.room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    dto: CreateMessageDto,
  ): Promise<void> {
    const message = await this.chat.saveMassage(dto);
    this.server.to(this.room).emit('message', message);
  }

  @SubscribeMessage('getAllMessages')
  async getAllMessages(): Promise<ChatMessage[]> {
    return this.chat.getAllMessagesByAppointmentId(this.appointmentId);
  }
}
