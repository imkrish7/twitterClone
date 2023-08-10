import {
    HttpException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordEntity } from './password.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { SessionEntity } from './sessions.entity';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PasswordEntity)
        private passwordRepo: Repository<PasswordEntity>,
        @InjectRepository(SessionEntity)
        private sessionRepo: Repository<SessionEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
    ) {}

    public static PASSWORD_SALT_ROUNDS = 10;

    public async createPasswordForNewUser(
        userId: string,
        password: string,
    ): Promise<any> {
        const existing = await this.passwordRepo.findOne({
            where: { id: userId },
        });

        if (existing) {
            throw new UnauthorizedException('User already exist');
        }

        const newPassword = new PasswordEntity();
        newPassword.userId = userId;
        newPassword.password = await this.passwordHash(password);
        return await this.passwordRepo.save(newPassword);
    }

    private async passwordHash(password: string): Promise<string> {
        const hashPassword = await hash(
            password,
            AuthService.PASSWORD_SALT_ROUNDS,
        );
        return hashPassword;
    }

    private async matchPassHash(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return (await compare(password, hashedPassword)) === true;
    }

    public async getUserFromSessionToken(
        authToken: string,
    ): Promise<UserEntity> {
        const session = await this.sessionRepo.findOne({
            where: { id: authToken },
        });

        if (!session) {
            throw new UnauthorizedException('Session does not exists');
        }

        const user = session.user;

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async createNewSession(username: string, password: string): Promise<any> {
        const user = await this.userRepo.findOne({ where: { username } });

        if (!user) {
            throw new NotFoundException('User does not exist');
        }

        const userPassword = await this.passwordRepo.findOne({
            where: { userId: user.id },
        });

        const passwordMatch = await this.matchPassHash(
            password,
            userPassword.password,
        );
        if (!passwordMatch) {
            throw new UnauthorizedException('Password is wrong');
        }

        const session = new SessionEntity();

        session.userId = user.id;
        const savedSession = await this.sessionRepo.save(session);
        return savedSession;
    }
}
