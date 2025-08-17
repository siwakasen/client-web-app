import { Button } from '@/components/ui/button';
import { useGetPaymentByBookingId } from '@/hooks/payments.hook';
import { CheckCircle, TimerIcon, XCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect, RedirectType } from 'next/navigation';

export default async function PaymentCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ order_id: string; transaction_status: string }>;
}) {
  const { order_id, transaction_status } = await searchParams;
  if (!order_id || isNaN(Number(order_id.split('-')[0]))) {
    notFound();
  }

  let isSuccess = false;
  let isPending = false;
  let message = '';
  let payment_gateway_id = '';

  const response = await useGetPaymentByBookingId(
    Number(order_id.split('-')[0])
  );
  if ('errors' in response && 'status' in response) {
    console.log(response);
    if (response.status === 404) {
      notFound();
    } else {
      redirect('/', RedirectType.replace);
    }
  } else if ('data' in response) {
    const payment = response.data;
    payment_gateway_id = payment.payment_gateway_id;
    if (
      payment.status === 'SUCCESS' ||
      transaction_status === 'settlement' ||
      transaction_status === 'capture'
    ) {
      isSuccess = true;
      message = 'Your payment has been successfull';
    } else if (payment.status === 'PENDING') {
      isPending = true;
      message =
        'Your payment has not completed yet. Please click the button below to continue.';
    } else {
      isSuccess = false;
      message = 'Your payment has failed. Please try again.';
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          {isSuccess ? (
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          ) : isPending ? (
            <TimerIcon className="h-20 w-20 text-yellow-500 mx-auto" />
          ) : (
            <XCircle className="h-20 w-20 text-red-500 mx-auto" />
          )}
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isSuccess
            ? 'Payment Successful!'
            : isPending
            ? 'Payment Pending!'
            : 'Payment Failed!'}
        </h1>

        {/* Show message if there's an error */}
        <div
          className={`mb-6 p-4 ${
            isPending ? 'bg-yellow-50' : isSuccess ? 'bg-green-50' : 'bg-red-50'
          } rounded-lg`}
        >
          <p
            className={`${
              isPending
                ? 'text-yellow-700'
                : isSuccess
                ? 'text-green-700'
                : 'text-red-700'
            } text-sm`}
          >
            {message}
          </p>
        </div>
        {/* Action Buttons */}
        <div className="space-y-3">
          {isSuccess && (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/history-order">Check your bookings</Link>
            </Button>
          )}

          {isPending && (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link
                href={`https://app.sandbox.midtrans.com/snap/v4/redirection/${payment_gateway_id}`}
              >
                Complete The Payment
              </Link>
            </Button>
          )}

          {isSuccess && (
            <Button variant="outline" asChild className="w-full">
              <Link href="/travel-packages">Browse more packages</Link>
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {isSuccess
              ? 'You will receive a confirmation email with all the details of your booking. If you have any questions, please contact our support team.'
              : 'If you believe this is an error, please contact our support team for assistance.'}
          </p>
        </div>
      </div>
    </div>
  );
}
