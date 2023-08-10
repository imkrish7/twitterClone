import { BaseEntity } from 'src/commans/base.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('session')
export class SessionEntity extends BaseEntity {
    @Column()
    userId: string;

    @JoinColumn({ name: 'userId' })
    @OneToOne(() => UserEntity, { lazy: true })
    user: Promise<UserEntity>;
}
