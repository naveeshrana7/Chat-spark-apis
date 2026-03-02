import { Sequelize } from 'sequelize';
import { DB_CONFIG } from '../../configs/server.config';

const sequelize = new Sequelize(
    DB_CONFIG.NAME,
    DB_CONFIG.USER,
    DB_CONFIG.PASS,
    {
        host: DB_CONFIG.HOST,
        port: DB_CONFIG.PORT,
        dialect: 'postgres',
        logging: DB_CONFIG.LOG_ENABLED ? console.log : false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            min: DB_CONFIG.MIN_POOL,
            max: DB_CONFIG.MAX_POOL,
            idle: 10000
        }
    }
);

export { sequelize };
