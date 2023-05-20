import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '@modules/chat/chat.service';
import { AppointmentsService } from '@modules/appointments/appointments.service';
import { CreateMessageDto } from '@modules/chat/dto/create-message.dto';

@WebSocketGateway(4000, { cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private appointment: AppointmentsService,
    private chat: ChatService,
  ) {}

  afterInit() {
    console.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { appointmentId: number }) {
    const room = `appointment_${data.appointmentId}`;
    client.join(room);
    console.log(`Client ${client.id} joined appointment room ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, data: { appointmentId: number }) {
    const room = `appointment_${data.appointmentId}`;
    client.leave(room);
    console.log(`Client ${client.id} left appointment room ${room}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, dto: CreateMessageDto) {
    const chat = await this.chat.create(dto);
    const room = `appointment-${dto.appointmentId}`;
    this.server.to(room).emit('newMessage', chat.message);

    console.log(`Client ${client.id} joined appointment room ${room}`);
  }
}
