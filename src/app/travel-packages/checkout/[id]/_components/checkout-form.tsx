"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

interface BookingData {
  package_id: number;
  number_of_persons: number;
  start_date: string;
  end_date: string;
  payment_method: "MIDTRANS" | "PAYPAL";
  pickup_location: string;
  pickup_time: string;
  email: string;
  password: string;
  name: string;
  phone_number: string;
  country_origin: string;
}

interface CheckoutFormProps {
  packageId: number;
}

export function CheckoutForm({ packageId }: CheckoutFormProps) {
  const [bookingData, setBookingData] = useState<BookingData>({
    package_id: packageId,
    number_of_persons: 1,
    start_date: "",
    end_date: "",
    payment_method: "PAYPAL",
    pickup_location: "",
    pickup_time: "",
    email: "logobreaker@gmail.com",
    password: "Password12!@",
    name: "Logobreaker",
    phone_number: "08123456789",
    country_origin: "Indonesia",
  });

  const [notes, setNotes] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bookingData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!bookingData.end_date) {
      newErrors.end_date = "End date is required";
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

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Not selected";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 lg:p-8 space-y-6">
      {/* Account Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">Account</h2>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-sm text-gray-600">maderika20@gmail.com</div>
      </div>

      {/* Trip Details */}
      <div>
        <h2 className="text-lg font-medium mb-4">Trip Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={bookingData.start_date}
                onChange={(e) => {
                  setBookingData({
                    ...bookingData,
                    start_date: e.target.value,
                  });
                  if (errors.start_date) {
                    setErrors((prev) => ({ ...prev, start_date: "" }));
                  }
                }}
                className={`mt-1 ${
                  errors.start_date ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>
            <div>
              <Label htmlFor="end-date">End Date *</Label>
              <Input
                id="end-date"
                type="date"
                value={bookingData.end_date}
                onChange={(e) => {
                  setBookingData({
                    ...bookingData,
                    end_date: e.target.value,
                  });
                  if (errors.end_date) {
                    setErrors((prev) => ({ ...prev, end_date: "" }));
                  }
                }}
                className={`mt-1 ${
                  errors.end_date ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="persons">Number of Persons *</Label>
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

          <div>
            <Label htmlFor="pickup-location">Pickup Location *</Label>
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
            <Label htmlFor="pickup-time">Pickup Time *</Label>
            <Input
              id="pickup-time"
              type="time"
              value={bookingData.pickup_time}
              onChange={(e) => {
                setBookingData({
                  ...bookingData,
                  pickup_time: e.target.value,
                });
                if (errors.pickup_time) {
                  setErrors((prev) => ({ ...prev, pickup_time: "" }));
                }
              }}
              className={`mt-1 w-32 ${
                errors.pickup_time ? "border-red-500 focus:border-red-500" : ""
              }`}
            />
            {errors.pickup_time && (
              <p className="text-red-500 text-sm mt-1">{errors.pickup_time}</p>
            )}
          </div>
        </div>
      </div>

      {/* Date Summary Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Trip Duration:</span>{" "}
          {formatDateForDisplay(bookingData.start_date)} –{" "}
          {formatDateForDisplay(bookingData.end_date)}
        </p>
      </div>

      {/* Email Updates */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="email-updates"
          checked={emailUpdates}
          onCheckedChange={(checked) => setEmailUpdates(checked === true)}
        />
        <Label htmlFor="email-updates" className="text-sm">
          Send me emails with news and offers
        </Label>
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
