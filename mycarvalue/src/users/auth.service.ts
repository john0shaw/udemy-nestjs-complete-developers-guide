import { randomBytes, scrypt as _scyprt } from 'crypto';
import { promisify } from 'util';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

const scrypt = promisify(_scyprt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signUp(email: string, password: string) {
        // See if email is in use
        const users = await this.usersService.find(email);

        if (users.length) {
            throw new BadRequestException('email in use');
        }

        // Hash the users password
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + '.' + hash.toString('hex');

        // Create a new user and save it
        const user = await this.usersService.create(email, result);

        // return the user
        return user;
    }

    async signIn(email: string, password: string) {
        const [user] = await this.usersService.find(email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }
}