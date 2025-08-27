'use client';

import * as React from 'react';
import { useState } from 'react';
import { CalendarIcon, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useRouter } from 'next/navigation';

import { cn, convertISOToCurrentTimezone } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useRescheduleBooking } from '@/hooks/booking-adjustments.hook';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  isCarRental: boolean;
  currentStartDate: string;
  currentEndDate: string;
}

export function RescheduleDialog({
  isOpen,
  onClose,
  bookingId,
  isCarRental,
  currentStartDate,
  currentEndDate,
}: RescheduleDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For car rentals - date range picker
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (currentStartDate && currentEndDate) {
      return {
        from: new Date(currentStartDate),
        to: new Date(currentEndDate),
      };
    }
    return undefined;
  });

  // For travel packages - single date picker
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentStartDate ? new Date(currentStartDate) : undefined
  );

  // Pickup time state
  const [pickupTime, setPickupTime] = useState('');

  // Helper function to combine date and time
  const combineDateAndTime = (date: Date, time: string): Date => {
    if (!time) return date;
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return newDate;
  };

  const handleDateRangeSelect = (selectedRange: DateRange | undefined) => {
    setDateRange(selectedRange);
  };

  const handleSingleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    let newStartDate: string;
    let newEndDate: string;
    if (!pickupTime) {
      toast.error('Please select a pickup time');
      return;
    }

    if (isCarRental) {
      // For car rentals, use date range
      if (!dateRange?.from || !dateRange?.to) {
        toast.error('Please select both start and end dates');
        return;
      }

      // Combine dates with pickup time if provided
      const startDateWithTime = pickupTime
        ? combineDateAndTime(dateRange.from, pickupTime)
        : dateRange.from;
      const endDateWithTime = pickupTime
        ? combineDateAndTime(dateRange.to, pickupTime)
        : dateRange.to;
      newStartDate = convertISOToCurrentTimezone(
        startDateWithTime.toISOString()
      );
      newEndDate = convertISOToCurrentTimezone(endDateWithTime.toISOString());
    } else {
      // For travel packages, use single date and calculate end date
      if (!selectedDate) {
        toast.error('Please select a new start date');
        return;
      }

      const newEnd = new Date(selectedDate);

      // Combine dates with pickup time if provided
      const startDateWithTime = pickupTime
        ? combineDateAndTime(selectedDate, pickupTime)
        : selectedDate;
      const endDateWithTime = pickupTime
        ? combineDateAndTime(newEnd, pickupTime)
        : newEnd;
      newStartDate = convertISOToCurrentTimezone(
        startDateWithTime.toISOString()
      );
      newEndDate = convertISOToCurrentTimezone(endDateWithTime.toISOString());
    }

    setIsSubmitting(true);
    try {
      const response = await useRescheduleBooking(
        bookingId,
        newStartDate,
        newEndDate
      );
      if ('errors' in response) {
        toast.error(response.errors.message || 'An error occurred');
      } else {
        toast.success('Reschedule request submitted successfully');
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast.error('An error occurred while rescheduling');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    if (isCarRental) {
      setDateRange(undefined);
    } else {
      setSelectedDate(undefined);
    }
    setPickupTime('');
  };

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return 'Pick a date range';
    }

    if (dateRange.from && !dateRange.to) {
      return format(dateRange.from, 'LLL dd, y');
    }

    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'LLL dd, y')} - ${format(
        dateRange.to,
        'LLL dd, y'
      )}`;
    }

    return 'Pick a date range';
  };

  const formatSingleDate = () => {
    if (!selectedDate) {
      return 'Pick a date';
    }
    return format(selectedDate, 'LLL dd, y');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Booking</DialogTitle>
          <DialogDescription>
            {isCarRental
              ? 'Select new start and end dates for your car rental'
              : 'Select a new start date for your travel package'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date Selection */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">
              {isCarRental ? 'New Date Range' : 'New Start Date'}
            </Label>

            {isCarRental ? (
              // Car rental - Date range picker
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateRange && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatDateRange()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeSelect}
                      numberOfMonths={1}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date <= today;
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {dateRange && (dateRange.from || dateRange.to) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Selected range:</span>
                    <span className="font-medium">{formatDateRange()}</span>
                  </div>
                )}
              </div>
            ) : (
              // Travel package - Single date picker
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formatSingleDate()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleSingleDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date <= today;
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {selectedDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Selected date:</span>
                    <span className="font-medium">{formatSingleDate()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Pickup Time Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pickup Time</Label>
              <div className="flex gap-2">
                <Select
                  value={pickupTime ? pickupTime.split(':')[0] : ''}
                  onValueChange={(hour: string) => {
                    const currentTime = pickupTime || '00:00';
                    const [_, minutes] = currentTime.split(':');
                    const newTime = `${hour}:${minutes}`;
                    setPickupTime(newTime);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                        {i.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="flex items-center text-lg font-semibold">
                  :
                </span>
                <Select
                  value={pickupTime ? pickupTime.split(':')[1] : ''}
                  onValueChange={(minute: string) => {
                    const currentTime = pickupTime || '00:00';
                    const [hours] = currentTime.split(':');
                    const newTime = `${hours}:${minute}`;
                    setPickupTime(newTime);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(
                      (min) => (
                        <SelectItem
                          key={min}
                          value={min.toString().padStart(2, '0')}
                        >
                          {min.toString().padStart(2, '0')}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isSubmitting}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
