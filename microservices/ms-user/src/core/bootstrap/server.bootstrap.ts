import { Application } from "express";
import { TBootstrap, TReturnType } from "./bootstrap.type";
import http from 'http';
import { env } from '../../env';

export class ServerBootstrap implements TBootstrap {
    constructor(private readonly app: Application) { }

    async initialize(): Promise<TReturnType> {
        const server = http.createServer(this.app);
        const port = env.PORT

        return new Promise((resolve, reject) => {
            server
                .listen(port)
                .on("listening", () => {
                    resolve(`Server is running on port ${port}`);
                })
                .on("error", (error: any) => {
                    reject(`Error starting server: ${error.message}`);
                })
        })
    }

}