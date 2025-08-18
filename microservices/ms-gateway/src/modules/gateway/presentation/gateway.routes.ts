import { Router } from "express";
import { GatewayController } from './gateway.controller';
import { GatewayApplication } from "../application/gateway.application";
import { GatewayAdapter } from "../adapters/gateway.adapter";
import { GatewayPort } from "../ports/gateway.port";

class GatewayRoutes {
    private router: Router;
    private readonly controller: GatewayController;

    constructor(controller: GatewayController) {
        this.router = Router();
        this.controller = controller;
        this.healthCheck();
        this.initializeRoutes();
    }

    private healthCheck() {
        this.router.get("/health", (req, res) => {
            res.json({ status: "healthy", timestamp: new Date().toISOString() });
        });

        this.router.get("/healthcheck", (req, res) => {
            res.json({ status: "healthy", timestamp: new Date().toISOString() });
        });
    }

    private initializeRoutes() {
        this.router.post("/login", this.controller.login.bind(this.controller));
        this.router.post("/get-new-access-token", this.controller.getNewAccessToken.bind(this.controller));
        this.router.post("/create-appointment", this.controller.createAppointment.bind(this.controller));
    }

    public getRouter(): Router {
        return this.router;
    }
}

const controller = new GatewayController()
export default new GatewayRoutes(controller).getRouter();