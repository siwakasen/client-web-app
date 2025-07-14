"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRegisterUser } from "@/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema } from "@/lib/validation";
import { z } from "zod";
import { PhoneInput } from "@/components/shared/phone-input/phone-input";
import {
  CountryDropdown,
  Country,
} from "@/components/shared/country-input/country-dropdown";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      country_origin: "",
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await useRegisterUser(values);

      // Check if the response has errors (API errors)
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

      // Success case
      if (response.message) {
        toast.success(response.message);
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Join Us</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter Your Full Name"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    placeholder="Enter Email"
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

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
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

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    id="phone_number"
                    placeholder="Enter Phone Number"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country_origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country Origin</FormLabel>
                <FormControl>
                  <CountryDropdown
                    placeholder="Select your country"
                    onChange={(country: Country) => {
                      field.onChange(country.alpha3);
                    }}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 /> : "Register"}
          </Button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already Have an Account?{" "}
              <a
                href="/login"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Login
              </a>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
