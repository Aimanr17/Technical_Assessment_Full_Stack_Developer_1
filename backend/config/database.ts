import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log environment variables (excluding sensitive data)
console.log('Database Configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  // Don't log password
});

const sequelize = new Sequelize({
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
    console.error('❌ Unable to connect to the database:', {
      message: err.message,
      code: err.original?.code,
      errno: err.original?.errno,
      sqlState: err.original?.sqlState,
      sqlMessage: err.original?.sqlMessage
    });
    // Don't exit the process, let the application handle the error
  });

export default sequelize;