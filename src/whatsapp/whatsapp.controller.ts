import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientAuthGuard } from 'src/guards/client.guard';
import { SendMessageDto } from './dto/create-bot.dto';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) {}

    @Post()
    create() {
        return this.whatsappService.create()
    }

    @UseGuards(ClientAuthGuard)
    @Post('/init')
    async init() {
        return await this.whatsappService.init()
    }

    @Post('/send-message')
    async sendMessage(@Body() data: SendMessageDto) {
        return await this.whatsappService.sendMessage(data)
    }

    @Post('/logout')
    async logOut() {
        return await this.whatsappService.logOut()
    }
}
