import { User } from "../application/user"

export type UserPort = {
    save(user: User): Promise<User>
    findByEmail(email: string): Promise<User | null>
    findByRefreshToken(refreshToken: string): Promise<User | null>
}