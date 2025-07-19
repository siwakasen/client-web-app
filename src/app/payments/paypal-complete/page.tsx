import { redirect, RedirectType } from "next/navigation";
import { capturePaymentPaypal } from "@/services/payment";
import { CheckCircle, Loader2, XCircle, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/", RedirectType.replace);
  }

  let isSuccess = false;
  let isPending = false;
  let message = "";

  const {
    statusCode,
    message: resultMessage,
    orderId,
  } = await capturePaymentPaypal(token);

  if (statusCode === 201 || statusCode === 200) {
    isSuccess = true;
    message = resultMessage;
  } else if (statusCode === 422) {
    isPending = true;
    message =
      resultMessage == "ORDER_ALREADY_CAPTURED"
        ? "Your payment has already been processed."
        : `Your payment has not completed yet. Please the button below to continue.`;
  } else {
    redirect("/", RedirectType.replace);
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
          {isSuccess ? "Payment Successful!" : "Payment Failed!"}
        </h1>

        <p className="text-gray-600 mb-6">
          {isSuccess && "Your payment has been successfully."}
        </p>

        {/* Show message if there's an error */}
        {(!isSuccess || isPending) && (
          <div
            className={`mb-6 p-4 ${
              isPending ? "bg-yellow-50" : "bg-red-50"
            } rounded-lg`}
          >
            <p
              className={`${
                isPending ? "text-yellow-700" : "text-red-700"
              } text-sm`}
            >
              {message}
            </p>
          </div>
        )}
        {/* Action Buttons */}
        <div className="space-y-3">
          {(resultMessage == "ORDER_ALREADY_CAPTURED" || isSuccess) && (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/">Check your bookings</Link>
            </Button>
          )}
          {resultMessage == "ORDER_NOT_APPROVED" && (
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link
                href={`https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`}
              >
                Complete The Payment
              </Link>
            </Button>
          )}

          {(resultMessage == "ORDER_ALREADY_CAPTURED" || isSuccess) && (
            <Button variant="outline" asChild className="w-full">
              <Link href="/travel-packages">Browse more packages</Link>
            </Button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            {isSuccess
              ? "You will receive a confirmation email with all the details of your booking. If you have any questions, please contact our support team."
              : "If you believe this is an error, please contact our support team for assistance."}
          </p>
        </div>
      </div>
    </div>
  );
}
