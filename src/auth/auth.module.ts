import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordEntity } from './password.entity';
import { SessionEntity } from './sessions.entity';
import { UserEntity } from 'src/user/user.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([PasswordEntity, SessionEntity, UserEntity]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
