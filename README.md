# Creator Platform - ChatGPT Integration & Instagram Analytics

A MERN stack application that provides AI-powered content generation and Instagram analytics simulation.

## Features

### Module 1: Content Idea Assistant (AI-Driven)

- Topic and niche-based content generation
- GROQ API integration for AI-powered suggestions
- Generates reel ideas, captions, hashtags, and hooks
- Content history storage in MongoDB

### Module 2: Instagram Analytics Simulation

- Follower growth visualization (7-day chart)
- Engagement rate analysis (likes + comments)
- Best posting time recommendations
- Interactive charts using Chart.js

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **AI Integration**: GROQ API
- **Authentication**: JWT

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment variables are already configured in `.env`:

   - `GROQ_API_KEY`: For AI content generation
   - `MONGODB_URI`: MongoDB Atlas connection
   - `JWT_SECRET`: For authentication tokens

4. Start the backend server:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend application:
   ```bash
   npm start
   ```
   Application will run on http://localhost:3000

## Usage

1. **Register/Login**: Create an account or login to access the platform
2. **Generate Content**: Use the Content Generator to create AI-powered Instagram content ideas
3. **View Analytics**: Check the Analytics dashboard for simulated Instagram metrics
4. **Dashboard**: Overview of recent content and quick stats

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Content Generation

- `POST /api/content/generate` - Generate AI content
- `GET /api/content/history` - Get user's content history

### Analytics

- `GET /api/analytics` - Get analytics data
- `POST /api/analytics/update` - Update analytics data

## Project Structure

```
creator-platform/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── .env            # Environment variables
│   └── server.js       # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── pages/       # Page components
│   │   └── App.js      # Main app component
│   └── package.json
└── README.md
```
