'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, X } from 'lucide-react';

interface CancellationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  bookingId: number;
  status: string;
  isLoading?: boolean;
}

export function CancellationDialog({
  isOpen,
  onClose,
  onConfirm,
  bookingId,
  status,
  isLoading = false,
}: CancellationDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const requiresReason =
    status === 'WAITING_CONFIRMATION' || status === 'CONFIRMED';

  const handleConfirm = () => {
    if (requiresReason && !reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    const finalReason = requiresReason ? reason.trim() : '';
    onConfirm(finalReason);
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancel Booking
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel booking #{bookingId}? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {requiresReason && (
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for cancellation *
              </Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for cancelling this booking..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            type="button"
          >
            Keep Booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            type="button"
          >
            {isLoading ? 'Cancelling...' : 'Cancel Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
