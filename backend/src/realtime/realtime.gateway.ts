import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * Pushes live telemetry, agent activity, governance and economy events to the
 * dashboard. Frontend subscribes to per-tenant rooms (org:{id}) and channels.
 */
@WebSocketGateway({ cors: { origin: '*' }, namespace: '/realtime' })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private readonly logger = new Logger(RealtimeGateway.name);

  handleConnection(client: Socket) {
    const orgId = client.handshake.auth?.orgId ?? client.handshake.query?.orgId;
    if (orgId) client.join(`org:${orgId}`);
    this.logger.debug(`client ${client.id} joined org:${orgId}`);
  }
  handleDisconnect(client: Socket) {
    this.logger.debug(`client ${client.id} disconnected`);
  }

  @SubscribeMessage('subscribe')
  onSubscribe(@MessageBody() channel: string, @ConnectedSocket() client: Socket) {
    client.join(channel);
    return { ok: true, channel };
  }

  /** Called by any service to broadcast a domain event to a tenant. */
  publish(orgId: string, channel: string, event: string, data: unknown) {
    this.server.to(`org:${orgId}`).emit(event, { channel, data, ts: Date.now() });
  }
}
