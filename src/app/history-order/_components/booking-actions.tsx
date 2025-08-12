"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw, X } from "lucide-react";

interface BookingActionsProps {
  bookingId: number;
  status: string;
}

export function BookingActions({ bookingId, status }: BookingActionsProps) {
  const canRescheduleOrCancel = (status: string) => {
    const upperStatus = status?.toUpperCase();
    return upperStatus === 'WAITING_CONFIRMATION' || upperStatus === 'CONFIRMED';
  };

  const handleReschedule = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement reschedule functionality
    alert(`Reschedule booking #${bookingId}`);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement cancel functionality
    if (confirm(`Are you sure you want to cancel booking #${bookingId}?`)) {
      alert(`Cancel booking #${bookingId}`);
    }
  };

  if (!canRescheduleOrCancel(status)) {
    return null;
  }

  return (
    <div className="border-t pt-3 flex gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={handleReschedule}
        className="flex items-center gap-1 cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        Reschedule
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleCancel}
        className="flex items-center gap-1 cursor-pointer"
      >
        <X className="h-4 w-4" />
        Cancel
      </Button>
    </div>
  );
}
