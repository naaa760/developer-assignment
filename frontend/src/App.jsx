import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import ContentIdeasPage from "./pages/ContentIdeasPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ContentBankPage from "./pages/ContentBankPage";
import DashboardPage from "./pages/DashboardPage";
import SignInPage from "./auth/SignInPage";
import SignUpPage from "./auth/SignUpPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "./components/Toaster";
import "./App.css";

// Get Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-600">
            Loading Creator Platform...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => (window.location.href = to)}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Public routes for authentication */}
            <Route
              path="/sign-in/*"
              element={
                <SignedOut>
                  <SignInPage />
                </SignedOut>
              }
            />
            <Route
              path="/sign-up/*"
              element={
                <SignedOut>
                  <SignUpPage />
                </SignedOut>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/content-ideas"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <ContentIdeasPage />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <AnalyticsPage />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content-bank"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Navigation />
                    <main className="container mx-auto px-4 py-8">
                      <ContentBankPage />
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Root route redirects */}
            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/sign-in" replace />
                  </SignedOut>
                </>
              }
            />

            {/* Catch all route */}
            <Route
              path="*"
              element={
                <>
                  <SignedIn>
                    <Navigate to="/dashboard" replace />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/sign-in" replace />
                  </SignedOut>
                </>
              }
            />
          </Routes>

          <Toaster />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
