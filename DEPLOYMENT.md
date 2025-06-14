# Deployment Guide for Creator Platform

## Backend Deployment on Render

### 1. Create a new Web Service on Render

- Connect your GitHub repository
- Select the `backend` folder as the root directory
- Use the following settings:

**Build Command:**

```bash
npm install
```

**Start Command:**

```bash
npm start
```

### 2. Environment Variables on Render

Add these environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

### 3. Update CORS Configuration

In `backend/server.js`, replace the placeholder URLs in the CORS configuration with your actual frontend URL:

```javascript
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://your-actual-frontend-domain.netlify.app", // Replace this
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  // ... rest of config
};
```

## Frontend Deployment

### Option 1: Netlify

1. Connect your GitHub repository
2. Set build directory to `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   ```

### Option 2: Vercel

1. Connect your GitHub repository
2. Set root directory to `frontend`
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com/api
   ```

## Important Notes

1. **Replace placeholder URLs**: Update all placeholder URLs with your actual deployment URLs
2. **Environment Variables**: Make sure all environment variables are set correctly
3. **CORS**: Ensure your frontend URL is added to the CORS configuration
4. **Database**: Make sure your MongoDB connection string is correct
5. **API Keys**: Ensure all API keys (JWT_SECRET, GROQ_API_KEY) are set

## Testing Deployment

1. Check backend health: `https://your-backend-app.onrender.com/health`
2. Test API endpoints: `https://your-backend-app.onrender.com/api/auth/profile`
3. Check frontend console for any CORS or API connection errors

## Troubleshooting

- **CORS Errors**: Make sure your frontend URL is in the CORS configuration
- **API Connection Failed**: Verify the REACT_APP_API_URL environment variable
- **Database Connection**: Check your MONGODB_URI
- **Authentication Issues**: Verify JWT_SECRET is set correctly
