import { DataSource } from "typeorm";

export type TReturnType = string | DataSource;

export type TBootstrap = {
    initialize(): Promise<TReturnType>;
}