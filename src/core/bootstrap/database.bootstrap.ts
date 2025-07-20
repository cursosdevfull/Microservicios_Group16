import { DataSource, DataSourceOptions } from "typeorm";
import { TBootstrap, TReturnType } from "./bootstrap.type";
import { env } from '../../env';

export class DatabaseBootstrap implements TBootstrap {
    static dataSource: DataSource;

    async initialize(): Promise<TReturnType> {
        return new Promise(async (resolve, reject) => {
            const options: DataSourceOptions = {
                type: "mysql",
                host: env.DB_HOST,
                port: env.DB_PORT,
                username: env.DB_USER,
                password: env.DB_PASS,
                database: env.DB_NAME,
                entities: [],
                poolSize: env.DB_POOL_SIZE,
                synchronize: env.DB_SYNC,
                logging: env.DB_LOGG,
            }

            try {
                const app = new DataSource(options);

                DatabaseBootstrap.dataSource = app;

                await app.initialize();
                resolve("Database connected successfully");
            } catch (error: any) {
                console.error("Database connection error:", error);
                reject(`Failed to connect to the database: ${error.message}`);
            }
        })

    }
}