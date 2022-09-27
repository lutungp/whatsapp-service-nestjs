/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { ClientAuthGuard } from './guards/client.guard';

@WebSocketGateway({ 
    cors: {
        origin: "http://localhost:8002",
        credentials: true
    },
    allowEIO3: true 
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer()
    server: any;
    private logger: Logger = new Logger('AppGateway');

    @UseGuards(ClientAuthGuard)
    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string) {
        this.server.emit('events', data);
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('User connected');
    }

    handleDisconnect(client: any) {
        console.log('User disconnected');
    }

    afterInit(server: any) {
        console.log('Socket is live')
    }

    async sendQrCode(data:object) {
        this.server.emit('whatsappQrCode', data);
    }

    async connected(data:object) {
        this.server.emit('connected', data);
    }
}
