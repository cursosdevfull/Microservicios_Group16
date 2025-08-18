import { DatabaseBootstrap, KafkaBootstrap, ServerBootstrap } from "@core/bootstrap";
import app from "./app"
import "./env"
import { DiscoveryClient } from "@core/clients/discovery.client";
import { KafkaService } from "@core/services/kafka.service";
import { env } from "./env";
import { AppointmentPort } from "./modules/appointment/ports/appointment.port";
import { AppointmentAdapter } from "./modules/appointment/adapters/appointment.adapter";
import { AppointmentApplication } from "./modules/appointment/application/appointment.application";

(async () => {
    try {
        const serverBootstrap = new ServerBootstrap(app);
        const databaseBootstrap = new DatabaseBootstrap();
        const kafkaBootstrap = new KafkaBootstrap();

        const listeningPromises = [
            serverBootstrap.initialize(),
            databaseBootstrap.initialize(),
            kafkaBootstrap.initialize(),
        ]

        const results = await Promise.all(listeningPromises)

        results.forEach(result => {
            console.log(result);
        });

        const kafka = KafkaService.getInstance([env.KAFKA_TOPIC_CO, env.KAFKA_TOPIC_UPDATE_STATUS], env.KAFKA_GROUP_ID, KafkaBootstrap.getKafkaInstance());
        const listPromises = [kafka.connectProducer(),
        kafka.connectConsumer()]

        await Promise.all(listPromises);

        const port: AppointmentPort = new AppointmentAdapter();
        const application = new AppointmentApplication(port)
        await application.subscribe();

        const discoveryClient = new DiscoveryClient();
        await discoveryClient.register();
    } catch (error) {
        console.error("Error during initialization:", error);
    }
})()

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1); // Exit the process with failure
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1); // Exit the process with failure
});

process.on("SIGINT", () => {
    console.log("SIGINT received. Shutting down gracefully...");
    process.exit(0); // Exit the process gracefully
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    process.exit(0); // Exit the process gracefully
});

process.on("exit", (code) => {
    console.log(`Process exited with code: ${code}`);
    // Perform any necessary cleanup here
});