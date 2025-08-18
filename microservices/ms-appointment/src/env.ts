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
    NAME: z.string().default("ms-appointment"),
    HOST: z.string().default("localhost"),
    DISCOVERY_URL: z.string().default("http://localhost:3010"),
    KAFKA_BROKER: z.string().default("localhost:9092"),
    KAFKA_TOPIC_PE: z.string().default("appointment-topic-pe"),
    KAFKA_TOPIC_MX: z.string().default("appointment-topic-mx"),
    KAFKA_TOPIC_CO: z.string().default("appointment-topic-co"),
    KAFKA_TOPIC_UPDATE_STATUS: z.string().default("appointment-topic-update-status"),
    KAFKA_GROUP_ID: z.coerce.number().default(1000),
    CLIENT_ID: z.string().default("ms-appointment"),
})

type Env = z.infer<typeof schema>

export const env: Env = schema.parse(process.env)
