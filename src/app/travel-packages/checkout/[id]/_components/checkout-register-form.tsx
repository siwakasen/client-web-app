"use client";
import { TravelPackages } from "@/interfaces/travel-packages.interface";
import { combineDateAndTime, convertISOToCurrentTimezone } from "@/lib/utils";
import { BookingRegisterFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronDownIcon,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OrderSummary } from "./order-summary";
import { PhoneInput } from "@/components/shared/phone-input/phone-input";
import {
  CountryDropdown,
  Country,
} from "@/components/shared/country-input/country-dropdown";
import { toast } from "sonner";
import { useCreateBookingWithRegister } from "@/hooks";

interface CheckoutRegisterFormProps {
  travelPackage: TravelPackages;
}

export function CheckoutRegisterForm({
  travelPackage,
}: CheckoutRegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof BookingRegisterFormSchema>>({
    resolver: zodResolver(BookingRegisterFormSchema),
    defaultValues: {
      package_id: travelPackage.id,
      with_driver: false,
      number_of_persons: 1,
      start_date: "",
      end_date: new Date().toISOString(),
      payment_method: "PAYPAL",
      pickup_location: "",
      pickup_time: "",
      additional_notes: "",
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      country_origin: "",
    },
    mode: "onChange",
  });

  const [openDate, setOpenDate] = useState(false);

  const startDate = form.watch("start_date");
  const pickupTime = form.watch("pickup_time");

  useEffect(() => {
    if (startDate) {
      const combined = combineDateAndTime(startDate, pickupTime);
      if (combined !== startDate) {
        form.setValue("start_date", combined);
      }
      form.setValue("end_date", combined);
    }
  }, [startDate, pickupTime, form]);

  async function onSubmit(values: z.infer<typeof BookingRegisterFormSchema>) {
    try {
      const convertedDate = convertISOToCurrentTimezone(values.start_date);
      const formData = {
        ...values,
        start_date: convertedDate,
        end_date: convertedDate,
      };
      const response = await useCreateBookingWithRegister(formData);
      if ("errors" in response) {
        switch (true) {
          case !!response.errors?.message:
            console.log("Booking error:", response);
            toast.error(response.errors.message);
            break;
        }
        return;
      }

      window.location.href = response.data.redirect_url;
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          {/* Left Column - Client Component (Form) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 md:p-8 space-y-6">
              {/* Customer Details Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Customer Details</h2>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
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

                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
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

                  {/* Phone Number Field */}
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <PhoneInput
                            placeholder="Enter Phone Number"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Country Origin Field */}
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
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium mb-4">Trip Details</h2>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {/* Start Date */}
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-3">
                          <FormLabel htmlFor="date-picker">
                            Start Date
                          </FormLabel>
                          <Popover open={openDate} onOpenChange={setOpenDate}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date-picker"
                                className="w-32 justify-between font-normal"
                                type="button"
                              >
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                captionLayout="dropdown"
                                disabled={(date) => {
                                  const today = new Date();
                                  today.setHours(0, 0, 0, 0);
                                  return date <= today;
                                }}
                                onSelect={(date) => {
                                  field.onChange(
                                    date ? date.toISOString() : ""
                                  );
                                  setOpenDate(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Pickup Time */}
                    <FormField
                      control={form.control}
                      name="pickup_time"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-3">
                          <FormLabel htmlFor="time-picker" className="px-1">
                            Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              id="time-picker"
                              step="1"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Number of Persons */}
                  <FormField
                    control={form.control}
                    name="number_of_persons"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="persons">
                          Number of Persons
                          <span className="text-red-500 text-xl font-bold">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="persons"
                            type="number"
                            min={1}
                            max={travelPackage.max_persons}
                            {...field}
                            value={field.value || 1}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value) || 1)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Pickup Location */}
                  <FormField
                    control={form.control}
                    name="pickup_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="pickup-location">
                          Pickup Location
                          <span className="text-red-500 text-xl font-bold">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id="pickup-location"
                            placeholder="Kuta Beach Hotel"
                            rows={3}
                            className="resize-none mt-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="additional_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="notes">Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        id="notes"
                        placeholder="Add any special requests or notes for your trip..."
                        rows={3}
                        className="resize-none mt-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Section */}
              <div>
                <h2 className="text-lg font-bold mb-2">Payment</h2>
                <p className="text-sm text-gray-600 mb-4">
                  All transactions are secured and encrypted.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Attention:</span> The final
                    price will be displayed on the payment page and may vary
                    based on currency conversion and applicable taxes.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-4"
                      >
                        {/* PayPal Option */}
                        <div
                          className={`border rounded-lg ${
                            field.value === "PAYPAL"
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3 p-4 ">
                            <RadioGroupItem
                              value="PAYPAL"
                              id="paypal-payment"
                            />
                            <label
                              htmlFor="paypal-payment"
                              className="cursor-pointer w-full"
                            >
                              <div className="flex items-center gap-3 justify-between ">
                                <span className="font-medium text-lg">
                                  PayPal
                                </span>
                                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                                  PayPal
                                </div>
                              </div>
                            </label>
                          </div>
                          {field.value === "PAYPAL" && (
                            <div className="p-4 bg-gray-50  rounded-lg">
                              <div className="flex justify-center mb-4">
                                <div className="w-24 h-16 bg-white border rounded flex items-center justify-center">
                                  <div className="text-blue-600 font-bold text-lg">
                                    PayPal
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 text-center">
                                After clicking "Pay now", you will be directed
                                to PayPal to complete the payment process
                                securely.
                              </p>
                            </div>
                          )}
                        </div>
                        {/* Midtrans Option */}
                        <div
                          className={`border rounded-lg ${
                            field.value === "MIDTRANS"
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3 p-4 ">
                            <RadioGroupItem
                              value="MIDTRANS"
                              id="midtrans-payment"
                            />
                            <label
                              htmlFor="midtrans-payment"
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">
                                  Payments via Midtrans
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                                    BCA
                                  </div>
                                  <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                                    gopay
                                  </div>
                                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                    ●●
                                  </div>
                                  <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                                    BNI
                                  </div>
                                  <span className="text-blue-600 font-bold text-sm">
                                    +21
                                  </span>
                                </div>
                              </div>
                            </label>
                          </div>
                          {field.value === "MIDTRANS" && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-center mb-4">
                                <div className="w-32 h-20 bg-white border rounded flex items-center justify-center relative">
                                  <div className="absolute top-2 left-2 flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  </div>
                                  <div className="mt-2">
                                    <div className="w-16 h-1 bg-gray-300 mb-2"></div>
                                    <div className="w-12 h-1 bg-gray-300 mb-2"></div>
                                    <div className="w-14 h-1 bg-gray-300"></div>
                                  </div>
                                  <div className="absolute bottom-2 right-2">
                                    <div className="w-6 h-4 border border-gray-400 rounded flex items-center justify-center">
                                      <div className="text-xs text-gray-600">
                                        →
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 text-center">
                                After clicking "Pay now", you will be directed
                                to Payments via Midtrans to complete the payment
                                process securely.
                              </p>
                            </div>
                          )}
                        </div>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Server Component (Order Summary) */}
          <div className=" md:col-span-1 bg-gray-50 p-6 md:p-8 border-l ">
            <div className="md:sticky md:top-24 h-fit">
              <OrderSummary
                packageData={travelPackage}
                numberOfPersons={form.watch("number_of_persons") || 1}
              />
              {/* Pay Now Button */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-8"
                size="lg"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Pay now"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
