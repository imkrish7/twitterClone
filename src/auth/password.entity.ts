import { BaseEntity } from 'src/commans/base.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('passwords')
export class PasswordEntity extends BaseEntity {
    @Column({ nullable: false })
    userId: string;

    @JoinColumn({ name: 'userId' })
    @OneToOne(() => UserEntity)
    user: UserEntity;

    @Column({ nullable: false })
    password: string;
}
