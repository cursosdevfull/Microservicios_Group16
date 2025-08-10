import { DiscoveryClient } from "@core/clients/discovery.client";
import { Auth } from "../application/auth";
import { AuthPort } from "../ports/auth.port";
import { User } from "../types/user";
import { ServiceInfo } from "@core/interfaces/service-info";

export class AuthAdapter implements AuthPort {
    async login(auth: Auth): Promise<User | null> {
        const result = await new DiscoveryClient().findService('ms-user') as Array<ServiceInfo>;
        if (!result || result.length === 0) {
            throw new Error('User service not found');
        }

        const { host, port } = result[0];

        return fetch(`http://${host}:${port}/user/v1/login`, {
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