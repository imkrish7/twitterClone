import { BaseEntity } from 'src/commans/base.entity';
import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from './user.entity';

@Unique('following_pair', ['follower', 'followee'])
@Entity('user_followings')
export class UserFollowerEntity extends BaseEntity {
    @JoinColumn({ name: 'follower_id' })
    @ManyToOne(() => UserEntity)
    follower: UserEntity;

    @JoinColumn({ name: 'followee_id' })
    @ManyToOne(() => UserEntity)
    followee: UserEntity;
}
