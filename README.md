# Full Stack Items Management Application

## Live Demo
- Frontend: https://arkmind-aiman.vercel.app/

## Features
- Create, Read, Update, and Delete items
- Real-time form validation
- Responsive design
- Global state management with Redux Toolkit
- TypeScript implementation
- MySQL database integration

## Tech Stack
### Backend
- Node.js with Express
- TypeScript
- MySQL with Sequelize ORM
- Zod for validation
- Deployed on Vercel

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Axios for API integration
- React Hot Toast for notifications
- Tailwind CSS for styling

## API Endpoints

### GET /
Returns all items from the database.

Response:
```json
[
  {
    "id": 1,
    "name": "Item Name",
    "description": "Item Description",
    "price": 99.99,
    "createdAt": "2025-01-07T09:00:00.000Z",
    "updatedAt": "2025-01-07T09:00:00.000Z"
  }
]
```

### GET /:id
Returns a specific item by ID.

Response:
```json
{
  "id": 1,
  "name": "Item Name",
  "description": "Item Description",
  "price": 99.99,
  "createdAt": "2025-01-07T09:00:00.000Z",
  "updatedAt": "2025-01-07T09:00:00.000Z"
}
```

Error Response (404):
```json
{
  "message": "Item not found"
}
```

### POST /
Creates a new item.

Request Body:
```json
{
  "name": "New Item",
  "description": "Item Description",
  "price": 149.99
}
```

Response (201):
```json
{
  "id": 2,
  "name": "New Item",
  "description": "Item Description",
  "price": 149.99,
  "createdAt": "2025-01-08T09:15:00.000Z",
  "updatedAt": "2025-01-08T09:15:00.000Z"
}
```

Error Response (400):
```json
{
  "message": "Validation error",
  "errors": {
    "name": "Name is required",
    "price": "Price must be a positive number"
  }
}
```

### PUT /:id
Updates an existing item.

Request Body:
```json
{
  "name": "Updated Item",
  "description": "Updated Description",
  "price": 199.99
}
```

Response:
```json
{
  "id": 1,
  "name": "Updated Item",
  "description": "Updated Description",
  "price": 199.99,
  "createdAt": "2025-01-07T09:00:00.000Z",
  "updatedAt": "2025-01-08T10:30:00.000Z"
}
```

Error Response (404):
```json
{
  "message": "Item not found"
}
```

### DELETE /:id
Deletes an item.

Response (200):
```json
{
  "message": "Item deleted successfully"
}
```

Error Response (404):
```json
{
  "message": "Item not found"
}
```