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
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
};
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    next();
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const apiRouter = express_1.default.Router();
apiRouter.get('/', (_req, res) => {
    console.log('Health check endpoint called');
    res.json({
        status: 'ok',
        message: 'Server is running',
        env: process.env.NODE_ENV,
        time: new Date().toISOString()
    });
});
apiRouter.use('/items', item_route_1.default);
const initializeApp = async () => {
    try {
        await database_1.default.authenticate();
        console.log('Database connection established');
        app.use('/api', apiRouter);
        app.use(errorHandler);
        app.use((_req, res) => {
            res.status(404).json({ error: 'Not Found' });
        });
        if (process.env.NODE_ENV !== 'test') {
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        }
    }
    catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
};
initializeApp();
exports.default = app;
//# sourceMappingURL=app.js.map