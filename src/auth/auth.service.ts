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

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PasswordEntity)
        private passwordRepo: Repository<PasswordEntity>,
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
}
