import React from "react";
import { SignIn } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

const SignInPage = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Welcome Back
        </h2>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
          afterSignInUrl="/dashboard"
          redirectUrl="/dashboard"
          routing="path"
          path="/sign-in"
        />
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
