'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Refund, RefundMethod } from '@/interfaces/refunds.interface';
import { useAddRefundForm } from '@/hooks/refunds.hook';
import { toast } from 'sonner';

interface RefundFormDialogProps {
  bookingId: string;
  refund: Refund;
}

export function RefundFormDialog({ bookingId, refund }: RefundFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await useAddRefundForm(refund.id, formData);
    if ('errors' in response) {
      toast.error(response.errors.message);
      return;
    } else if ('message' in response) {
      toast.success(response.message);
    }

    // Close dialog
    setOpen(false);

    // Reset form
    setFormData({
      bank_name: '',
      account_number: '',
      account_name: '',
    });
    window.location.reload();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    if (refund.method === RefundMethod.BANK_TRANSFER) {
      return (
        formData.bank_name.trim() &&
        formData.account_number.trim() &&
        formData.account_name.trim()
      );
    } else if (refund.method === RefundMethod.PAYPAL) {
      return formData.account_name.trim();
    }
    return false;
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="w-full cursor-pointer bg-blue-600 text-white"
        >
          Fill Refund Form
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Refund Request Form</AlertDialogTitle>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method Display */}
          <div className="space-y-2">
            <Label>Refund Method</Label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                {refund.method === RefundMethod.BANK_TRANSFER
                  ? 'Bank Transfer'
                  : 'PayPal'}
              </p>
            </div>
          </div>

          {/* Bank Transfer Fields */}
          {refund.method === RefundMethod.BANK_TRANSFER && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bank_name">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bank_name"
                  value={formData.bank_name}
                  onChange={(e) =>
                    handleInputChange('bank_name', e.target.value)
                  }
                  placeholder="Enter bank name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_number">
                  Account Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) =>
                    handleInputChange('account_number', e.target.value)
                  }
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_name">
                  Account Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="account_name"
                  value={formData.account_name}
                  onChange={(e) =>
                    handleInputChange('account_name', e.target.value)
                  }
                  placeholder="Enter account holder name"
                  required
                />
              </div>
            </>
          )}

          {/* PayPal Fields */}
          {refund.method === RefundMethod.PAYPAL && (
            <div className="space-y-2">
              <Label htmlFor="account_name">
                Account Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="account_name"
                value={formData.account_name}
                onChange={(e) =>
                  handleInputChange('account_name', e.target.value)
                }
                placeholder="Enter PayPal account name"
                required
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={!isFormValid()}>
              Submit Refund Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
