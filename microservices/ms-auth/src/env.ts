import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    PORT: z.coerce.number().default(3000),
    HOST: z.string().default("localhost"),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES: z.string().default("1h"),
    NAME: z.string().default("ms-auth"),
    DISCOVERY_URL: z.string().default("http://localhost:3010")
})

type Env = z.infer<typeof schema>

export const env: Env = schema.parse(process.env)
