import React from "react";
import { SignIn } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

const SignInPage = () => {
  return (
    <AuthLayout>
      <div>
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <SignIn afterSignInUrl="/dashboard" signUpUrl="/sign-up" />
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
