'use client';
import { combineDateAndTime } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronDownIcon, Loader2 } from 'lucide-react';
import { Customer, TravelPackages } from '@/interfaces';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { OrderSummary } from './order-summary';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { BookingFormSchema } from '@/lib/validation';
import { z } from 'zod';
import { useCreateBooking } from '@/hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
interface CheckoutFormProps {
  travelPackage: TravelPackages;
  customer: Customer;
}

export function CheckoutForm({ travelPackage, customer }: CheckoutFormProps) {
  const form = useForm<z.infer<typeof BookingFormSchema>>({
    resolver: async (data, context, options) => {
      // you can debug your validation schema here
      console.log('formData', data);
      console.log(
        'validation result',
        await zodResolver(BookingFormSchema)(data, context, options)
      );
      return zodResolver(BookingFormSchema)(data, context, options);
    },
    defaultValues: {
      package_id: travelPackage.id,
      with_driver: false,
      number_of_persons: 1,
      start_date: '',
      end_date: '',
      payment_method: 'PAYPAL',
      pickup_location: '',
      pickup_time: '',
      additional_notes: '',
    },
  });

  const [openDate, setOpenDate] = useState(false);

  const startDate = form.watch('start_date');
  const pickupTime = form.watch('pickup_time');

  useEffect(() => {
    if (startDate) {
      const combined = combineDateAndTime(startDate, pickupTime);
      if (combined !== startDate) {
        form.setValue('start_date', combined);
      }
      form.setValue('end_date', combined);
    }
  }, [startDate, pickupTime, form]);

  async function onSubmit(values: z.infer<typeof BookingFormSchema>) {
    try {
      const formData = {
        ...values,
      };
      const response = await useCreateBooking(formData);

      if ('errors' in response) {
        toast.error(response.errors.message || 'An error occurred', {
          description: response.status
            ? `Error code: ${response.status}`
            : undefined,
        });
        return;
      }
      window.location.href = response.data.redirect_url;
    } catch (error: any) {
      console.log(error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          {/* Left Column - Client Component (Form) */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 md:p-8 space-y-6">
              {/* Account Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Customer Details</h2>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-md text-gray-700 font-bold">
                  {customer?.name}
                </div>
                <div className="text-sm text-gray-600">{customer?.email}</div>
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
                                className="w-32 justify-between font-normal cursor-pointer"
                                type="button"
                              >
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : 'Select date'}
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
                                    date ? date.toISOString() : ''
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
                            Pickup Time
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
                            field.value === 'PAYPAL'
                              ? 'border-blue-500'
                              : 'border-gray-200'
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
                                  PayPal{' '}
                                  <span className="text-xs text-gray-500">
                                    (Recommended for international and faster
                                    process.)
                                  </span>
                                </span>
                                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                                  PayPal
                                </div>
                              </div>
                            </label>
                          </div>
                          {field.value === 'PAYPAL' && (
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
                            field.value === 'MIDTRANS'
                              ? 'border-blue-500'
                              : 'border-gray-200'
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
                          {field.value === 'MIDTRANS' && (
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
                numberOfPersons={form.watch('number_of_persons') || 1}
              />
              {/* Pay Now Button */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-8 cursor-pointer"
                size="lg"
              >
                {form.formState.isSubmitting ||
                form.formState.isSubmitSuccessful ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Pay now'
                )}
              </Button>
              <div className="text-sm text-gray-500 mt-4">
                <div className="font-bold pb-1">Development payments:</div>
                <div>
                  <div className="font-bold">Paypal</div>
                  <div className="text-xs ps-2">
                    If you choose Paypal as payment method, copy the account
                    below first.
                  </div>
                  <div className="text-sm ps-2">
                    Username: sb-cxz6y43810532@personal.example.com
                  </div>
                  <div className="text-sm ps-2">Password: yyb]7fJ?</div>
                </div>
                <div>
                  <div className="font-bold">Midtrans</div>
                  <div className="text-sm ps-2">
                    If you choose Midtrans as payment method, click the link
                    here before click Pay Now Button{' '}
                    <a
                      href="https://simulator.sandbox.midtrans.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Midtrans Payment Simulator
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
