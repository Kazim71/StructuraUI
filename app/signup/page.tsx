"use client";

import { signup } from "@/app/actions/auth";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

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
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3] dark:bg-[#26251f] p-4 font-sans text-[#3f403c] dark:text-[#e8e6df]">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md rounded-xl border border-[#c7bd9b] dark:border-[#4a4940] bg-[#e0dac9] dark:bg-[#322f28] p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-auto items-center justify-center">
            <Logo className="h-8 text-[#3f403c] dark:text-[#e8e6df]" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#3f403c] dark:text-[#e8e6df]">
            Create Your Workspace
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-[#b8e0d4] dark:bg-[#2d4a40] p-4 text-sm font-bold text-[#3f403c] dark:text-[#e8e6df] border border-[#809bce]">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f8f7f3] dark:bg-[#26251f] px-4 py-3 text-[#3f403c] dark:text-[#e8e6df] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Full Name"
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f8f7f3] dark:bg-[#26251f] px-4 py-3 text-[#3f403c] dark:text-[#e8e6df] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Email Address"
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f8f7f3] dark:bg-[#26251f] px-4 py-3 text-[#3f403c] dark:text-[#e8e6df] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Password"
            />
          </div>

          <div>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full rounded-lg border border-[#c7bd9b] dark:border-[#4a4940] bg-[#f8f7f3] dark:bg-[#26251f] px-4 py-3 text-[#3f403c] dark:text-[#e8e6df] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-2 focus:ring-[#58554e]/30 transition-all"
              placeholder="Confirm Password"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[#3f403c] dark:bg-[#e8e6df] px-4 py-3.5 text-sm font-bold text-[#ffffff] dark:text-[#26251f] hover:bg-[#58554e] dark:hover:bg-[#c7bd9b] focus:outline-none focus:ring-4 focus:ring-[#c7bd9b] transition-colors shadow-lg disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-bold text-[#58554e] dark:text-[#b8b4a8]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#809bce] hover:text-[#3f403c] dark:hover:text-[#e8e6df] hover:underline focus:outline-none transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}