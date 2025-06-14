import React from "react";
import { SignUp } from "@clerk/clerk-react";
import AuthLayout from "./AuthLayout";

const SignUpPage = () => {
  return (
    <AuthLayout>
      <div>
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        <SignUp afterSignUpUrl="/dashboard" signInUrl="/sign-in" />
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;
