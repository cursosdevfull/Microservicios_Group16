import { Auth } from "../application/auth"
import { Tokens } from "../types/tokens";
import { User } from "../types/user";

export type AuthPort = {
    login(auth: Auth): Promise<User | null>;
    getAccessToken(refreshToken: string): Promise<User | null>;
}