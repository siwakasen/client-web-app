'use client';

import * as React from 'react';
import { useState } from 'react';
import { CalendarIcon, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
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
import { Textarea } from '@/components/ui/textarea';
import { useRescheduleBooking } from '@/hooks/booking-adjustments.hook';
import { toast } from 'sonner';

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
  const router = useRouter();

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

  const handleDateRangeSelect = (selectedRange: DateRange | undefined) => {
    setDateRange(selectedRange);
  };

  const handleSingleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    let newStartDate: string;
    let newEndDate: string;

    if (isCarRental) {
      // For car rentals, use date range
      if (!dateRange?.from || !dateRange?.to) {
        toast.error('Please select both start and end dates');
        return;
      }
      newStartDate = dateRange.from.toISOString();
      newEndDate = dateRange.to.toISOString();
    } else {
      // For travel packages, use single date and calculate end date
      if (!selectedDate) {
        toast.error('Please select a new start date');
        return;
      }

      // Calculate end date based on current duration
      const currentStart = new Date(currentStartDate);
      const currentEnd = new Date(currentEndDate);
      const durationMs = currentEnd.getTime() - currentStart.getTime();
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

      const newEnd = new Date(selectedDate);
      newEnd.setDate(newEnd.getDate() + durationDays);

      newStartDate = selectedDate.toISOString();
      newEndDate = newEnd.toISOString();
    }

    setIsSubmitting(true);
    try {
      const response = await useRescheduleBooking(
        bookingId,
        newStartDate,
        newEndDate
      );

      if ('errors' in response) {
        toast.error('Failed to reschedule booking');
        console.error('Reschedule error:', response.errors);
      } else {
        toast.success('Reschedule request submitted successfully');
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast.error('An error occurred while rescheduling');
      console.error('Reschedule error:', error);
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
