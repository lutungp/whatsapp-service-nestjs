import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { AppGateway } from 'src/app.gateway';

@Module({
  providers: [WhatsappService, AppGateway],
  controllers: [WhatsappController]
})
export class WhatsappModule {}
