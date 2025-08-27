'use client';
import { Car } from '@/interfaces/rent-car.interface';
import { combineDateAndTime, convertISOToCurrentTimezone } from '@/lib/utils';
import { BookingRegisterFormSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronDown,
  ChevronDownIcon,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl } from '@/components/ui/form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OrderSummary } from '@/app/rent-cars/checkout/[id]/_components/order-summary';
import { PhoneInput } from '@/components/shared/phone-input/phone-input';
import {
  CountryDropdown,
  Country,
} from '@/components/shared/country-input/country-dropdown';
import { toast } from 'sonner';
import { useCreateBookingWithRegister } from '@/hooks';
import { Switch } from '@/components/ui/switch';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Upload, X, FileImage } from 'lucide-react';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CheckoutRegisterFormProps {
  car: Car;
  searchParams: {
    start_date?: string;
    end_date?: string;
  };
}

export function CheckoutRegisterForm({
  car,
  searchParams,
}: CheckoutRegisterFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<z.infer<typeof BookingRegisterFormSchema>>({
    resolver: zodResolver(BookingRegisterFormSchema),
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
      name: '',
      email: '',
      password: '',
      confirm_password: '',
      phone_number: '',
      country_origin: '',
      identity_file: [],
    },
    mode: 'onChange',
  });

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

    const newFiles = [...selectedFiles, ...validFiles].slice(0, 2);
    setSelectedFiles(newFiles);

    // Update form with files
    form.setValue('identity_file', newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    form.setValue('identity_file', newFiles);
  };

  async function onSubmit(values: z.infer<typeof BookingRegisterFormSchema>) {
    try {
      const convertedStartDate = convertISOToCurrentTimezone(values.start_date);
      const convertedEndDate = convertISOToCurrentTimezone(values.end_date);
      const formData = {
        ...values,
        start_date: convertedStartDate,
        end_date: convertedEndDate,
      };
      const response = await useCreateBookingWithRegister(formData);
      if ('errors' in response) {
        switch (true) {
          case !!response.errors?.message:
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
                              type={showPassword ? 'text' : 'password'}
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
                              type={showConfirmPassword ? 'text' : 'password'}
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

              {/* Identity Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium">Identity Verification</h2>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>

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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          Identity & Driver License Required
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Upload your identity file and driver license file.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 ${
                      form.formState.errors.identity_file
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label
                          htmlFor="file-upload-register"
                          className="cursor-pointer"
                        >
                          <span className="mt-1 block text-xs text-gray-500">
                            PNG, JPG, JPEG (2 files required)
                          </span>
                        </label>
                        <input
                          id="file-upload-register"
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
                            document
                              .getElementById('file-upload-register')
                              ?.click()
                          }
                          disabled={selectedFiles.length >= 2}
                          className={
                            form.formState.errors.identity_file
                              ? 'border-red-300 text-red-600 hover:border-red-400 cursor-pointer'
                              : ''
                          }
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Select Images
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {form.formState.errors.identity_file && (
                    <div className="text-sm text-red-600 mt-2 font-medium">
                      {form.formState.errors.identity_file.message}
                    </div>
                  )}

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
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedFiles.length === 2 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
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
                        <p className="text-sm text-green-800">
                          Ready to proceed! Your identity will be uploaded after
                          registration.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rental Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-medium mb-4">Rental Details</h2>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-4">
                  <span className="text-sm text-gray-500">
                    Date and pickup time are shown in Bali Timezone (GMT +8).
                  </span>
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
                          <div className="flex gap-2">
                            <Select
                              value={
                                field.value ? field.value.split(':')[0] : ''
                              }
                              onValueChange={(hour: string) => {
                                const currentTime = field.value || '00:00';
                                const [_, minutes] = currentTime.split(':');
                                const newTime = `${hour}:${minutes}`;
                                field.onChange(newTime);
                              }}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="HH" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={i.toString().padStart(2, '0')}
                                  >
                                    {i.toString().padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="flex items-center text-lg font-semibold">
                              :
                            </span>
                            <Select
                              value={
                                field.value ? field.value.split(':')[1] : ''
                              }
                              onValueChange={(minute: string) => {
                                const currentTime = field.value || '00:00';
                                const [hours] = currentTime.split(':');
                                const newTime = `${hours}:${minute}`;
                                field.onChange(newTime);
                              }}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue placeholder="MM" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
                                ].map((min) => (
                                  <SelectItem
                                    key={min}
                                    value={min.toString().padStart(2, '0')}
                                  >
                                    {min.toString().padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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
                <div className="space-y-4 mb-4">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-yellow-600">
                          The final price will be displayed on the payment page
                          and may vary based on currency conversion and
                          applicable taxes.
                        </p>
                      </div>
                    </div>
                  </div>
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
                disabled={
                  form.formState.isSubmitting ||
                  form.formState.isSubmitSuccessful
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-8 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                size="lg"
              >
                {form.formState.isSubmitting ||
                form.formState.isSubmitSuccessful ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Create Account & Pay'
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
