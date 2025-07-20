import { notFound, redirect, RedirectType } from "next/navigation";
import { cancelPaymentPaypal } from "@/services/payment";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PaymentsCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    notFound();
  }

  const { statusCode, message } = await cancelPaymentPaypal(token);

  if (statusCode == 404) {
    redirect("/", RedirectType.replace);
  }
  if (statusCode !== 201 && statusCode !== 200) {
    console.log(statusCode);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="mb-6">
          <XCircle className="h-20 w-20 text-red-500 mx-auto" />
        </div>

        {/* Cancel Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Booking Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your booking has been successfully cancelled.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/">Return to Home</Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/travel-packages">Browse Travel Packages</Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            If you have any questions about your cancellation, please contact
            our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
