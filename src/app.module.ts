import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';

import * as dotenv from 'dotenv';

const ENV = process.env.NODE_ENV;
dotenv.config({
  path: (ENV == 'local' ? '.env.development.local' : (ENV == 'dev' ? '.env.development' : '.env.production'))
});

@Module({
  imports: [
    WhatsappModule,
    ConfigModule.forRoot({
      envFilePath: [ENV == 'local' ? '.env.development.local' : (ENV == 'dev' ? '.env.development' : '.env.production')],
      isGlobal: true,
      load: [configuration]
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
