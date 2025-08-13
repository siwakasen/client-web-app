'use client';

import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

interface PaymentActionProps {
  payment_status: string;
  payment_method: string;
  payment_gateway_id: string;
}

export function PaymentAction({
  payment_status,
  payment_method,
  payment_gateway_id,
}: PaymentActionProps) {
  if (payment_status === 'PENDING') {
    return (
      <div className="mt-3 pt-3 border-t">
        <Button
          className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-1 cursor-pointer"
          onClick={() => {
            if (payment_method === 'PAYPAL') {
              window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${payment_gateway_id}`;
            } else if (payment_method === 'MIDTRANS') {
              window.location.href = `https://app.sandbox.midtrans.com/snap/v4/redirection/${payment_gateway_id}`;
            }
          }}
        >
          <CreditCard className="h-4 w-4" />
          Pay Now
        </Button>
        {payment_method === 'MIDTRANS' && (
          <div className="text-sm text-gray-500 px-2 pt-1">
            If your payment via Midtrans and you have already paid. Please be
            patient, your payment is being processed.
          </div>
        )}
      </div>
    );
  }

  return null;
}
