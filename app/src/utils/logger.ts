import Winston from 'winston';

export const logger = (() => {
    const nodeEnv = process.env.NODE_ENV || 'development';

    return Winston.createLogger({
        silent: nodeEnv === 'test',
        level: nodeEnv === 'development' ? 'debug' : 'info',
        transports: [
            new Winston.transports.Console({
                format: Winston.format.combine(
                    Winston.format.colorize(),
                    Winston.format.timestamp({
                        format: nodeEnv === 'development' ? 'HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss',
                    }),
                    Winston.format.printf(({ level, message, timestamp }) => `[${timestamp}][${level}]: ${message}`),
                ),
            }),
            new Winston.transports.File({ filename: 'error.log', level: 'error', format: Winston.format.json() }),
            new Winston.transports.File({ filename: 'app.log', format: Winston.format.json() }),
        ],
    });
})();
