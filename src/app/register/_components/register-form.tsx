"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { registerUser } from "@/_hooks/auth/auth.hook"

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerUser, undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Join Us</h1>
      </div>

      <form action={action} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Your Full Name<span className="text-red-500">*</span>
          </Label>
          <Input id="name" name="name" type="text" placeholder="Enter Your Full Name" className="w-full" required />
          {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            E-mail<span className="text-red-500">*</span>
          </Label>
          <Input id="email" name="email" type="email" placeholder="Enter Email" className="w-full" required />
          {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {state?.errors?.password && (
            <div className="space-y-1">
              {state.errors.password.map((error, index) => (
                <p key={index} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password<span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
            Phone number
          </Label>
          <Input id="phone_number" name="phone_number" type="tel" placeholder="Enter Phone Number" className="w-full" />
          {state?.errors?.phone_number && <p className="text-sm text-red-500">{state.errors.phone_number[0]}</p>}
        </div>

        {/* Country Origin Field */}
        <div className="space-y-2">
          <Label htmlFor="country_origin" className="text-sm font-medium text-gray-700">
            Country Origin
          </Label>
          <Input 
            id="country_origin" 
            name="country_origin" 
            type="text" 
            placeholder="Enter your country" 
            className="w-full" 
          />
          {state?.errors?.country_origin && <p className="text-sm text-red-500">{state.errors.country_origin[0]}</p>}
        </div>

        

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
        >
          {pending ? "Creating Account..." : "Register"}
        </Button>

        {/* Success/Error Messages */}
        {state?.message && <p className="text-sm text-green-600 text-center">{state.message}</p>}

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already Have an Account?{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-600 underline">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
