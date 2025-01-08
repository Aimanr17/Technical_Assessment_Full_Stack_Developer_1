import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";

const dbName = "arkmind_items_db";
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
};

// Create database if it doesn't exist
async function initialize() {
  const connection = await mysql.createConnection(dbConfig);
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
  await connection.end();
}

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: dbName,
  dialectModule: require("mysql2"),
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  dialectOptions: {
    connectTimeout: 60000,
  },
  retry: {
    max: 3,
  },
});

// Initialize database, sync models and test connection
initialize()
  .then(() => sequelize.authenticate())
  .then(() => {
    console.log("Database connection has been established successfully.");
    return sequelize.sync({ alter: true }); // This will create/update tables
  })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default sequelize;