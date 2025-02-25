# Hue Video Module

This project implements the Hue Video Module, an embedded module on a shopping website's product detail page that helps shoppers understand how the product would look on people similar to them. The module contains video reviews posted by creators, review text written by the creators, and characteristics of the creators to help shoppers find reviews that reflect their own appearance.


## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB](https://www.mongodb.com/) (if running without Docker)

## Getting Started

### Option 1: Using Docker (Recommended)

1. Clone the repository:
   ```
   git clone https://github.com/mightstar/hue-backend.git
   cd hue-backend
   ```

2. Start the application with Docker Compose:
   ```
   docker-compose up
   ```

   This will start:
   - MongoDB on port 27017
   - Backend API on port 5000

3. Access the application:
   - Backend API: http://localhost:5000

### Option 2: Manual Setup

1. Navigate to the backend directory:
   ```
   cd hue-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following environment variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/hue-video-module
   PORT=5000
   ```

4. Start MongoDB:
   ```
   # Install MongoDB if you haven't already
   # Start MongoDB service
   ```

5. Start the backend:
   ```
   npm run dev
   ```

## API Endpoints

### Backend API

- `GET /api/reviews` - Returns all review data
- `POST /api/click-events` - Records click events on review cards
- `GET /api/click-events` - Fetches all recorded click events (for testing purposes)

## Testing

### Backend Tests

To run the backend tests:

```
npm test
```

Tests cover:
- API endpoint functionality
- Error handling
- Data validation

## Tech Stack

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose

- **DevOps**:
  - Docker
  - Docker Compose

## Project Structure Details

### Backend

```
backend/
├── Dockerfile         # Docker configuration for the backend
├── .env               # Environment variables
├── package.json       # Project dependencies and scripts
├── server.js          # Express server with API routes
├── reviewData.js      # Sample review data
└── server.test.js     # Backend API tests
```