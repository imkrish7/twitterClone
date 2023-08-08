import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('hashtags')
@Controller('hashtags')
export class HashtagsController {
    @Get('/')
    getHashtags(): string {
        return 'hashtags';
    }

    @Get('/:tag/posts')
    getPostFromHashtags(@Param() params): string {
        return `Show all posts with hashtag ${params.tag}`;
    }
}
