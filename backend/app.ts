import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import itemRoute from "./routes/item.route";
import sequelize from './config/database';

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

// Database test endpoint
app.get('/db-test', async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    const [results] = await sequelize.query('SELECT 1+1 as result');
    res.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      results 
    });
  } catch (error: any) {
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
app.use('/items', itemRoute);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!', message: err.message });
});

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;