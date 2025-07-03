import { fetchTravelPackagesDetail } from "@/_services/travel-packages"
import { CheckoutForm } from "./_components/checkout-form"
import { OrderSummary } from "./_components/order-summary"

interface BookingData {
  package_id: number
  number_of_persons: number
  start_date: string
  end_date: string
  payment_method: "MIDTRANS" | "PAYPAL"
  pickup_location: string
  pickup_time: string
}

interface PackageData {
  id: number
  name: string
  price: number
  description: string
  duration: string
  image_url?: string
}

interface CheckoutPageProps {
  params: {
    id: string
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { id } =  await params;
  const {data : packageData} = await fetchTravelPackagesDetail({id: Number(id)})


  const initialBookingData = {
    package_id: Number.parseInt(id),
    number_of_persons: 1,
    start_date: "2025-06-30T15:49:25.825Z",
    end_date: "2025-07-01T15:49:25.826Z",
    payment_method: "PAYPAL" as const,
    pickup_location: "Hotel Kuta",
    pickup_time: "10:00",
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold">Ride Bali Explore</div>
          <div className="flex items-center gap-2">
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        {/* Left Column - Client Component (Form) */}
        <div className="lg:col-span-1">
          <CheckoutForm packageId={Number(id)} />
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
  )
}
