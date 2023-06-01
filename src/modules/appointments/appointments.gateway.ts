import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

interface IClient {
  id: string;
  userId: number;
}

@WebSocketGateway({ cors: true, namespace: 'notification' })
export class AppointmentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  clients: IClient[] = [];

  private readonly logger = new Logger(AppointmentsGateway.name);

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.clients = this.clients.filter((cl) => cl.id !== client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribeToAppointments')
  handleSubscribeToAppointments(client: Socket, userId: number): void {
    this.clients.push({ id: client.id, userId });
    this.logger.log(
      `Client ${client.id} was subscribed to doctor's ${userId} appointments`,
    );
  }

  async sendAppointmentsHaveChanged(userId: number): Promise<void> {
    const clientsByUserId = this.clients.filter(
      (client: IClient) => client.userId === userId,
    );

    clientsByUserId.forEach((client) =>
      this.server.to(client.id).emit('appointmentsHaveChanged'),
    );
  }
}
