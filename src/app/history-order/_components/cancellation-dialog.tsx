'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Cancel Booking
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel booking #{bookingId}? You will be
              refunded <span className="font-bold text-black">70%</span> of the
              booking amount.
            </AlertDialogDescription>
          </AlertDialogHeader>

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

          <AlertDialogFooter className="flex gap-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AlertDialogCancel
                onClick={handleClose}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Keep Booking
              </AlertDialogCancel>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AlertDialogAction
                onClick={handleConfirm}
                disabled={isLoading}
                className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Booking'}
              </AlertDialogAction>
            </motion.div>
          </AlertDialogFooter>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
