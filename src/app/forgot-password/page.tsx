"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordUser } from "@/_hooks/auth/auth.hook";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(
    useForgotPasswordUser,
    undefined
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-6 p-8 shadow-lg rounded-lg bg-white">
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/logo.png"
            alt="Ride Bali Explore Logo"
            className="h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-sm text-center">
            Enter your email to receive a password reset link
          </p>
        </div>
        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email..."
              className="w-full"
              required
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            {pending ? "Processing..." : "Send Reset Link"}
          </Button>
          {state?.message && (
            <p className="text-sm text-green-600 text-center">
              {state.message}
            </p>
          )}
          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-blue-500 hover:text-blue-600 underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
