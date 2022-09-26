import { Injectable } from '@nestjs/common';
import makeWASocket, { DisconnectReason, useSingleFileAuthState } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom';
import { SendMessageDto } from './dto/create-bot.dto';
import pino from  'pino';
import { unlinkSync } from 'fs';

let sock: any = false;

async function connectToWhatsApp() {
    const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json');

    sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: false,
        browser: ['Whatsapp Darbelink', '', '3.0'],
        auth: state,
        logger: pino({
            level: 'silent',
        })
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(DisconnectReason.loggedOut);

            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect, );
            // reconnect if not logged out
            if (shouldReconnect) {
                console.log('reconnect');
                connectToWhatsApp();
            } else {
                unlinkSync('./auth_info_multi.json');
            }
        } else if (connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('creds.update', saveState);

    return sock;
}

function logOut() {
    unlinkSync('./auth_info_multi.json');
}

@Injectable()
export class WhatsappService {
    bots: any[] = [];

    async init() {
        return connectToWhatsApp();
    }

    async create() {
        function makeId(length) {
            let result = '';
            const characters =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
    
        const token = makeId(36);
        const bot = {
          token,
        };
    
        const isTokenAlreadyExists = this.bots.find((b) => b.token === token);
        if (!isTokenAlreadyExists) {
            this.bots.push(bot);
        }
    
        console.log('bots: ', this.bots);

        return {
          token,
        };
    }
    
    async sendMessage(data: SendMessageDto) {
        const isValidToken = this.bots.find((b) => b.token === data.token);
    
        if (!isValidToken) {
          throw new Error(`Invalid Token`);
        }
    
        return await sock.sendMessage(`${data.phone}@s.whatsapp.net`, {
          text: data.message,
        });
    }
    
    async logOut() {
        logOut();
    }
}
