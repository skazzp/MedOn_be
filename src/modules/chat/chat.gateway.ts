import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from '@modules/chat/chat.service';
import { CreateMessageDto } from '@modules/chat/dto/create-message.dto';
import { ChatMessage } from '@entities/ChatMessage';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private appointmentId: number | null;

  private room: string | null;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private chat: ChatService,
    private readonly config: ConfigService,
  ) {}

  afterInit() {
    const port = this.config.get('webSocketPort');
    this.logger.log(`WebSocket server initialized on port ${port}`);
    this.server.listen(port);
  }

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
