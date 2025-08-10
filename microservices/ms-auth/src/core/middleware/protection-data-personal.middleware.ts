import { Request, Response, NextFunction } from "express";

export const protectionDataPersonalMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const methodOriginal = res.json;

    res.json = (data: any) => {
        delete data.password;
        return methodOriginal.call(res, data);
    };

    next();
};
