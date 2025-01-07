# Full Stack Items Management Application

## Live Demo
- Frontend: [Netlify Deployment URL]
- Backend: https://technical-assessment-full-stack-developer-1.vercel.app/api

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
- Deployed on Netlify

## API Endpoints

### GET /api/items
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