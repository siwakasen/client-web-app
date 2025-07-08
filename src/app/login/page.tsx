"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLoginUser } from "@/_hooks/auth/auth.hook";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, action, pending] = useActionState(useLoginUser, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      router.push("/");
    }
  }, [state?.message]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-6 p-8 shadow-lg rounded-lg bg-white">
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/logo.png"
            alt="Ride Bali Explore Logo"
            className="h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-500 text-sm">Login to Ride Bali Explore</p>
        </div>
        <form action={action} className="space-y-4">
          {/* Email Field */}
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
          {/* Password Field */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password..."
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {state?.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
            )}
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            {pending ? "Memproses..." : "Masuk"}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-600 underline"
            >
              Forgot Password?
            </Link>
          </div>
          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Register Now!
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
