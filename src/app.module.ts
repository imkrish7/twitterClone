import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { PostsController } from './posts/posts.controller';
import { HashtagsController } from './hashtags/hashtags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { PostEntity } from './posts/post.entity';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { HashtagsModule } from './hashtags/hashtags.module';
import { AuthModule } from './auth/auth.module';
import { PasswordEntity } from './auth/password.entity';
import { UserFollowerEntity } from './user/user-follower.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            username: 'twitteradmin2',
            password: 'twitteradmin',
            database: 'twitterclone',
            synchronize: true,
            logger: 'advanced-console',
            logging: 'all',
            entities: [
                UserEntity,
                PostEntity,
                PasswordEntity,
                UserFollowerEntity,
            ],
        }),
        UserModule,
        PostsModule,
        HashtagsModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
