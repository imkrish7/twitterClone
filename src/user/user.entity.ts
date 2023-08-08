import { PasswordEntity } from 'src/auth/password.entity';
import { BaseEntity } from 'src/commans/base.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ length: 30, nullable: false, unique: true })
    username: string;

    @Column({ length: 50, nullable: true })
    name: string;

    @Column({ nullable: true })
    avatar?: string;

    @Column({ length: 248, nullable: true })
    bio?: string;

    @Column({ name: 'follower_count', default: 0 })
    followerCount: number;

    @Column({ name: 'following_count', default: 0 })
    followingCount: number;

    @Column('boolean', { default: false })
    verified: boolean;

    @OneToOne(() => PasswordEntity, (password) => password.user, {
        lazy: true,
        cascade: true,
    })
    userPassword: PasswordEntity;
}
