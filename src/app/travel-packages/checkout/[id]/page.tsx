import { CheckoutForm } from "./_components/checkout-form";
import { getToken, hasSession } from "@/lib/session";
import { Customer } from "@/_interfaces/customer.interface";
import { getHeaders } from "@/lib";
import { useGetTravelPackagesDetail, useGetCustomer } from "@/_hooks";
interface CheckoutPageProps {
  params: {
    id: string;
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const { data: packageData } = await useGetTravelPackagesDetail(
    {
      id: Number(id),
    },
    await getHeaders()
  );

  let isAuthenticated = await hasSession();

  let customer: Customer;
  try {
    if (isAuthenticated) {
      const token = await getToken();
      const header = await getHeaders();
      const { data } = await useGetCustomer(token!, header);
      customer = data;
    }
  } catch (error) {
    isAuthenticated = false;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold">Ride Bali Explore</div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      <CheckoutForm travelPackage={packageData} customer={customer!} />

      {/* Footer Links */}
      <div className="bg-white border-t px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-600">
            <a href="#" className="hover:underline">
              Refund Policy
            </a>
            <a href="#" className="hover:underline">
              Shipping Policy
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact Information
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
