// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: "http://localhost:5000/api",
  },
  production: {
    // Your actual Render backend URL
    API_BASE_URL:
      process.env.REACT_APP_API_URL ||
      "https://developer-assignment.onrender.com/api",
  },
};

const environment = process.env.NODE_ENV || "development";
const apiConfig = config[environment];

export const API_BASE_URL = apiConfig.API_BASE_URL;

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,

  // Content endpoints
  GENERATE_CONTENT: `${API_BASE_URL}/content/generate`,
  CONTENT_HISTORY: `${API_BASE_URL}/content/history`,

  // Analytics endpoints
  ANALYTICS: `${API_BASE_URL}/analytics`,
};

// Axios default configuration
export const axiosConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

console.log(`API Configuration loaded for ${environment}:`, {
  API_BASE_URL,
  environment,
});
