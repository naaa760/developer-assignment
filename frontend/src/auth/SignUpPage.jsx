import React from "react";
import { SignUp } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

const SignUpPage = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Create Account
        </h2>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              card: "shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
          afterSignUpUrl="/dashboard"
          signInUrl="/sign-in"
        />
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
