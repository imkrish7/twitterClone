import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';

class LoginRequestBody {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}

class LoginResponseBody {
    @ApiProperty()
    token: string;

    constructor(token: string) {
        this.token = token;
    }
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiResponse({ type: LoginResponseBody })
    @Post('/login')
    async login(@Body() body: LoginRequestBody): Promise<LoginResponseBody> {
        const session = await this.authService.createNewSession(
            body.username,
            body.password,
        );
        return new LoginResponseBody(session.id);
    }
}
