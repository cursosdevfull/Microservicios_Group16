import { RegistryService } from "@core/services";
import { EnumServiceStatus, TServiceQuery } from "@core/types";
import express, { Response, Request } from "express";
import { z } from "zod";

const router = express.Router();

export const createRoutes = (registry: RegistryService) => {
    router.post("/services", (req: Request, res: Response) => {
        try {
            const registrySchema = z.object({
                name: z.string(),
                host: z.string(),
                port: z.number().int().positive(),
                healthCheckUrl: z.url(),
            });

            const validatedRegistry = registrySchema.parse(req.body);

            const serviceInstance = registry.register(validatedRegistry);

            res.status(201).json(serviceInstance);

        } catch (error) {
            console.error("Error registering service:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    });

    router.get("/services", (req: Request, res: Response) => {
        try {
            const querySchema = z.object({
                name: z.string().optional(),
                status: z.enum(["HEALTHY", "UNHEALTHY", "UNKNOWN"]).optional(),
            });

            const validatedQuery = querySchema.parse(req.query);

            const query: TServiceQuery = validatedQuery as TServiceQuery;
            const services = registry.getServicesByName(query.name || "");

            if (query.status) {
                const status = EnumServiceStatus[query.status.toUpperCase() as keyof typeof EnumServiceStatus];
                res.json(services.filter(service => service.status === status));
            } else {
                res.json(services);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    });

    router.get("/services/name/:name", (req: Request, res: Response) => {
        try {
            const paramSchema = z.object({
                name: z.string()
            });

            const querySchema = z.object({
                healthy: z.boolean().default(false),
            });

            const validatedParams = paramSchema.parse(req.params);
            const validatedQuery = querySchema.parse(req.query);

            const services = validatedQuery.healthy
                ? registry.getHealthyServicesByName(validatedParams.name)
                : registry.getServicesByName(validatedParams.name);


            res.json(services);

        } catch (error) {
            console.error("Error getting services by name:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    });


    router.get("/services/id/:id", (req: Request, res: Response) => {
        try {
            const paramSchema = z.object({
                id: z.string()
            });

            const validatedParams = paramSchema.parse(req.params);

            const service = registry.getService(validatedParams.id);

            if (service) {
                res.json(service);
            } else {
                res.status(404).json({
                    error: "Service not found",
                });
            }

        } catch (error) {
            console.error("Error getting services by id:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    });

    router.put("/services/:id/heartbeat", (req: Request, res: Response) => {
        try {
            const paramSchema = z.object({
                id: z.string()
            });

            const validatedParams = paramSchema.parse(req.params);

            const success = registry.heartbeat(validatedParams.id);

            if (!success) {
                res.status(404).json({
                    error: "Service not found",
                });
            } else {
                res.json({
                    message: "Heartbeat received", timestamp: new Date()
                });
            }
        } catch (error) {
            console.error("Error processing heartbeat:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    });

    router.delete("/services/:id", (req: Request, res: Response) => {
        try {
            const paramSchema = z.object({
                id: z.string()
            });

            const validatedParams = paramSchema.parse(req.params);

            const success = registry.unregister(validatedParams.id);

            if (!success) {
                res.status(404).json({
                    error: "Service not found",
                });
            } else {
                res.json({
                    message: "Service unregistered successfully"
                });
            }
        } catch (error) {
            console.error("Error unregistering service:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    });

    router.get("/stats", (req: Request, res: Response) => {
        try {
            const stats = registry.getStats();
            res.json(stats);
        } catch (error) {
            console.error("Error getting stats:", error);
            res.status(500).json({
                error: "Internal server error",
            });
        }
    });

    router.get("/health", (req: Request, res: Response) => {
        res.json({
            status: "healthy",
            timestamp: new Date(),
            uptime: process.uptime(),
        })
    });



    return router;
};
