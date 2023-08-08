import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEntity } from 'src/auth/password.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: UserRepository,
        private authService: AuthService,
    ) {}

    public async getUserByUsername(username: string): Promise<UserEntity> {
        return await this.userRepo.findOne({ where: { username } });
    }

    public async getUserByUserId(userId: string): Promise<UserEntity> {
        return await this.userRepo.findOneBy({ id: userId });
    }

    public async createUser(
        user: Partial<UserEntity>,
        password: string,
    ): Promise<Omit<UserEntity, 'userPassword'>> {
        const _user = await this.userRepo.save(user);
        await this.authService.createPasswordForNewUser(user.id, password);
        return _user;
    }

    public async updateUser(
        userId: string,
        updateUser: Partial<UserEntity>,
    ): Promise<UserEntity> {
        const existingUser = await this.userRepo.findOne({
            where: { id: userId },
        });

        if (!existingUser) {
            return null;
        }

        if (updateUser.bio) existingUser.bio = updateUser.bio;
        if (updateUser.avatar) existingUser.avatar = updateUser.avatar;
        if (updateUser.name) existingUser.name = updateUser.name;
        // return await this.userRepo.update(
        //     { where: { id: userId } },
        //     updateUser,
        // );
        return await this.userRepo.save(existingUser);
    }
}
