"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
dotenv_1.default.config({ path: '.env.dev' });
const DB_NAME = process.env.DB_NAME || 'items_db';
async function createDatabase() {
    const connection = await promise_1.default.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);
    await connection.end();
}
async function initDb() {
    try {
        // First create the database
        await createDatabase();
        // Then initialize Sequelize
        const sequelize = new sequelize_1.Sequelize({
            dialect: 'mysql',
            host: process.env.DB_HOST || '127.0.0.1',
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: DB_NAME,
            logging: false,
        });
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        // Import and sync models
        const ItemModel = (await Promise.resolve().then(() => __importStar(require('./models/item.model')))).default;
        await ItemModel.sync({ force: true }); // This will drop and recreate the table
        // Add sample data with Malaysian prices
        await ItemModel.bulkCreate([
            {
                name: 'Laptop',
                description: 'High-performance laptop with 16GB RAM',
                price: 4999.99, // Updated to RM
            },
            {
                name: 'Smartphone',
                description: 'Latest model with 5G capability',
                price: 3299.99, // Updated to RM
            },
            {
                name: 'Headphones',
                description: 'Noise-cancelling wireless headphones',
                price: 899.99, // Updated to RM
            },
        ]);
        console.log('Database initialized successfully with sample data.');
        await sequelize.close();
    }
    catch (error) {
        console.error('Unable to initialize the database:', error);
        process.exit(1);
    }
}
initDb();
//# sourceMappingURL=init-db.js.map