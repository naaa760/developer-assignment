import axios from "axios";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get Clerk session token
const getClerkToken = async () => {
  try {
    // Get the Clerk session token from window.Clerk if available
    if (typeof window !== "undefined" && window.Clerk) {
      const session = await window.Clerk.session;
      if (session) {
        return await session.getToken();
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting Clerk token:", error);
    return null;
  }
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add Clerk auth token
    try {
      const token = await getClerkToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error adding auth token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "An error occurred";
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// Content API endpoints
export const contentAPI = {
  // Generate content using AI
  generateContent: async (data) => {
    return api.post("/content/generate", data);
  },

  // Get content bank
  getContentBank: async (params = {}) => {
    return api.get("/content/bank", { params });
  },

  // Get single content item
  getContent: async (id) => {
    return api.get(`/content/${id}`);
  },

  // Delete content item
  deleteContent: async (id) => {
    return api.delete(`/content/${id}`);
  },

  // Get available niches
  getNiches: async () => {
    return api.get("/content/meta/niches");
  },
};

// Analytics API endpoints
export const analyticsAPI = {
  // Get analytics data
  getAnalytics: async (params = {}) => {
    return api.get("/analytics", { params });
  },

  // Upload analytics data
  uploadAnalytics: async (data) => {
    return api.post("/analytics/upload", data);
  },

  // Generate sample analytics data
  generateSampleData: async (data) => {
    return api.post("/analytics/generate-sample", data);
  },

  // Export analytics report
  exportAnalytics: async (params = {}) => {
    const response = await api.get("/analytics/export", {
      params,
      responseType: "blob",
    });
    return response;
  },

  // Delete analytics data
  deleteAnalytics: async (params = {}) => {
    return api.delete("/analytics", { params });
  },
};

// Health check
export const healthCheck = async () => {
  return api.get("/health");
};

export default api;
