import { DatabaseBootstrap, ServerBootstrap } from "@core/bootstrap";
import app from "./app"
import "./env"
import { DiscoveryClient } from "@core/clients/discovery.client";

(async () => {

    try {
        const serverBootstrap = new ServerBootstrap(app);
        const databaseBootstrap = new DatabaseBootstrap();


        const listeningPromises = [
            serverBootstrap.initialize(),
            databaseBootstrap.initialize(),
        ]

        const results = await Promise.all(listeningPromises)

        results.forEach(result => {
            console.log(result);
        });

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