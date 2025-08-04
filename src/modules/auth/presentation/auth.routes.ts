import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthApplication } from "../application/auth.application";
import { AuthPort } from '../ports/auth.port';
import { AuthAdapter } from "../adapters/auth.adapter";

class AuthRoutes {
    private router: Router = Router();

    constructor(private readonly authController: AuthController) { }

    public registerRoutes(): void {
        this.router.post('/login', this.authController.login.bind(this.authController));
        this.router.post('/new-access-token', this.authController.getAccessToken.bind(this.authController));
        this.router.post('/validate-access-token', this.authController.validateAccessToken.bind(this.authController));
    }

    public getRouter(): Router {
        return this.router;
    }
}

const port: AuthPort = new AuthAdapter()
const application = new AuthApplication(port)
const controller = new AuthController(application)
export default new AuthRoutes(controller).getRouter();