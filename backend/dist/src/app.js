"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '51179'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
console.log('Database config (without password):', Object.assign(Object.assign({}, dbConfig), { password: '****' }));
const pool = promise_1.default.createPool(dbConfig);
pool.getConnection()
    .then(async (connection) => {
    console.log('Database connected successfully');
    try {
        const [rows] = await connection.query('SHOW TABLES LIKE "items"');
        if (Array.isArray(rows) && rows.length === 0) {
            console.log('Items table does not exist. Creating it...');
            await connection.query(`
                    CREATE TABLE IF NOT EXISTS items (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        description TEXT,
                        price DECIMAL(10, 2) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )
                `);
            console.log('Items table created successfully');
        }
        else {
            console.log('Items table already exists');
        }
    }
    catch (error) {
        console.error('Error checking/creating items table:', error);
    }
    connection.release();
})
    .catch(err => {
    console.error('Error connecting to the database:', err);
});
app.get('/api/items', async (req, res) => {
    try {
        console.log('Fetching items from database...');
        const [rows] = await pool.execute('SELECT * FROM items');
        console.log('Items fetched successfully:', rows);
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
app.post('/api/items', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const [result] = await pool.execute('INSERT INTO items (name, description, price) VALUES (?, ?, ?)', [name, description, price]);
        const [newItem] = await pool.execute('SELECT * FROM items WHERE id = ?', [result.insertId]);
        res.status(201).json(newItem[0]);
    }
    catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
app.get('/', (req, res) => {
    res.json({ status: 'Server is running!' });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map