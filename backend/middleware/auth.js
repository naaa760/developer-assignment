const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");

// Middleware to require authentication
const requireAuth = ClerkExpressRequireAuth({
  // Optional: customize error handling
  onError: (error) => {
    console.error("Authentication error:", error);
    return {
      status: 401,
      message: "Authentication required",
    };
  },
});

// Optional middleware to get user info without requiring auth
const getUser = (req, res, next) => {
  // User info will be available in req.auth if authenticated
  next();
};

module.exports = {
  requireAuth,
  getUser,
};
