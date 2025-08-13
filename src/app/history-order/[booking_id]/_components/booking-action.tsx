'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCancelBooking } from '@/hooks';
import { RotateCcw, X } from 'lucide-react';
import { toast } from 'sonner';
import { CancellationDialog } from '../../_components/cancellation-dialog';
import { RescheduleDialog } from '../../_components/reschedule-dialog';

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isRequestingCancel: boolean;
  isRequestingReschedule: boolean;
  isCarRental: boolean;
  currentStartDate: string;
  currentEndDate: string;
}

export function BookingActions({
  bookingId,
  status,
  isRequestingCancel,
  isRequestingReschedule,
  isCarRental,
  currentStartDate,
  currentEndDate,
}: BookingActionsProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const canRescheduleOrCancel = (status: string) => {
    return status === 'WAITING_CONFIRMATION' || status === 'CONFIRMED';
  };

  const canCancel = (status: string) => {
    console.log(status === 'WAITING_PAYMENT');
    return status === 'WAITING_PAYMENT';
  };

  const handleReschedule = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRescheduleDialog(true);
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCancellationDialog(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    try {
      setIsCancelling(true);
      const response = await useCancelBooking(bookingId, reason);

      if ('errors' in response) {
        toast.error(response.errors.message);
      }

      if ('data' in response) {
        toast.success('Booking cancelled successfully');
        // Optionally redirect or refresh the page
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Show reschedule and cancel for WAITING_CONFIRMATION and CONFIRMED
  if (canRescheduleOrCancel(status)) {
    return (
      <>
        <div className="pt-3 border-t flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleReschedule}
            disabled={
              isRequestingReschedule || isRequestingCancel || isCancelling
            }
          >
            <RotateCcw className="h-4 w-4" />
            Reschedule
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleCancelClick}
            disabled={
              isRequestingCancel || isRequestingReschedule || isCancelling
            }
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>

        <CancellationDialog
          isOpen={showCancellationDialog}
          onClose={() => setShowCancellationDialog(false)}
          onConfirm={handleCancelConfirm}
          bookingId={bookingId}
          status={status}
          isLoading={isCancelling}
        />
        <RescheduleDialog
          isOpen={showRescheduleDialog}
          onClose={() => setShowRescheduleDialog(false)}
          bookingId={bookingId}
          isCarRental={isCarRental}
          currentStartDate={currentStartDate}
          currentEndDate={currentEndDate}
        />
      </>
    );
  }

  // Show only cancel for other cancellable statuses
  if (canCancel(status)) {
    return (
      <>
        <div className="pt-3 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleCancelClick}
            disabled={
              isRequestingCancel || isRequestingReschedule || isCancelling
            }
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>

        <CancellationDialog
          isOpen={showCancellationDialog}
          onClose={() => setShowCancellationDialog(false)}
          onConfirm={handleCancelConfirm}
          bookingId={bookingId}
          status={status}
          isLoading={isCancelling}
        />
      </>
    );
  }

  return null;
}
