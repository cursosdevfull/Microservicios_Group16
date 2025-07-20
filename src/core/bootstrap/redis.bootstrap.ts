import { TBootstrap, TReturnType } from "./bootstrap.type";
import IORedis from "ioredis"
import { env } from '../../env';

export class RedisBootstrap implements TBootstrap {
    private static client: IORedis

    initialize(): Promise<TReturnType> {
        return new Promise(async (resolve, reject) => {
            const client = new IORedis({
                host: env.REDIS_HOST,
                port: env.REDIS_PORT,
                password: env.REDIS_PASS,
            })

            client
                .on("connect", () => {
                    RedisBootstrap.client = client;
                    resolve("Redis connected successfully");
                })
                .on("error", (error: any) => {
                    console.error("Redis connection error:", error);
                    reject(`Failed to connect to Redis: ${error.message}`);
                })
        })
    }
}