"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const item_route_1 = __importDefault(require("./routes/item.route"));
const database_1 = __importDefault(require("./config/database"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Create router for /api
const apiRouter = express_1.default.Router();
// Health check endpoint
apiRouter.get('/', (req, res) => {
    console.log('Health check endpoint called');
    res.json({
        status: 'ok',
        message: 'Server is running',
        env: process.env.NODE_ENV,
        time: new Date().toISOString(),
        headers: req.headers,
        baseUrl: req.baseUrl,
        originalUrl: req.originalUrl
    });
});
// Database test endpoint
apiRouter.get('/db-test', async (req, res) => {
    var _a, _b, _c, _d;
    try {
        await database_1.default.authenticate();
        const [results] = await database_1.default.query('SELECT 1+1 as result');
        res.json({
            status: 'ok',
            message: 'Database connection successful',
            results,
            env: process.env.NODE_ENV,
            dbConfig: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER
            }
        });
    }
    catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: {
                message: error.message,
                code: (_a = error.original) === null || _a === void 0 ? void 0 : _a.code,
                errno: (_b = error.original) === null || _b === void 0 ? void 0 : _b.errno,
                sqlState: (_c = error.original) === null || _c === void 0 ? void 0 : _c.sqlState,
                sqlMessage: (_d = error.original) === null || _d === void 0 ? void 0 : _d.sqlMessage
            }
        });
    }
});
// Routes
apiRouter.use('/items', item_route_1.default);
// Mount API router
app.use('/api', apiRouter);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Something broke!',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
// Handle 404
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: req.path,
        method: req.method
    });
});
// Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        console.log('Environment:', process.env.NODE_ENV);
        console.log('Database config:', {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER
        });
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map