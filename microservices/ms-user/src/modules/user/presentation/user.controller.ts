import z from "zod";
import { UserApplication } from "../application/user.application";
import { Request, Response } from "express";
import { User } from "../application/user";
import { CypherService } from "@core/services/cypher.service";

export class UserController {
    constructor(private userApplication: UserApplication) { }

    async create(req: Request, res: Response) {
        const body = req.body;

        const bodySchema = z.object({
            name: z.string().min(1, "Name is required"),
            email: z.email("Invalid email format"),
            password: z.string().min(6, "Password must be at least 6 characters long"),
        });

        const validationResult = bodySchema.safeParse(body);
        if (!validationResult.success) {
            res.status(400).json({ errors: validationResult.error });
        } else {
            const userProps = {
                name: body.name,
                email: body.email,
                password: await CypherService.hash(body.password)
            }

            const user = new User(userProps);

            const createdUser = await this.userApplication.save(user);
            res.status(201).json(createdUser);
        }
    }

    async findByEmail(req: Request, res: Response) {
        const { email } = req.params;

        const emailSchema = z.email("Invalid email format");
        const validationResult = emailSchema.safeParse(email);

        if (!validationResult.success) {
            res.status(400).json({ error: validationResult.error });
        } else {
            const user = await this.userApplication.findByEmail(email);
            if (!user) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.json(user);
            }
        }

    }

    async findByRefreshToken(req: Request, res: Response) {
        const { refreshToken } = req.params;

        const refreshTokenSchema = z.string().min(1, "Refresh token is required");
        const validationResult = refreshTokenSchema.safeParse(refreshToken);

        if (!validationResult.success) {
            res.status(400).json({ error: validationResult.error });
        } else {
            const user = await this.userApplication.findByRefreshToken(refreshToken);
            if (!user) {
                res.status(404).json({ error: "User not found" });
            } else {
                res.json(user);
            }


        }
    }

    async login(req: Request, res: Response) {
        const body = req.body;

        const bodySchema = z.object({
            email: z.email("Invalid email format"),
            password: z.string().min(6, "Password must be at least 6 characters long"),
        });

        const validationResult = bodySchema.safeParse(body);
        if (!validationResult.success) {
            res.status(400).json({ errors: validationResult.error });
        } else {

            const user = await this.userApplication.login(body.email, body.password);

            if (!user) {
                res.status(401).json({ error: "Invalid email or password" });
            } else {
                res.json(user);
            }
        }
    }
}