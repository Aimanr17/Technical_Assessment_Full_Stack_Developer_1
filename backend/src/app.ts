import express from 'express';
import cors from 'cors';
import mysql, { RowDataPacket, OkPacket } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Log environment variables (excluding sensitive data)
console.log('Environment:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
});

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
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '51179'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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

// Define types for our items
interface Item extends RowDataPacket {
    id: number;
    name: string;
    description: string | null;
    price: number;
    created_at: Date;
    updated_at: Date;
}

// API endpoints
app.get('/api/items', async (req, res) => {
    try {
        const [rows] = await pool.execute<Item[]>('SELECT * FROM items');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
});

// Create item endpoint
app.post('/api/items', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        
        if (!name || typeof price !== 'number') {
            return res.status(400).json({ 
                error: 'Bad Request',
                message: 'Name and price are required. Price must be a number.'
            });
        }

        // First insert the new item
        const [insertResult] = await pool.execute<OkPacket>(
            'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
            [name, description, price]
        );
        
        // Then fetch the newly created item
        const [items] = await pool.execute<Item[]>(
            'SELECT * FROM items WHERE id = ?',
            [insertResult.insertId]
        );
        
        const newItem = items[0];
        if (!newItem) {
            throw new Error('Failed to retrieve created item');
        }
        
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'Server is running!',
        environment: process.env.NODE_ENV,
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            name: process.env.DB_NAME,
            connected: pool.pool?.pool?.length > 0
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
