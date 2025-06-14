# Deployment Guide for Creator Platform

## Backend Deployment on Render ✅ COMPLETED

Your backend is deployed at: **https://developer-assignment.onrender.com/**

### Environment Variables on Render

Make sure these environment variables are set in your Render dashboard:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

## Frontend Deployment

### For Netlify/Vercel:

Add this environment variable:

```
REACT_APP_API_URL=https://developer-assignment.onrender.com/api
```

## Testing Your Deployment

1. **Backend Health Check**: https://developer-assignment.onrender.com/health
2. **Test API**: https://developer-assignment.onrender.com/api/auth/profile
3. **Check browser console** for any CORS or connection errors

## Quick Fix for CORS Issues

If you get CORS errors, add your frontend URL to the `FRONTEND_URL` environment variable in Render.

## What Was Fixed

✅ **API Configuration**: Frontend now uses environment-based URLs  
✅ **CORS Setup**: Backend configured for production  
✅ **Health Check**: Added `/health` endpoint for monitoring  
✅ **Environment Variables**: Proper production configuration
