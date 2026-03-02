import dotenv from 'dotenv';
dotenv.config();

export interface IServer {
    PORT: number;
    ADDRESS: string;
    ENABLE_SERVER_LOGS: boolean;
    NODE_ENV: string;
}

export interface IDatabaseConfig {
    HOST: string;
    PORT: number;
    NAME: string;
    USER: string;
    PASS: string;
    LOG_ENABLED: boolean;
    MIN_POOL: number;
    MAX_POOL: number;
}

export const SERVER_CONFIG: IServer = {
    PORT: Number(process.env.PORT) || 9000,
    ADDRESS: process.env.ADDRESS || '0.0.0.0',
    ENABLE_SERVER_LOGS: process.env.ENABLE_SERVER_LOGS === 'true',
    NODE_ENV: process.env.NODE_ENV || 'development'
};

export const DB_CONFIG: IDatabaseConfig = {
    HOST: process.env.DB_HOST || 'localhost',
    PORT: Number(process.env.DB_PORT) || 5432,
    NAME: process.env.DB_DATABASE as string,
    USER: process.env.DB_USER as string,
    PASS: process.env.DB_PASSWORD as string,
    LOG_ENABLED: process.env.DB_LOG_ENABLED === 'true',
    MIN_POOL: Number(process.env.DB_MIN_POOL) || 0,
    MAX_POOL: Number(process.env.DB_MAX_POOL) || 4
};

export const CONSTANTS = {
    EARNINGS_RATE_PER_MIN: 6
};
