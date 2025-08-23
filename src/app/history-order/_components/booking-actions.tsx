'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCancelBooking } from '@/hooks';
import { RotateCcw, X, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { CancellationDialog } from './cancellation-dialog';
import { RescheduleDialog } from './reschedule-dialog';

interface BookingActionsProps {
  bookingId: number;
  status: string;
  refetch: () => void;
  isRequestingCancel: boolean;
  isRequestingReschedule: boolean;
  payment_method: string;
  payment_gateway_id: string;
  isCarRental: boolean;
  currentStartDate: string;
  currentEndDate: string;
}

export function BookingActions({
  bookingId,
  status,
  refetch,
  isRequestingCancel,
  isRequestingReschedule,
  payment_method,
  payment_gateway_id,
  isCarRental,
  currentStartDate,
  currentEndDate,
}: BookingActionsProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const canRescheduleOrCancel = (status: string) => {
    const upperStatus = status?.toUpperCase();
    // new Date(booking.start_date).getTime() - new Date().getTime() <= 1000 * 60 * 60 * 24
    return (
      upperStatus === 'WAITING_CONFIRMATION' || upperStatus === 'CONFIRMED'
    );
  };

  const canCancel = (status: string) => {
    const upperStatus = status?.toUpperCase();
    return (
      upperStatus === 'WAITING_PAYMENT' ||
      upperStatus === 'WAITING_CONFIRMATION' ||
      upperStatus === 'CONFIRMED'
    );
  };

  const canPay = (status: string) => {
    const upperStatus = status?.toUpperCase();
    return upperStatus === 'WAITING_PAYMENT';
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
        refetch();
      }
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePayNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (payment_method === 'PAYPAL') {
      window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${payment_gateway_id}`;
    } else if (payment_method === 'MIDTRANS') {
      window.location.href = `https://app.sandbox.midtrans.com/snap/v4/redirection/${payment_gateway_id}`;
    }
  };

  // Show Pay Now button for WAITING_PAYMENT
  if (canPay(status)) {
    return (
      <>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-1 cursor-pointer bg-green-600 hover:bg-green-700"
            onClick={handlePayNow}
          >
            <CreditCard className="h-4 w-4" />
            Pay Now
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancelClick}
            className="flex items-center gap-1 cursor-pointer"
            disabled={isRequestingCancel || isCancelling}
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

  // Show reschedule and cancel for WAITING_CONFIRMATION and CONFIRMED
  if (canRescheduleOrCancel(status)) {
    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReschedule}
            className="flex items-center gap-1 cursor-pointer"
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
            onClick={handleCancelClick}
            className="flex items-center gap-1 cursor-pointer"
            disabled={isRequestingCancel || isCancelling}
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
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancelClick}
            className="flex items-center gap-1 cursor-pointer"
            disabled={isRequestingCancel || isCancelling}
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
