import z from "zod";
import { AppointmentApplication } from "../application/appointment.application";
import { Request, Response } from "express";
import { Appointment } from "../application/appointment";

export class AppointmentController {
    constructor(private appointmentApplication: AppointmentApplication) { }

    async create(req: Request, res: Response) {
        const body = req.body;

        const bodySchema = z.object({
            scheduleId: z.uuid("Invalid schedule ID"),
            userId: z.uuid("Invalid user ID"),
            countryISO: z.string().length(2, "Invalid country ISO"),
        });

        const validationResult = bodySchema.safeParse(body);
        if (!validationResult.success) {
            res.status(400).json({ errors: validationResult.error });
        } else {
            const appointmentProps = {
                scheduleId: body.scheduleId,
                userId: body.userId,
                countryISO: body.countryISO,
            }

            const appointment = new Appointment(appointmentProps);

            const createdAppointment = await this.appointmentApplication.save(appointment);
            res.status(201).json(createdAppointment);
        }
    }
}