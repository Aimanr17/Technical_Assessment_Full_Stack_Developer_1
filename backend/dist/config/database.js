"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize({
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
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    retry: {
        max: 5,
        backoffBase: 1000,
        backoffExponent: 1.5
    }
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map