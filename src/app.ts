import { Application } from "express";
import express, { Request, Response } from "express";
import { HealthCheckService } from "./core/services/healthcheck.service";
import {
    errorHandler,
    notFoundHandler,
} from "./core/middleware/error.middleware";
import { RegistryService } from "@core/services";
import { createRoutes } from "./modules/api";

class App {
    readonly app: Application;
    private healthCheckService: HealthCheckService;
    private readonly registry = new RegistryService();

    constructor() {
        this.app = express();
        this.healthCheckService = new HealthCheckService();
        this.setupMiddleware();
        this.mountRoutes();
        this.mountHealthCheck();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    mountRoutes() {
        this.app.get("/", (req, res) => {
            res.json({
                name: "Microservice Discovery",
                version: "1.0.0",
                description: "A microservice for service discovery",
                endpoints: {
                    health: "/health",
                    healthcheck: "/healthcheck",
                    register: "/api/services",
                    heartbeat: "/api/services/:id/heartbeat",
                    unregister: "/api/services/:id",
                    services: "/api/services",
                    serviceByName: "/api/services/name/:name",
                    serviceById: "/api/services/id/:id",
                    stats: "/api/stats",
                },
            });
        });

        this.app.use("/api", createRoutes(this.registry));
    }

    mountHealthCheck() {
        const requestHealth = async (req: Request, res: Response) => {
            try {
                const healthResult = await this.healthCheckService.checkAllServices();

                if (healthResult.overall === "healthy") {
                    res.status(200).json(healthResult);
                } else {
                    res.status(503).json(healthResult);
                }
            } catch (error: any) {
                res.status(503).json({
                    overall: "unhealthy",
                    services: [],
                    timestamp: new Date().toISOString(),
                    error: error.message,
                });
            }
        }

        this.app.get("/health", requestHealth);
        this.app.get("/healthcheck", requestHealth);
    }

    setupErrorHandling() {
        // Handle 404 errors
        this.app.use(notFoundHandler);

        // Handle other errors
        this.app.use(errorHandler);
    }
}

export default new App().app;
