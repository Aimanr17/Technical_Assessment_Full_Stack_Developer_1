import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://technical-assessment-full-stack-developer-1-frontend.vercel.app']
        : ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'roundhouse.proxy.rlwy.net',
    port: parseInt(process.env.DB_PORT || '51179'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
    ssl: process.env.NODE_ENV === 'production' ? {} : undefined
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// API endpoints
app.get('/api/items', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM items');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create item endpoint
app.post('/api/items', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const [result] = await pool.execute(
            'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
            [name, description, price]
        );
        const [newItem] = await pool.execute('SELECT * FROM items WHERE id = ?', [result.insertId]);
        res.status(201).json(newItem[0]);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
