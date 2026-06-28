"use client";

import { signup } from "@/app/actions/auth";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    
    // Quick validation check
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const result = await signup(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3] p-4 font-sans text-[#3f403c]">
      <div className="w-full max-w-md rounded-xl border border-[#c7bd9b] bg-[#e0dac9] p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-auto items-center justify-center">
            <Logo className="h-8 text-[#3f403c]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#3f403c]">
            Create Your Workspace
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-[#b8e0d4] p-4 text-sm font-bold text-[#3f403c] border border-[#809bce]">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-[#c7bd9b] bg-[#f8f7f3] px-4 py-3 text-[#3f403c] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Full Name"
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-[#c7bd9b] bg-[#f8f7f3] px-4 py-3 text-[#3f403c] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Email Address"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-[#c7bd9b] bg-[#f8f7f3] px-4 py-3 text-[#3f403c] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Password"
            />
          </div>

          <div>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full rounded-lg border border-[#c7bd9b] bg-[#f8f7f3] px-4 py-3 text-[#3f403c] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Confirm Password"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#3f403c] px-4 py-3.5 text-sm font-bold text-[#ffffff] hover:bg-[#58554e] focus:outline-none focus:ring-4 focus:ring-[#c7bd9b] transition-colors shadow-lg disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-bold text-[#58554e]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#809bce] hover:text-[#3f403c] hover:underline focus:outline-none transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}