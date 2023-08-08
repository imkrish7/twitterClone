import { BaseEntity } from 'src/commans/base.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity('posts')
export class PostEntity extends BaseEntity {
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'author_id' })
    authorId: UserEntity;

    @Column({ length: 240 })
    text: string;

    @Column('json', { default: [] })
    images: Array<string>;

    @Column({ name: 'like_count', default: 0 })
    likeCount: number;

    @Column({ name: 'repost_count', default: 0 })
    respostCount: number;

    @Column('json', { default: [] })
    hashtags: Array<string>;

    @Column('json', { default: [] })
    mentions: Array<Mention>;

    @OneToOne(() => PostEntity)
    @JoinColumn({ name: 'original_post_id' })
    originalPost: PostEntity;

    @OneToOne(() => PostEntity)
    @JoinColumn({ name: 'reply_to_id' })
    replyTo: PostEntity;
}

class Mention {
    name: string;
    id: string;
}
