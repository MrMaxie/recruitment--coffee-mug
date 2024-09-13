import { z } from 'zod';

export const objectId = () =>
    z
        .string()
        .length(24, 'Must be 24 characters')
        .regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid ObjectId');
