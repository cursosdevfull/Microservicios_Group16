import { Router } from "express";
import { UserController } from "./user.controller";
import { UserApplication } from "../application/user.application";
import { UserAdapter } from "../adapters/user.adapter";
import { UserPort } from "../ports/user.port";

class UserRoutes {
    private router = Router();

    constructor(private readonly controller: UserController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/", this.controller.create.bind(this.controller));
        this.router.get("/email/:email", this.controller.findByEmail.bind(this.controller));
        this.router.get("/refresh-token/:refreshToken", this.controller.findByRefreshToken.bind(this.controller));
        this.router.post("/login", this.controller.login.bind(this.controller));
    }

    public getRouter() {
        return this.router;
    }
}

const port: UserPort = new UserAdapter();
const application = new UserApplication(port);
const controller = new UserController(application);

export default new UserRoutes(controller).getRouter();