import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import itemRoute from "./routes/item.route";
import sequelize from './config/database';

const app: Express = express();
const port = process.env.PORT || 3001;

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', req.body);
  next();
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create router for /api
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/', (req: Request, res: Response) => {
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
apiRouter.get('/db-test', async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT 1+1 as result');
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
  } catch (error: any) {
    console.error('Database test failed:', error);
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
apiRouter.use('/items', itemRoute);

// Mount API router
app.use('/api', apiRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Something broke!', 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404
app.use((req: Request, res: Response) => {
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

export default app;