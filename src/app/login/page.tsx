"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLoginUser } from "@/hooks";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    try {
      const response = await useLoginUser(values);
      if (response.status && response.status !== 200) {
        switch (true) {
          case !!response.errors?.email:
            form.setFocus("email");
            form.setError("email", { message: response.errors.email });
            break;

          case !!response.errors?.password:
            form.setFocus("password");
            form.setError("password", { message: response.errors.password });
            break;

          case !!response.errors?.message:
            toast.error(response.errors.message);
            break;
        }
        return;
      }
      if (response.message) {
        toast.success(response.message);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email..."
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        className="w-full pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>

            {/* Forget Password Link */}
            <div className="text-center">
              <Link
                href="/forget-password"
                className="text-sm text-blue-500 hover:text-blue-600 underline"
              >
                Forget Password?
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
        </Form>
      </div>
    </div>
  );
}
