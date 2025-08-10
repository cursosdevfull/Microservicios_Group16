import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    PORT: z.coerce.number().default(3000),
})

type Env = z.infer<typeof schema>

export const env: Env = schema.parse(process.env)
