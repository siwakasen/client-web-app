import { fetchTravelPackagesDetail } from "@/_services/travel-packages";
import { CheckoutForm } from "./_components/checkout-form";
import { OrderSummary } from "./_components/order-summary";
import { getToken, hasSession } from "@/lib/session";
import { getCustomer } from "@/_services/customers";
import { Customer } from "@/_interfaces/customer.interface";
import { getHeaders } from "@/lib";
import { useGetTravelPackagesDetail } from "@/_hooks/travel-packages/ssr-travel.hook";

interface BookingData {
  package_id: number;
  number_of_persons: number;
  start_date: string;
  end_date: string;
  payment_method: "MIDTRANS" | "PAYPAL";
  pickup_location: string;
  pickup_time: string;
}

interface PackageData {
  id: number;
  name: string;
  price: number;
  description: string;
  duration: string;
  image_url?: string;
}

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
      const { data } = await getCustomer(token!, header);
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

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        {/* Left Column - Client Component (Form) */}
        <div className="lg:col-span-1">
          <CheckoutForm packageId={Number(id)} customer={customer!} />
        </div>

        {/* Right Column - Server Component (Order Summary) */}
        <div className="lg:col-span-1 bg-gray-50 p-6 md:p-8 border-l ">
          <OrderSummary packageData={packageData} />
        </div>
      </div>

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
