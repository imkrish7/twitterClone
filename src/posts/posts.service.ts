import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './post.entity';
import { PostsRepository } from './posts.repository';
import { CreatePostRequestBody } from './posts.controller';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private postRepo: PostsRepository,
    ) {}

    async getAllPosts(authorId?: string, hashtags?: string[]): Promise<any[]> {
        const queryBuilder = this.postRepo
            .createQueryBuilder('posts')
            .leftJoinAndSelect('posts.author', 'author')
            .leftJoinAndSelect('posts.originalPost', 'originalPost')
            .addSelect('originalPost.author')
            .leftJoinAndSelect('originalPost.author', 'author')
            .leftJoinAndSelect('posts.replyTo', 'replyTo')
            .addSelect('replyTo.author')
            .leftJoinAndSelect('replyTo.author', 'replyToAuthor');

        if (authorId) {
            queryBuilder.where(`posts.author = ':authorId`, { authorId });
        }

        if (hashtags && hashtags.length) {
            queryBuilder.where(`:hashtags::text[] = posts.hashtags`, {
                hashtags,
            });
        }
        return await queryBuilder
            .addSelect('posts.created_at')
            .orderBy('posts.created_at', 'DESC')
            .limit(100)
            .getMany();
    }

    async createPost(
        post: CreatePostRequestBody,
        author: UserEntity,
    ): Promise<any> {
        try {
            if (!post.text && !post.originalPostId) {
                throw new BadRequestException(
                    'Post must contain text or be repost',
                );
            }

            if (post.originalPostId && post.replyTo) {
                throw new BadRequestException(
                    'Post can either be originalPost or reply',
                );
            }

            const newPost = new PostEntity();
            newPost.text = post.text;
            newPost.author = author;

            if (post.originalPostId) {
                const originalPost = await this.getPostById(
                    post.originalPostId,
                );
                if (!originalPost) {
                    throw new NotFoundException('Original Post not found');
                }

                newPost.originalPost = originalPost;
            }

            if (post.replyTo) {
                const replyPost = await this.getPostById(post.replyTo);
                if (!replyPost) {
                    throw new NotFoundException('Reply to post not found');
                }
                newPost.replyTo = replyPost;
            }

            await this.postRepo.save(newPost);
            return { success: true };
        } catch (error) {
            return error;
        }
    }

    async getPostById(postId: string): Promise<any> {
        return await this.postRepo.findOneBy({ id: postId });
    }

    async getPost(postId: string): Promise<any> {
        return this.getPostById(postId);
    }

    async deletePost(postId: string): Promise<any> {
        try {
            const post = await this.getPostById(postId);
            if (post) {
                await this.postRepo.delete({ id: postId });
                return { success: true };
            }
            throw new NotFoundException('post does no exist');
        } catch (error) {
            return error;
        }
    }

    async likePost(postId: string): Promise<any> {
        try {
            const post = await this.getPostById(postId);
            if (post) {
                post.hashtags = [...post.hashtags, postId];
                await this.postRepo.save(post);
                return { success: true };
            }

            throw new NotFoundException('Post does not exist');
        } catch (error) {
            return error;
        }
    }
}
