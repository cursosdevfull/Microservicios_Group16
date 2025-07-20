import { Kafka, logLevel } from "kafkajs";
import { TBootstrap, TReturnType } from "./bootstrap.type";
import { env } from '../../env';

export class KafkaBootstrap implements TBootstrap {
    private static kafka: Kafka

    initialize(): Promise<TReturnType> {
        return new Promise((resolve, reject) => {
            try {
                const { KAFKA_BROKER, CLIENT_ID } = env
                KafkaBootstrap.kafka = new Kafka({
                    brokers: [KAFKA_BROKER],
                    clientId: CLIENT_ID,
                    logLevel: logLevel.INFO,
                })
                resolve("Kafka connected successfully");
            } catch (error) {
                reject(error)
            }
        })
    }

    static getKafkaInstance() {
        return this.kafka
    }

}