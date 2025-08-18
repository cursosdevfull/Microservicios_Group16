import z from "zod";
import { AuthApplication } from "../application/auth.application";
import { Request, Response } from "express";

export class AuthController {
    constructor(private authApplication: AuthApplication) { }

    async login(req: Request, res: Response) {
        const bodySchema = z.object({
            email: z.email(),
            password: z.string().min(6)
        })

        const parsedBody = bodySchema.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ error: "Invalid request body" });
        } else {
            const tokens = await this.authApplication.login(parsedBody.data.email, parsedBody.data.password);
            if (tokens) {
                res.json(tokens);
            } else {
                res.status(401).json({ error: "Invalid email or password" });
            }
        }
    }

    async getAccessToken(req: Request, res: Response) {
        const bodySchema = z.object({
            refreshToken: z.string().min(1)
        });

        const parsedBody = bodySchema.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ error: "Invalid request body" });
        } else {
            const tokens = await this.authApplication.getAccessToken(parsedBody.data.refreshToken);
            if (tokens) {
                res.json(tokens);
            } else {
                res.status(401).json({ error: "Invalid refresh token" });
            }
        }
    }

    async validateAccessToken(req: Request, res: Response) {
        const bodySchema = z.object({
            accessToken: z.string().min(1)
        });

        const parsedBody = bodySchema.safeParse(req.body);
        if (!parsedBody.success) {
            res.status(400).json({ error: "Invalid request body" });
        } else {
            const token = parsedBody.data.accessToken;
            const user = this.authApplication.validateAccessToken(token);

            res.json({ isValid: user ? true : false })
        }
    }
}