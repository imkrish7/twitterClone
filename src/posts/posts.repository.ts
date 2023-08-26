import { Repository } from 'typeorm';
import { PostEntity } from './post.entity';

export class PostsRepository extends Repository<PostEntity> {}
