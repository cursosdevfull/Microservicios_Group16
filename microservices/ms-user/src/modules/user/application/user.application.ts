import { UserPort } from "../ports/user.port";
import { User } from "./user";

export class UserApplication {
    constructor(private port: UserPort) { }

    async save(user: User): Promise<User> {
        return this.port.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.port.findByEmail(email);
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        return this.port.findByRefreshToken(refreshToken);
    }

    async login(email: string, password: string): Promise<User | null> {
        return this.port.login(email, password);
    }
}