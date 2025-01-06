"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const item_route_1 = tslib_1.__importDefault(require("./routes/item.route"));
const database_1 = tslib_1.__importDefault(require("./config/database"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        env: process.env.NODE_ENV,
        time: new Date().toISOString()
    });
});
// Database test endpoint
app.get('/db-test', async (req, res) => {
    try {
        await database_1.default.authenticate();
        const [results] = await database_1.default.query('SELECT 1+1 as result');
        res.json({
            status: 'ok',
            message: 'Database connection successful',
            results
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            error: {
                message: error.message,
                code: error.original?.code,
                errno: error.original?.errno,
                sqlState: error.original?.sqlState,
                sqlMessage: error.original?.sqlMessage
            }
        });
    }
});
// Routes
app.use('/items', item_route_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!', message: err.message });
});
// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found' });
});
// Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
exports.default = app;
