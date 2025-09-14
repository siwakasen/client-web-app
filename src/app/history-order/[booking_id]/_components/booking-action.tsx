'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCancelBooking } from '@/hooks';
import { RotateCcw, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { CancellationDialog } from '../../_components/cancellation-dialog';
import { RescheduleDialog } from '../../_components/reschedule-dialog';
import { RatingDialog } from '../../_components/rating-dialog';
import { Rating } from '@/interfaces/rating.interface';

interface BookingActionsProps {
  bookingId: number;
  status: string;
  isRequestingCancel: boolean;
  isRequestingReschedule: boolean;
  isCarRental: boolean;
  currentStartDate: string;
  currentEndDate: string;
  rating?: Rating;
  refetch?: () => void;
}

export function BookingActions({
  bookingId,
  status,
  isRequestingCancel,
  isRequestingReschedule,
  isCarRental,
  currentStartDate,
  currentEndDate,
  rating,
  refetch,
}: BookingActionsProps) {
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const canRescheduleOrCancel = (status: string) => {
    return status === 'WAITING_CONFIRMATION' || status === 'CONFIRMED';
  };

  const canCancel = (status: string) => {
    return status === 'WAITING_PAYMENT';
  };

  const canRate = (status: string) => {
    const upperStatus = status?.toUpperCase();
    return upperStatus === 'COMPLETED';
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

  const handleRateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRatingDialog(true);
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
        <div className="pt-3 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-1 cursor-pointer"
            onClick={handleCancelClick}
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

  if (canRate(status)) {
    // If rating exists, show the rating
    if (rating) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{rating.service_rate}/5</span>
          </div>
          {rating.description && (
            <span className="text-sm text-gray-600 italic">
              "{rating.description}"
            </span>
          )}
        </div>
      );
    }

    // If no rating exists, show the Rate button
    return (
      <>
        <div className="pt-3 border-t">
          <Button
            variant="default"
            size="sm"
            className="cursor-pointer bg-amber-500 hover:bg-amber-600"
            onClick={handleRateClick}
          >
            <Star className="h-4 w-4" />
            Rate
          </Button>
        </div>

        <RatingDialog
          isOpen={showRatingDialog}
          onClose={() => setShowRatingDialog(false)}
          bookingId={bookingId}
          onSuccess={refetch || (() => window.location.reload())}
        />
      </>
    );
  }

  return null;
}
