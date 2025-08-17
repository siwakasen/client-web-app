import { CheckoutForm } from './_components/checkout-form';
import { useGetTravelPackagesDetail, useGetCustomer } from '@/hooks';
import { CheckoutRegisterForm } from './_components/checkout-register-form';
interface CheckoutPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } = await params;
  const { data: packageData } = await useGetTravelPackagesDetail({
    id: Number(id),
  });
  const { customer } = await useGetCustomer();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold">Ride Bali Explore</div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      {customer ? (
        <CheckoutForm travelPackage={packageData} customer={customer} />
      ) : (
        <CheckoutRegisterForm travelPackage={packageData} />
      )}

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
