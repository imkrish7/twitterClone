import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEntity } from 'src/auth/password.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserFollowerEntity } from './user-follower.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: UserRepository,
        private authService: AuthService,
        @InjectRepository(UserFollowerEntity)
        private userFollowerRepo: Repository<UserFollowerEntity>,
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
        return await this.userRepo.save(existingUser);
    }

    async createUserFollowRelation(
        follower: UserEntity,
        followeeId: string,
    ): Promise<any> {
        const followee = await this.getUserByUserId(followeeId);
        if (!followee) {
            throw new NotFoundException('User does not exist');
        }

        const newFollow = await this.userFollowerRepo.save({
            follower,
            followee,
        });
        return newFollow.followee;
    }

    async unfollowUser(follower: UserEntity, followeeId: string): Promise<any> {
        const followee = await this.getUserByUserId(followeeId);

        if (!followee) {
            throw new NotFoundException('User not found');
        }

        const follow = await this.userFollowerRepo.findOne({
            where: {
                follower,
                followee,
            },
        });

        if (follow) {
            await this.userFollowerRepo.delete(follow.id);
            return followee;
        } else {
            throw new NotFoundException('No follow relationship found');
        }
    }
}
