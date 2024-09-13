import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger';
import { HttpError } from './HttpError';
import { ZodError } from 'zod';

const forDev = (data: Record<string, unknown>, additionalData: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
        return { ...data, ...additionalData };
    }

    return { ...data };
};

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json(
            forDev(
                {
                    message: err.message,
                },
                {
                    stack: err.stack,
                },
            ),
        );
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json(
            forDev(
                {
                    message: err.errors,
                },
                {
                    rawMessage: err.message,
                    stack: err.stack,
                },
            ),
        );
        return;
    }

    logger.error(err);

    res.status(500).json(
        forDev(
            {
                message: 'Internal server error',
            },
            {
                rawMessage: err instanceof Error ? err.message : 'No-Error thrown',
                stack: err instanceof Error ? err.stack : 'No-Error thrown',
            },
        ),
    );
};
