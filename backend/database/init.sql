-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS items_db;

-- Use the database
USE items_db;

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add some sample data
INSERT INTO items (name, description, price) VALUES
    ('Laptop', 'High-performance laptop with 16GB RAM', 1299.99),
    ('Smartphone', 'Latest model with 5G capability', 899.99),
    ('Headphones', 'Noise-cancelling wireless headphones', 199.99);
