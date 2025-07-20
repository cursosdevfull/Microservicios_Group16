import { TBootstrap, TReturnType } from "./bootstrap.type";
import { env } from '../../env';
import amqp from 'amqplib';

export class RabbitMQBootstrap implements TBootstrap {
    static channel: amqp.Channel;

    initialize(): Promise<TReturnType> {
        const host = `amqp://${env.RABBITMQ_USER}:${env.RABBITMQ_PASS}@${env.RABBITMQ_HOST}`;

        return new Promise(async (resolve, reject) => {
            try {
                const channelModel = await amqp.connect(host);
                RabbitMQBootstrap.channel = await channelModel.createChannel();
                resolve(`RabbitMQ connected to ${host}`);
            } catch (error) {
                console.error("RabbitMQ connection error:", error);
                reject(`Failed to connect to RabbitMQ at ${host}`);
            }
        })
    }
} 