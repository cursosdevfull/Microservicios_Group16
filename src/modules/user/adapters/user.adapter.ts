import { DatabaseBootstrap } from "@core/bootstrap";
import { User } from "../application/user";
import { UserPort } from "../ports/user.port";
import { UserEntity } from './models/user.entity';
import { UserDto } from "./dtos/user.dto";

export class UserAdapter implements UserPort {
    async save(user: User): Promise<User> {
        try {
            const repository = DatabaseBootstrap.dataSource.getRepository(UserEntity);
            const userEntity = UserDto.fromDomainToData(user) as UserEntity;
            await repository.save(userEntity);

            return user
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error(`Failed to save user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const repository = DatabaseBootstrap.dataSource.getRepository(UserEntity);
            const userEntity = await repository.findOne({ where: { email, isActive: true } });

            return userEntity ? UserDto.fromDataToDomain(userEntity) as User : null;
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error(`Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        try {
            const repository = DatabaseBootstrap.dataSource.getRepository(UserEntity);
            const userEntity = await repository.findOne({ where: { refreshToken, isActive: true } });

            return userEntity ? UserDto.fromDataToDomain(userEntity) as User : null;
        } catch (error) {
            console.error("Error finding user by refresh token:", error);
            throw new Error(`Failed to find user by refresh token: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }


    }
}