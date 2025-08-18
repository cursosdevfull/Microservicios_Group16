import { Application } from "express";
import express from 'express';
import { errorHandler, notFoundHandler } from './core/middleware/error.middleware';
import gatewayRoutes from "./modules/gateway/presentation/gateway.routes";
import { protectionDataPersonalMiddleware } from "@core/middleware/protection-data-personal.middleware";

class App {
    readonly app: Application;

    constructor() {
        this.app = express()
        this.setupMiddleware();
        this.mountRoutes();
        this.mountHealthCheck();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(protectionDataPersonalMiddleware)
    }

    mountRoutes() {
        this.app.get("/", (req, res) => {
            res.json({
                message: "Microservices API is running",
                timestamp: new Date().toISOString(),
                endpoints: [
                    "GET / - API status",
                    "GET /health - Overall health check",
                    "GET /healthcheck - Overall health check (alias)",
                ]
            });
        })

        this.app.use("/api", gatewayRoutes);
    }

    mountHealthCheck() {
        // Basic health check routes
        this.app.get("/health", async (req, res) => {
            res.json({ status: "healthy", timestamp: new Date().toISOString() });
        });

        this.app.get("/healthcheck", async (req, res) => {
            res.json({ status: "healthy", timestamp: new Date().toISOString() });
        });
    }

    setupErrorHandling() {
        // Handle 404 errors
        this.app.use(notFoundHandler);

        // Handle other errors
        this.app.use(errorHandler);
    }
}

export default new App().app