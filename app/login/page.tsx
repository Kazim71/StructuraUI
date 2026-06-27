"use client";

import { login, signup } from "@/app/actions/auth";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false); // Our new UI toggle

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    // Dynamically choose between the signup or login Server Action
    const action = isSignUp ? signup : login; 
    const result = await action(formData);
    
    // If we get here, it means it didn't redirect, so there was an error
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            StructuraUI
          </h1>
          {/* Dynamic Header Text */}
          <p className="mt-2 text-sm text-gray-400">
            {isSignUp ? "Create your new workspace" : "Sign in to your account"}
          </p>
        </div>

        {/* Error Message Box */}
        {error && (
          <div className="mb-4 rounded-md bg-red-900/50 p-3 text-sm text-red-200 border border-red-800">
            {error}
          </div>
        )}

        {/* The Unified Form */}
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2">
            {/* Dynamic Submit Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>

        {/* The UX Toggle Link */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null); // Clear errors when flipping the card
            }}
            className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline focus:outline-none transition-colors"
          >
            {isSignUp ? "Sign In Here" : "Create One Here"}
          </button>
        </div>
      </div>
    </div>
  );
}