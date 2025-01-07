import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: (msg) => console.log(`[Database] ${msg}`),
  pool: {
    max: 2,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  dialectOptions: {
    connectTimeout: 60000,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: true
    } : false
  },
  retry: {
    max: 5,
    backoffBase: 1000,
    backoffExponent: 1.5
  }
});

// Don't immediately authenticate - let the app handle it
export default sequelize;