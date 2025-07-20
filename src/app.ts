import { Application } from "express";
import express from 'express';
import { HealthCheckService } from './core/services/healthcheck.service';
import { errorHandler, notFoundHandler } from './core/middleware/error.middleware';

class App {
    readonly app: Application;
    private healthCheckService: HealthCheckService;

    constructor() {
        this.app = express()
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

    mountHealthCheck() {
        // Basic health check routes
        this.app.get("/health", async (req, res) => {
            try {
                const healthResult = await this.healthCheckService.checkAllServices();

                if (healthResult.overall === 'healthy') {
                    res.status(200).json(healthResult);
                } else {
                    res.status(503).json(healthResult);
                }
            } catch (error: any) {
                res.status(503).json({
                    overall: 'unhealthy',
                    services: [],
                    timestamp: new Date().toISOString(),
                    error: error.message
                });
            }
        });

        this.app.get("/healthcheck", async (req, res) => {
            try {
                const healthResult = await this.healthCheckService.checkAllServices();

                if (healthResult.overall === 'healthy') {
                    res.status(200).json(healthResult);
                } else {
                    res.status(503).json(healthResult);
                }
            } catch (error: any) {
                res.status(503).json({
                    overall: 'unhealthy',
                    services: [],
                    timestamp: new Date().toISOString(),
                    error: error.message
                });
            }
        });

        // Individual service health checks
        this.app.get("/health/database", async (req, res) => {
            try {
                const result = await this.healthCheckService.checkDatabase();
                const status = result.status === 'healthy' ? 200 : 503;
                res.status(status).json(result);
            } catch (error: any) {
                res.status(503).json({
                    service: 'database',
                    status: 'unhealthy',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        this.app.get("/health/redis", async (req, res) => {
            try {
                const result = await this.healthCheckService.checkRedis();
                const status = result.status === 'healthy' ? 200 : 503;
                res.status(status).json(result);
            } catch (error: any) {
                res.status(503).json({
                    service: 'redis',
                    status: 'unhealthy',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        this.app.get("/health/rabbitmq", async (req, res) => {
            try {
                const result = await this.healthCheckService.checkRabbitMQ();
                const status = result.status === 'healthy' ? 200 : 503;
                res.status(status).json(result);
            } catch (error: any) {
                res.status(503).json({
                    service: 'rabbitmq',
                    status: 'unhealthy',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        });

        this.app.get("/health/kafka", async (req, res) => {
            try {
                const result = await this.healthCheckService.checkKafka();
                const status = result.status === 'healthy' ? 200 : 503;
                res.status(status).json(result);
            } catch (error: any) {
                res.status(503).json({
                    service: 'kafka',
                    status: 'unhealthy',
                    message: error.message,
                    timestamp: new Date().toISOString()
                });
            }
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