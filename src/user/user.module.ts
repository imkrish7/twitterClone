import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { PasswordEntity } from 'src/auth/password.entity';
import { UserFollowerEntity } from './user-follower.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            PasswordEntity,
            UserFollowerEntity,
        ]),
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
    exports: [UserRepository],
})
export class UserModule {}
