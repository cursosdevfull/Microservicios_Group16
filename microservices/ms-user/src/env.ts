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
    HOST: z.string().default("localhost"),
    NAME: z.string().default("ms-user"),
    DISCOVERY_URL: z.string().default("http://localhost:3010"),
})

type Env = z.infer<typeof schema>

export const env: Env = schema.parse(process.env)
