import {
    Controller,
    Delete,
    Get,
    Param,
    Query,
    Put,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiProperty,
    ApiPropertyOptional,
    ApiTags,
} from '@nestjs/swagger';
import { PostEntity } from './post.entity';
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserEntity } from 'src/user/user.entity';
import { User } from 'src/auth/auth.decorator';

export class CreatePostRequestBody {
    @ApiProperty()
    text: string;
    @ApiPropertyOptional()
    images?: string[];
    @ApiPropertyOptional()
    mentions: string[];
    @ApiPropertyOptional()
    hashtags?: string[];

    @ApiPropertyOptional()
    originalPostId: string;

    @ApiPropertyOptional()
    replyTo: string;
}

export class PostDeailsQueryParams {
    @ApiPropertyOptional()
    authorId?: string;
    @ApiPropertyOptional()
    hashtags?: string[];
}

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private postService: PostsService) {}

    @Get('/')
    async getAllPosts(
        @Query() query: PostDeailsQueryParams,
    ): Promise<PostEntity[]> {
        return await this.postService.getAllPosts(
            query.authorId,
            query.hashtags,
        );
    }

    @ApiBody({ type: CreatePostRequestBody })
    @Post('/')
    async createPost(
        @Body() body: CreatePostRequestBody,
        @User() user: UserEntity,
    ): Promise<any> {
        return await this.postService.createPost(body, user);
    }

    @Get('/{:postid}')
    async getPost(@Param('postid') postId: string): Promise<PostEntity> {
        return await this.postService.getPost(postId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete('/{:postid}')
    async deletePost(@Param('postid') postId: string): Promise<any> {
        return await this.postService.deletePost(postId);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Put('/{:postid/like}')
    async likePost(@Param('postid') postId: string): Promise<any> {
        return this.postService.likePost(postId);
    }
}
