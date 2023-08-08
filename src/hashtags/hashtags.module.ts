import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagsEntity } from './hashtags.entity';
import { HashtagsController } from './hashtags.controller';

@Module({
    imports: [TypeOrmModule.forFeature([HashtagsEntity])],
    controllers: [HashtagsController],
    providers: [],
    exports: [],
})
export class HashtagsModule {}
