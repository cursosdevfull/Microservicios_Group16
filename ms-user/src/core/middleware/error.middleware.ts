import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
    error: string;
    message: string;
    timestamp: string;
    path: string;
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error in health check:', err);

    const errorResponse: ErrorResponse = {
        error: 'Health Check Error',
        message: err.message || 'Internal server error during health check',
        timestamp: new Date().toISOString(),
        path: req.path
    };

    res.status(503).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response) => {
    const errorResponse: ErrorResponse = {
        error: 'Not Found',
        message: `Route ${req.path} not found`,
        timestamp: new Date().toISOString(),
        path: req.path
    };

    res.status(404).json(errorResponse);
};
