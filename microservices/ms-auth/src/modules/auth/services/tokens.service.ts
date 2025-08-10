
import { Tokens } from "../types/tokens";
import { User } from "../types/user";
import * as jwt from "jsonwebtoken";
import { env } from '../../../env';

export class TokensService {
    static generateTokens(user: User): Tokens {
        const payload = { email: user.email, name: user.name }

        const accessToken = jwt.sign(payload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES as any
        });


        return {
            accessToken,
            refreshToken: user.refreshToken
        }
    }

    static verifyAccessToken(token: string): User | null {
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as User;
            return decoded;
        } catch (error) {
            return null;
        }
    }
}