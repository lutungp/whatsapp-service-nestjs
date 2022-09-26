import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientAuthGuard implements CanActivate{

    constructor(private configService: ConfigService) {}

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].headers.authorization.split(' ')[1];
        if (bearerToken == this.configService.get("clientid")) {

            return true;
        } else {
            console.log("unauthorized")
            return false;
        }
    }
}