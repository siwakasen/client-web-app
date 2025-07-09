"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronDownIcon } from "lucide-react";
import { Customer } from "@/_interfaces/customer.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  BookingWithRegisterRequest,
  BookingRequest,
} from "@/_interfaces/booking.interface";
interface CheckoutFormProps {
  packageId: number;
  customer?: Customer;
}

export function CheckoutForm({ packageId, customer }: CheckoutFormProps) {
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingData, setBookingData] = useState<BookingRequest>({
    package_id: packageId,
    payment_method: "PAYPAL",
    pickup_location: "",
    pickup_time: "",
    number_of_persons: 1,
  });
  const [open, setOpen] = useState(false);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookingData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!bookingData.number_of_persons || bookingData.number_of_persons < 1) {
      newErrors.number_of_persons = "Number of persons is required (minimum 1)";
    }
    if (!bookingData.pickup_location.trim()) {
      newErrors.pickup_location = "Pickup location is required";
    }
    if (!bookingData.pickup_time) {
      newErrors.pickup_time = "Pickup time is required";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const scrollToFirstError = (validationErrors: Record<string, string>) => {
    const errorFields = Object.keys(validationErrors);
    if (errorFields.length > 0) {
      // Scroll to top of the form when there are validation errors
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    const validation = validateForm();
    if (!validation.isValid) {
      scrollToFirstError(validation.errors);
      return;
    }

    console.log("Booking Data:", bookingData);
    console.log("Notes:", notes);

    if (bookingData.payment_method === "MIDTRANS") {
      console.log("Redirecting to Midtrans...");
      // Add actual Midtrans integration here
    } else {
      console.log("Redirecting to PayPal...");
      // Add actual PayPal integration here
    }
  };

  return (
    <div className="bg-white p-6 lg:p-8 space-y-6">
      {/* Account Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">Customer Details</h2>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-md text-gray-700 font-bold">{customer!.name}</div>
        <div className="text-sm text-gray-600">{customer!.email}</div>
      </div>

      {/* Trip Details */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium mb-4">Trip Details</h2>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Start Date
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker"
                    className="w-32 justify-between font-normal"
                  >
                    {bookingData.start_date
                      ? bookingData.start_date.toLocaleDateString()
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
                    selected={bookingData.start_date}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setBookingData({
                        ...bookingData,
                        start_date: date,
                      });
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="time-picker" className="px-1">
                Time
              </Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                defaultValue="10:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pickup-location">
              Pickup Location
              <span className="text-red-500 text-xl font-bold">*</span>
            </Label>
            <Input
              id="pickup-location"
              type="text"
              value={bookingData.pickup_location}
              onChange={(e) => {
                setBookingData({
                  ...bookingData,
                  pickup_location: e.target.value,
                });
                if (errors.pickup_location) {
                  setErrors((prev) => ({ ...prev, pickup_location: "" }));
                }
              }}
              className={`mt-1 ${
                errors.pickup_location
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
              placeholder="Enter pickup location"
            />
            {errors.pickup_location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pickup_location}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="persons">
              Number of Persons
              <span className="text-red-500 text-xl font-bold">*</span>
            </Label>
            <Input
              id="persons"
              type="number"
              min="1"
              value={bookingData.number_of_persons}
              onChange={(e) => {
                setBookingData({
                  ...bookingData,
                  number_of_persons: Number.parseInt(e.target.value) || 1,
                });
                if (errors.number_of_persons) {
                  setErrors((prev) => ({ ...prev, number_of_persons: "" }));
                }
              }}
              className={`mt-1 w-32 ${
                errors.number_of_persons
                  ? "border-red-500 focus:border-red-500"
                  : ""
              }`}
            />
            {errors.number_of_persons && (
              <p className="text-red-500 text-sm mt-1">
                {errors.number_of_persons}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any special requests or notes for your trip..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="resize-none mt-1"
        />
      </div>

      {/* Payment Section */}
      <div>
        <h2 className="text-lg font-bold mb-2">Payment</h2>
        <p className="text-sm text-gray-600 mb-4">
          All transactions are secured and encrypted.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-700">
            <span className="font-medium">Attention:</span> The final price will
            be displayed on the payment page with applicable promotions if
            available.
          </p>
        </div>

        <RadioGroup
          value={bookingData.payment_method}
          onValueChange={(value) =>
            setBookingData({
              ...bookingData,
              payment_method: value as "MIDTRANS" | "PAYPAL",
            })
          }
          className="space-y-4"
        >
          {/* PayPal Option */}
          <div
            className={`border rounded-lg ${
              bookingData.payment_method === "PAYPAL"
                ? "border-blue-500"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 p-4 border-b">
              <RadioGroupItem value="PAYPAL" id="paypal-payment" />
              <Label htmlFor="paypal-payment" className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">PayPal</span>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                    PayPal
                  </div>
                </div>
              </Label>
            </div>

            {bookingData.payment_method === "PAYPAL" && (
              <div className="p-4 bg-gray-50">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-16 bg-white border rounded flex items-center justify-center">
                    <div className="text-blue-600 font-bold text-lg">
                      PayPal
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 text-center">
                  After clicking "Pay now", you will be directed to PayPal to
                  complete the payment process securely.
                </p>
              </div>
            )}
          </div>

          {/* Midtrans Option */}
          <div
            className={`border rounded-lg ${
              bookingData.payment_method === "MIDTRANS"
                ? "border-blue-500"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 p-4 border-b">
              <RadioGroupItem value="MIDTRANS" id="midtrans-payment" />
              <Label
                htmlFor="midtrans-payment"
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">
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
                    <span className="text-blue-600 font-bold text-sm">+21</span>
                  </div>
                </div>
              </Label>
            </div>

            {bookingData.payment_method === "MIDTRANS" && (
              <div className="p-4 bg-gray-50">
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
                        <div className="text-xs text-gray-600">→</div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 text-center">
                  After clicking "Pay now", you will be directed to Payments via
                  Midtrans to complete the payment process securely.
                </p>
              </div>
            )}
          </div>
        </RadioGroup>
      </div>

      {/* Pay Now Button */}
      <Button
        onClick={handleSubmit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-8"
        size="lg"
      >
        Pay now
      </Button>
    </div>
  );
}
