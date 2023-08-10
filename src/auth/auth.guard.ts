import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

class TokenAuthorizer {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
    ) {}

    protected async autorizeToken(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!request?.headers?.authorization) {
            throw new UnauthorizedException('Unauthorized');
        }

        if (!request.headers.authorization.startWith('Bearer ')) {
            throw new UnauthorizedException('Invalid authorization header');
        }

        const token = request.headers.authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Unauthorized');
        }

        const user = await this.authService.getUserFromSessionToken(token);
        request.user = user;
        return true;
    }
}

@Injectable()
export class OptionalGaurd extends TokenAuthorizer implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        try {
            return this.autorizeToken(context);
        } catch (error) {
            return true;
        }
    }
}

@Injectable()
export class AuthGuard extends TokenAuthorizer implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return this.autorizeToken(context);
    }
}
