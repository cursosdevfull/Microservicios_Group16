import { AuthPort } from "../ports/auth.port";
import { User } from "../types/user";
import { Auth } from "./auth";
import { TokensService } from '../services/tokens.service';
import { Tokens } from "../types/tokens";

export class AuthApplication {
    constructor(private authPort: AuthPort) { }

    async login(email: string, password: string): Promise<Tokens | null> {
        const auth = new Auth(email, password);
        const user = await this.authPort.login(auth);

        if (user) {
            return TokensService.generateTokens(user);
        }

        return null
    }

    async getAccessToken(refreshToken: string): Promise<Tokens | null> {
        const user = await this.authPort.getAccessToken(refreshToken);

        if (user) {
            return TokensService.generateTokens(user);
        }

        return null;
    }

    validateAccessToken(token: string): User | null {
        return TokensService.verifyAccessToken(token);
    }
}