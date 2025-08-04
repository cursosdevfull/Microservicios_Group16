import { UserEntity } from "../models/user.entity";
import { User } from '../../application/user';

export class UserDto {
    static fromDomainToData(domain: User | User[]): UserEntity | UserEntity[] {
        if (Array.isArray(domain)) {
            return domain.map(user => this.fromDomainToData(user)) as UserEntity[];
        }

        const userEntity = new UserEntity();
        userEntity.userId = domain.properties.userId!;
        userEntity.name = domain.properties.name;
        userEntity.email = domain.properties.email;
        userEntity.password = domain.properties.password;
        userEntity.refreshToken = domain.properties.refreshToken!;
        userEntity.isActive = domain.properties.isActive!;
        userEntity.createdAt = domain.properties.createdAt!;
        userEntity.updatedAt = domain.properties.updatedAt || null;

        return userEntity;
    }

    static fromDataToDomain(data: UserEntity | UserEntity[]): User | User[] {
        if (Array.isArray(data)) {
            return data.map(userEntity => this.fromDataToDomain(userEntity)) as User[];
        }

        return new User({
            userId: data.userId,
            name: data.name,
            email: data.email,
            password: data.password,
            refreshToken: data.refreshToken,
            isActive: data.isActive,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt || undefined
        });
    }
}