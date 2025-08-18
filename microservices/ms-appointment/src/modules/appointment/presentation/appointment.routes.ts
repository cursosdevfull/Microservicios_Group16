import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { AppointmentApplication } from "../application/appointment.application";
import { AppointmentAdapter } from "../adapters/appointment.adapter";
import { AppointmentPort } from "../ports/appointment.port";

class AppointmentRoutes {
    private router = Router();

    constructor(private readonly controller: AppointmentController) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/", this.controller.create.bind(this.controller));
    }

    public getRouter() {
        return this.router;
    }
}

const port: AppointmentPort = new AppointmentAdapter();
const application = new AppointmentApplication(port);
const controller = new AppointmentController(application);

export default new AppointmentRoutes(controller).getRouter();