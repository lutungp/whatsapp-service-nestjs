import { Body, Controller, Post } from '@nestjs/common';
import { SendMessageDto } from './dto/create-bot.dto';
import { WhatsappService } from './whatsapp.service';

@Controller('whatsapp')
export class WhatsappController {
    constructor(private readonly whatsappService: WhatsappService) {}

    @Post()
    create() {
        return this.whatsappService.create()
    }

    @Post('/send-message')
    async sendMessage(@Body() data: SendMessageDto) {
        return await this.whatsappService.sendMessage(data)
    }
}
