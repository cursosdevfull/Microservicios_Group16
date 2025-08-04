export type UserEssentials = {
    name: string;
    email: string;
    password: string;
}

export type UserOptionals = {
    userId: string;
    refreshToken: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type UserProps = UserEssentials & Partial<UserOptionals>;
export type UserPropsUpdate = Partial<Pick<UserEssentials, "name" | "password"> & Pick<UserOptionals, "refreshToken">>;

export class User {
    private readonly userId!: string;
    private name!: string;
    private readonly email!: string;
    private password!: string;
    private refreshToken!: string;
    private isActive!: boolean;
    private createdAt!: Date;
    private updatedAt: Date | undefined;

    constructor(props: UserProps) {
        Object.assign(this, props);

        if (!props.userId) {
            this.userId = crypto.randomUUID();
        }

        if (!props.name || props.name.trim().length < 3) {
            throw new Error("Name is required and must be at least 3 characters long");
        }

        if (!props.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
            throw new Error("Email is required and must be a valid email address");
        }

        if (!props.password || props.password.trim().length < 6) {
            throw new Error("Password is required and must be at least 6 characters long");
        }

        this.createdAt = new Date();

        if (!props.refreshToken) {
            this.refreshToken = crypto.randomUUID();
        }

    }

    get properties(): UserProps {
        return {
            userId: this.userId,
            name: this.name,
            email: this.email,
            password: this.password,
            refreshToken: this.refreshToken,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    update(props: UserPropsUpdate) {
        Object.assign(this, props);
        this.updatedAt = new Date();
    }

    delete() {
        this.isActive = false;
        this.updatedAt = new Date();
    }
}