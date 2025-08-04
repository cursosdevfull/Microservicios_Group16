import { Application } from "express";
import express from 'express';
import { HealthCheckService } from './core/services/healthcheck.service';
import { errorHandler, notFoundHandler } from './core/middleware/error.middleware';
import authRoutes from "./modules/auth/presentation/auth.routes";

class App {
    readonly app: Application;
    private healthCheckService: HealthCheckService;

    constructor() {
        this.app = express()
        this.healthCheckService = new HealthCheckService();
        this.setupMiddleware();
        this.mountRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/v1/auth', authRoutes);
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
                    "GET /health/database - Database health check",
                    "GET /health/redis - Redis health check",
                    "GET /health/rabbitmq - RabbitMQ health check",
                    "GET /health/kafka - Kafka health check"
                ]
            });
        })
    }

    setupErrorHandling() {
        // Handle 404 errors
        this.app.use(notFoundHandler);

        // Handle other errors
        this.app.use(errorHandler);
    }
}

export default new App().app