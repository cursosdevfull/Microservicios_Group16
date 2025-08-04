import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    JWT_EXPIRES: z.string().default("1h"),
})

type Env = z.infer<typeof schema>

export const env: Env = schema.parse(process.env)
