import z from "zod";
import { Request, Response } from "express";
import { DiscoveryClient } from "@core/clients/discovery.client";
import { ServiceInfo } from "@core/interfaces/service-info";
import { HttpRequest } from "@core/services/request.service";

export class GatewayController {
    async login(req: Request, res: Response) {
        const bodySchema = z.object({
            email: z.email(),
            password: z.string().min(6)
        })

        const parsedBody = bodySchema.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ error: "Invalid request body" });
        } else {
            const result = await new DiscoveryClient().findService('ms-auth') as Array<ServiceInfo>;
            if (!result || result.length === 0) {
                throw new Error('User service not found');
            }

            const { host, port } = result[0];

            const tokens = await HttpRequest(`http://${host}:${port}/auth/v1/login`, "POST", req.body, "Login failed")

            res.status(200).json(tokens);
        }
    }

    getNewAccessToken(req: Request, res: Response) { }

    async createAppointment(req: Request, res: Response) {
        const accessToken = req.headers['authorization']?.split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await new DiscoveryClient().findService('ms-auth') as Array<ServiceInfo>;
        if (!result || result.length === 0) {
            throw new Error('Auth service not found');
        }

        const { host, port } = result[0];

        const validation = await HttpRequest(`http://${host}:${port}/auth/v1/validate-access-token`, "POST", { accessToken }, "Login failed")

        if (!validation.isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }


        const resultAppointment = await new DiscoveryClient().findService('ms-appointment') as Array<ServiceInfo>;
        if (!resultAppointment || resultAppointment.length === 0) {
            throw new Error('Appointment service not found');
        }

        const { host: hostAppointment, port: portAppointment } = resultAppointment[0];

        const createAppointment = await HttpRequest(`http://${hostAppointment}:${portAppointment}/appointment/v1`, "POST", req.body, "Create appointment failed")

        res.status(200).json(createAppointment);
    }
}