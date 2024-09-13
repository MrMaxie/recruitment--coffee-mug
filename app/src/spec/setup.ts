import { beforeAll, afterAll, afterEach } from 'vitest';
import { createConnection, closeConnection, connectionsRefs } from '~/utils';

beforeAll(async () => {
    await createConnection();
});

afterAll(async () => {
    await closeConnection();
});
