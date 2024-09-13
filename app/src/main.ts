import Express from 'express';
import Cors from 'cors';
import DotEnv from 'dotenv';
import { createConnection, closeConnection, errorHandler, logger } from './utils';
import assert from 'node:assert';
import { setupRoutes } from './router';

DotEnv.config();

export const app = Express();

const main = async () => {
    const port = process.env.PORT;

    assert(port, 'PORT is required');

    app.use(Cors());
    app.use(Express.json());

    await createConnection();

    setupRoutes(app);

    app.use(errorHandler);

    if (process.env.NODE_ENV === 'test') {
        return;
    }

    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
};

process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

main();
