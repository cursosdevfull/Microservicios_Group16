import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "user" })
export class UserEntity {
    @PrimaryColumn()
    userId!: string;

    @Column({ type: "varchar", length: 100 })
    name!: string;

    @Column({ type: "varchar", length: 100 })
    email!: string;

    @Column({ type: "varchar", length: 100 })
    password!: string;

    @Column({ type: "varchar", length: 100 })
    refreshToken!: string;

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @Column({ type: "timestamp" })
    createdAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    updatedAt!: Date | null;
}