"use client";

import { signup } from "@/app/actions/auth";
import { useState } from "react";
import Logo from "@/components/Logo";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await signup(formData);
    
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7f3] p-4 font-sans">
      <div className="w-full max-w-md rounded-sm border border-[#c7bd9b] bg-[#e0dac9] p-10 shadow-lg">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#3f403c]">
            StructuraUI
          </h1>
          <p className="mt-2 text-sm font-medium text-[#58554e]">
            Create your new workspace
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-sm bg-[#b8e0d4] p-4 text-sm font-bold text-[#3f403c] border border-[#809bce]">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#3f403c] mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-sm border border-[#c7bd9b] bg-[#ffffff] px-4 py-3 text-[#3f403c] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-1 focus:ring-[#58554e] transition-all"
              placeholder="you@agency.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#3f403c] mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-sm border border-[#c7bd9b] bg-[#ffffff] px-4 py-3 text-[#3f403c] placeholder-[#a0a5b8] focus:border-[#58554e] focus:outline-none focus:ring-1 focus:ring-[#58554e] transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-sm bg-[#3f403c] px-4 py-3.5 text-sm font-bold text-[#ffffff] hover:bg-[#58554e] focus:outline-none transition-colors shadow-sm"
            >
              Sign Up
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
