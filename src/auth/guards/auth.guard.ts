import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { NATS_SERVICE } from "../../config/service.js";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import type { Request } from "express";


@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException('Token not found');
        }

        try {
            
            const { user, token: newToken } = await firstValueFrom(
                this.client.send('auth.verify.user', token)
            )

            request['user'] = user;
            request['token'] = newToken

        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}