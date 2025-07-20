import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    DB_HOST: z.string().default("localhost"),
    DB_LOGG: z.coerce.boolean().default(false),
    DB_NAME: z.string().default("db"),
    DB_PASS: z.string().default("12345"),
    DB_POOL_SIZE: z.coerce.number().default(10),
    DB_PORT: z.coerce.number().default(3306),
    DB_SYNC: z.coerce.boolean().default(true),
    DB_USER: z.string().default("user"),
    PORT: z.coerce.number().default(3000),
    RABBITMQ_HOST: z.string().default("localhost"),
    RABBITMQ_PASS: z.string().default("12345"),
    RABBITMQ_USER: z.string().default("user"),
    REDIS_HOST: z.string().default("localhost"),
    REDIS_PASS: z.string().default("12345"),
    REDIS_PORT: z.coerce.number().default(6379),
    KAFKA_BROKER: z.string().default("localhost:9092"),
    CLIENT_ID: z.string().default("client-id"),
})

type Env = z.infer<typeof schema>

export const env: Env = schema.parse(process.env)
