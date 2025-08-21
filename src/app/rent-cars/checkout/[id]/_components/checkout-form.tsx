'use client';
import { combineDateAndTime, convertISOToCurrentTimezone } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronDownIcon, Loader2 } from 'lucide-react';
import { Customer, Car } from '@/interfaces';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { OrderSummary } from '@/app/rent-cars/checkout/[id]/_components/order-summary';
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
import { Switch } from '@/components/ui/switch';
import { useRouter, usePathname } from 'next/navigation';
import { useUploadIdentityFile } from '@/hooks';
import { Upload, X, FileImage } from 'lucide-react';

interface CheckoutFormProps {
  car: Car;
  customer: Customer;
  searchParams: {
    start_date?: string;
    end_date?: string;
  };
}

export function CheckoutForm({
  car,
  customer,
  searchParams,
}: CheckoutFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof BookingFormSchema>>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      car_id: car.id,
      with_driver: false,
      start_date: searchParams.start_date
        ? new Date(searchParams.start_date).toISOString()
        : '',
      end_date: searchParams.end_date
        ? new Date(searchParams.end_date).toISOString()
        : '',
      payment_method: 'PAYPAL',
      pickup_location: '',
      pickup_time: '',
      additional_notes: '',
    },
  });

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [hasUploadedIdentity, setHasUploadedIdentity] = useState(
    customer.identity_file && customer.identity_file.length >= 2
  );

  // Function to update URL parameters
  const updateURLParams = (startDate: string, endDate: string) => {
    const newSearchParams = new URLSearchParams();
    if (startDate) {
      newSearchParams.set(
        'start_date',
        new Date(startDate).toISOString().split('T')[0]
      );
    }
    if (endDate) {
      newSearchParams.set(
        'end_date',
        new Date(endDate).toISOString().split('T')[0]
      );
    }
    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const startDate = form.watch('start_date');
  const endDate = form.watch('end_date');
  const pickupTime = form.watch('pickup_time');
  const withDriver = form.watch('with_driver');

  // Calculate rental duration in days
  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  };

  useEffect(() => {
    if (startDate && pickupTime && endDate) {
      const combinedStartDate = combineDateAndTime(startDate, pickupTime);
      if (combinedStartDate !== startDate) {
        form.setValue('start_date', combinedStartDate);
      }
      const combinedEndDate = combineDateAndTime(endDate, pickupTime);
      if (combinedEndDate !== endDate) {
        form.setValue('end_date', combinedEndDate);
      }
    }
  }, [startDate, pickupTime, endDate, form]);

  // File upload handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 30 * 1024 * 1024; // 30MB limit
      return isImage && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast.error('Please select only image files under 30MB');
      return;
    }

    if (selectedFiles.length + validFiles.length > 2) {
      toast.error('Maximum 2 files allowed');
      return;
    }

    setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 2));
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadIdentityFiles = async () => {
    if (selectedFiles.length !== 2) {
      toast.error('Please select exactly 2 identity files');
      return false;
    }

    setIsUploadingFiles(true);
    try {
      const result = await useUploadIdentityFile(selectedFiles);

      if ('errors' in result) {
        toast.error(result.errors.message || 'Failed to upload identity files');
        return false;
      }

      toast.success('Identity files uploaded successfully');
      setHasUploadedIdentity(true);
      setSelectedFiles([]);
      return true;
    } catch (error: any) {
      toast.error('Failed to upload identity files');
      return false;
    } finally {
      setIsUploadingFiles(false);
    }
  };

  async function onSubmit(values: z.infer<typeof BookingFormSchema>) {
    try {
      // Check if identity files are required and uploaded
      if (!hasUploadedIdentity) {
        toast.error('Please upload your identity files before proceeding');
        return;
      }

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

              {/* Identity Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Identity Verification</h2>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

                {hasUploadedIdentity ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Identity Verified
                        </p>
                        <p className="text-xs text-green-600">
                          Your identity documents have been uploaded and
                          verified.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-800">
                            Identity Files Required
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Please upload 2 clear photos of your identity to
                            proceed with car rental.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer"
                          >
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload Identity Files
                            </span>
                            <span className="mt-1 block text-xs text-gray-500">
                              PNG, JPG, JPEG up to 30MB each (2 files required)
                            </span>
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={selectedFiles.length >= 2}
                          />
                        </div>
                        <div className="mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document.getElementById('file-upload')?.click()
                            }
                            disabled={selectedFiles.length >= 2}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Select Images
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Selected Files Preview */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Selected Files:</h4>
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileImage className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Button */}
                    {selectedFiles.length === 2 && (
                      <Button
                        type="button"
                        onClick={uploadIdentityFiles}
                        disabled={isUploadingFiles}
                        className="w-full"
                      >
                        {isUploadingFiles ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Identity
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Rental Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium mb-4">Rental Details</h2>
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
                          <FormLabel htmlFor="start-date-picker">
                            Start Date
                          </FormLabel>
                          <Popover
                            open={openStartDate}
                            onOpenChange={setOpenStartDate}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="start-date-picker"
                                className="w-32 justify-between font-normal"
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
                                  const newStartDate = date
                                    ? date.toISOString()
                                    : '';
                                  field.onChange(newStartDate);
                                  setOpenStartDate(false);

                                  // Update URL parameters
                                  const currentEndDate =
                                    form.getValues('end_date');
                                  if (newStartDate && currentEndDate) {
                                    updateURLParams(
                                      newStartDate,
                                      currentEndDate
                                    );
                                  }
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* End Date */}
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-3">
                          <FormLabel htmlFor="end-date-picker">
                            End Date
                          </FormLabel>
                          <Popover
                            open={openEndDate}
                            onOpenChange={setOpenEndDate}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="end-date-picker"
                                className="w-32 justify-between font-normal"
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
                                  const startDateObj = startDate
                                    ? new Date(startDate)
                                    : today;
                                  return date <= today || date <= startDateObj;
                                }}
                                onSelect={(date) => {
                                  const newEndDate = date
                                    ? date.toISOString()
                                    : '';
                                  field.onChange(newEndDate);
                                  setOpenEndDate(false);

                                  // Update URL parameters
                                  const currentStartDate =
                                    form.getValues('start_date');
                                  if (currentStartDate && newEndDate) {
                                    updateURLParams(
                                      currentStartDate,
                                      newEndDate
                                    );
                                  }
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            className="w-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* With Driver Toggle */}
                  <FormField
                    control={form.control}
                    name="with_driver"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Include Driver
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Add a professional driver to your rental
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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
                        placeholder="Add any special requests or notes for your rental..."
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
                carData={car}
                days={calculateDays()}
                withDriver={withDriver || false}
              />
              {/* Pay Now Button */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || !hasUploadedIdentity}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                size="lg"
              >
                {form.formState.isSubmitting ||
                form.formState.isSubmitSuccessful ? (
                  <Loader2 className="animate-spin" />
                ) : !hasUploadedIdentity ? (
                  'Upload Identity Files to Continue'
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
