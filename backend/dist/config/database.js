"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Log environment variables (excluding sensitive data)
console.log('Database Configuration:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    // Don't log password
});
const sequelize = new sequelize_1.Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: console.log, // Enable SQL query logging
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        connectTimeout: 60000,
        charset: 'utf8mb4',
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});
// Handle connection events
sequelize
    .authenticate()
    .then(() => {
    console.log('✅ Database connection has been established successfully.');
    // Test the connection by running a simple query
    return sequelize.query('SELECT 1+1 as result')
        .then(([results]) => {
        console.log('✅ Test query successful:', results);
    });
})
    .catch(err => {
    var _a, _b, _c, _d;
    console.error('❌ Unable to connect to the database:', {
        message: err.message,
        code: (_a = err.original) === null || _a === void 0 ? void 0 : _a.code,
        errno: (_b = err.original) === null || _b === void 0 ? void 0 : _b.errno,
        sqlState: (_c = err.original) === null || _c === void 0 ? void 0 : _c.sqlState,
        sqlMessage: (_d = err.original) === null || _d === void 0 ? void 0 : _d.sqlMessage
    });
    // Don't exit the process, let the application handle the error
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map