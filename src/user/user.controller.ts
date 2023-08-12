import {
    Controller,
    Get,
    Post,
    Put,
    Logger,
    NotFoundException,
    Param,
    Body,
    Patch,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiProperty,
    ApiPropertyOptional,
    ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { AuthGuard, OptionalGaurd } from 'src/auth/auth.guard';
import { User } from 'src/auth/auth.decorator';
import { UserFollowerEntity } from './user-follower.entity';

export class UserCreateRequestBody {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    avatar?: string;

    @ApiPropertyOptional()
    bio?: string;
}

export class UserUpdateRequestBody {
    @ApiPropertyOptional()
    password?: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    avatar?: string;

    @ApiPropertyOptional()
    bio?: string;
}

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('/@:username')
    async getUserByUsername(@Param('username') username: string): Promise<any> {
        const user = await this.userService.getUserByUsername(username);
        Logger.log(user);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get('/:userid')
    async getUserByUserid(@Param('userid') userid: string): Promise<any> {
        const user = await this.userService.getUserByUserId(userid);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    @ApiBody({ type: UserCreateRequestBody })
    @Post('/')
    async createNewUser(
        @Body() createNewUser: UserCreateRequestBody,
    ): Promise<any> {
        const user = await this.userService.createUser(
            createNewUser,
            createNewUser.password,
        );
        return user;
    }

    @ApiBody({ type: UserUpdateRequestBody })
    @Patch('/:userId')
    async updateUserDetails(
        @Param('userId') userId: string,
        @Body() updateUser: UserUpdateRequestBody,
    ): Promise<any> {
        const user = await this.userService.updateUser(userId, updateUser);
        return user;
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put('/:userId/follow')
    async userFollow(
        @User() follower: UserEntity,
        @Param('userId') followeeId: string,
    ): Promise<any> {
        return await this.userService.createUserFollowRelation(
            follower,
            followeeId,
        );
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put('/:userId/unfollow')
    async unfollowUser(
        @User() follower: UserEntity,
        @Param('userId') followeeId: string,
    ): Promise<any> {
        return await this.userService.unfollowUser(follower, followeeId);
    }

    @UseGuards(OptionalGaurd)
    @Get('/:userId/followers')
    async getFollowers(
        @Param('userId') followingId: string,
    ): Promise<UserFollowerEntity[]> {
        return await this.userService.getFollowers(followingId);
    }

    @UseGuards(OptionalGaurd)
    @Get('/:userId/followers')
    async getFollowings(
        @Param('userId') followerId: string,
    ): Promise<UserFollowerEntity[]> {
        return await this.userService.getFollowings(followerId);
    }
}
