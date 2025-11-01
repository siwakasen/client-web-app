'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRescheduleBooking } from '@/hooks/booking-adjustments.hook';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface RescheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  isCarRental: boolean;
  currentStartDate: string;
  currentEndDate: string;
  refetch: () => void;
}

export function RescheduleDialog({
  isOpen,
  onClose,
  bookingId,
  isCarRental,
  currentStartDate,
  currentEndDate,
  refetch,
}: RescheduleDialogProps) {
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!startDate) {
      return;
    }

    const computedEndDate = isCarRental ? endDate : startDate;
    if (!computedEndDate) return;

    try {
      setIsSubmitting(true);
      const response = await useRescheduleBooking(
        bookingId,
        startDate,
        computedEndDate
      );
      if ('errors' in response) {
        toast.error(response.errors.message);
        return;
      }
      toast.success('Booking rescheduled successfully');
      onClose();
      refetch();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Reschedule Booking
            </AlertDialogTitle>
            <AlertDialogDescription>
              Choose new dates for your{' '}
              {isCarRental ? 'car rental' : 'travel package'} booking #
              {bookingId}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Current Dates</Label>
              <div className="text-sm text-muted-foreground">
                {format(new Date(currentStartDate), 'PPP')} -{' '}
                {format(new Date(currentEndDate), 'PPP')}
              </div>
            </div>

            {isCarRental ? (
              <DateRangePicker
                label="New Date Range *"
                startDate={startDate}
                endDate={endDate}
                onDateRangeChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onApply={handleSubmit}
                onClear={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }}
                className="mt-2"
              />
            ) : (
              <div className="grid gap-2">
                <Label className="text-sm font-medium">New Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                      disabled={isSubmitting}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(new Date(startDate), 'PPP')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate ? new Date(startDate) : undefined}
                      onSelect={(date) => {
                        if (!date) return;
                        const formatted = format(date, 'yyyy-MM-dd');
                        setStartDate(formatted);
                        setEndDate(undefined);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={!startDate || (isCarRental && !endDate) || isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? 'Rescheduling...' : 'Reschedule Booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
