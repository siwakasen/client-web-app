'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { AlertTriangle } from 'lucide-react';

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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-2"
              >
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
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-sm text-destructive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                type="button"
                className="cursor-pointer"
              >
                Keep Booking
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={isLoading}
                type="button"
                className="cursor-pointer"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </motion.div>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
