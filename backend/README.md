# Backend API for Item Management

This is a RESTful API built with Express.js and TypeScript for managing items. The API is deployed on Vercel and uses Railway MySQL for the database.

## Live Demo
- API Base URL: https://arkmind-aiman.vercel.app/api
- Frontend: https://arkmind-aiman.vercel.app

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `env-template.txt` to `.env` and update the values:
     ```
     PORT=3001
     DB_HOST=roundhouse.proxy.rlwy.net
     DB_PORT=51179
     DB_USER=root
     DB_PASSWORD=your_password_here
     DB_NAME=railway
     NODE_ENV=development
     ```

3. Start the development server:
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

## Deployment

This API is deployed on Vercel. The deployment configuration is in `vercel.json`. To deploy your own instance:

1. Fork this repository
2. Create a Vercel account and link it to your GitHub
3. Import the repository to Vercel
4. Set up the environment variables in Vercel's dashboard
5. Deploy!
