import { Auth } from "../application/auth";
import { AuthPort } from "../ports/auth.port";
import { User } from "../types/user";

export class AuthAdapter implements AuthPort {
    async login(auth: Auth): Promise<User | null> {
        return fetch('http://example.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(auth.properties),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json() as Promise<User | null>
        });
    }

    async getAccessToken(refreshToken: string): Promise<User | null> {
        return fetch('http://example.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }
            return response.json() as Promise<User | null>;
        });
    }
}