import { useGetCarsDetail, useGetCustomer } from "@/hooks";
import { redirect } from "next/navigation";
import { CheckoutForm } from "./_components/checkout-form";
import { CheckoutRegisterForm } from "./_components/checkout-register-form";

interface CheckoutPageProps {
  params: {
    id: string;
  };
  searchParams: Promise<{ start_date?: string; end_date?: string }>;
}

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const { id } = await params;
  const { start_date, end_date } = await searchParams;
  if (!start_date || !end_date) {
    redirect("/rent-cars");
  }
  const { data: car } = await useGetCarsDetail(Number(id));
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
        <CheckoutForm 
          car={car} 
          customer={customer} 
          searchParams={{ start_date, end_date }} 
        />
      ) : (
        <CheckoutRegisterForm 
          car={car} 
          searchParams={{ start_date, end_date }} 
        />
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
          </div>
        </div>
      </div>
    </div>
  );
}