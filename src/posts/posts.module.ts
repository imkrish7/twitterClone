import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity])],
    controllers: [PostsController],
    providers: [],
    exports: [],
})
export class PostsModule {}
