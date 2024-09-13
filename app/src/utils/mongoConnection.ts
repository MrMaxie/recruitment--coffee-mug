import assert from 'node:assert';
import Mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

export const connectionsRefs = {
    connection: null as Mongoose.Connection | null,
    inMemoryServer: null as MongoMemoryReplSet | null,
};

const getMongoUri = async () => {
    const mongoUri = process.env.MONGO_URI;
    const nodeEnv = process.env.NODE_ENV ?? 'development';

    if (nodeEnv !== 'development' && nodeEnv !== 'test') {
        assert(mongoUri, 'MONGO_URI is required');
        return mongoUri;
    }

    if (mongoUri) {
        return mongoUri;
    }

    const mongoMemoryServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });

    connectionsRefs.inMemoryServer = mongoMemoryServer;

    return mongoMemoryServer.getUri();
};

/**
 * For development and test purposes, we can spawn a in-memory MongoDB server replacement
 * to avoid the need to have a MongoDB server running on the local machine.
 */
export const createConnection = async () => {
    const mongoUri = await getMongoUri();

    if (Mongoose.connection.readyState) {
        await Mongoose.disconnect();
    }

    const db = await Mongoose.connect(mongoUri);

    db.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
    });

    connectionsRefs.connection = db.connection;

    return db;
};

/**
 * Closes the MongoDB connection and stops the in-memory server if it was spawned.
 */
export const closeConnection = async () => {
    if (connectionsRefs.connection) {
        await connectionsRefs.connection.close();
        Mongoose.disconnect();
    }

    if (connectionsRefs.inMemoryServer) {
        await connectionsRefs.inMemoryServer.stop();
    }
};
