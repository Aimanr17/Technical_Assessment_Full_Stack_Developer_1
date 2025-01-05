# Backend API for Item Management

This is a RESTful API built with Express.js and TypeScript for managing items.

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a MySQL database named 'items_db'

3. Configure environment variables:
   - Copy `.env.dev` and modify the values according to your MySQL configuration:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=items_db
     ```

4. Initialize the database:
   ```bash
   npm run init-db
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Items

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get a specific item by ID
- `POST /api/items` - Create a new item
  ```json
  {
    "name": "Item name",
    "description": "Item description",
    "price": 99.99
  }
  ```
- `PUT /api/items/:id` - Update an existing item
  ```json
  {
    "name": "Updated name",
    "description": "Updated description",
    "price": 149.99
  }
  ```
- `DELETE /api/items/:id` - Delete an item

## Data Validation

- Name: Required, max 100 characters
- Description: Optional, max 500 characters
- Price: Required, must be positive number

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error
