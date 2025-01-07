import express from 'express';
import cors from 'cors';
import mysql, { Pool, RowDataPacket, OkPacket } from 'mysql2/promise';
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
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl: {}
};

// Create database connection pool
let pool: Pool;

const initializeDatabase = async () => {
    try {
        pool = mysql.createPool(dbConfig);
        
        // Test the connection
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        
        // Test query to check if items table exists
        const [tables] = await connection.query('SHOW TABLES LIKE "items"');
        if (Array.isArray(tables) && tables.length === 0) {
            console.log('Creating items table...');
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
        
        connection.release();
        return true;
    } catch (error) {
        console.error('Database initialization error:', error);
        return false;
    }
};

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
        if (!pool) {
            const initialized = await initializeDatabase();
            if (!initialized) {
                throw new Error('Database not initialized');
            }
        }
        
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

app.post('/api/items', async (req, res) => {
    try {
        if (!pool) {
            const initialized = await initializeDatabase();
            if (!initialized) {
                throw new Error('Database not initialized');
            }
        }

        const { name, description, price } = req.body;
        
        if (!name || typeof price !== 'number') {
            return res.status(400).json({ 
                error: 'Bad Request',
                message: 'Name and price are required. Price must be a number.'
            });
        }

        const [result] = await pool.execute<OkPacket>(
            'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
            [name, description, price]
        );
        
        const [items] = await pool.execute<Item[]>(
            'SELECT * FROM items WHERE id = ?',
            [result.insertId]
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
app.get('/', async (req, res) => {
    let dbStatus = false;
    try {
        if (!pool) {
            await initializeDatabase();
        }
        const connection = await pool.getConnection();
        connection.release();
        dbStatus = true;
    } catch (error) {
        console.error('Health check database error:', error);
    }

    res.json({
        status: 'Server is running',
        environment: process.env.NODE_ENV,
        database: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            name: process.env.DB_NAME,
            connected: dbStatus
        }
    });
});

// Initialize database before starting server
initializeDatabase().then((success) => {
    if (success) {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    } else {
        console.error('Failed to initialize database. Server not started.');
        process.exit(1);
    }
});
