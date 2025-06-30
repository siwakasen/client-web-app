import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin } from "lucide-react"
import { TravelPackages } from "@/_interfaces/travel-packages.interface"



interface OrderSummaryProps {
  packageData: TravelPackages
}

export function OrderSummary({ packageData }: OrderSummaryProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "USD",
  }).format(packageData.package_price)

  return (
    <div className="md:sticky md:top-24 h-fit">
      <div className="p-6 md:p-8 ">
        <div className="space-y-6">
          {/* Package Details */}
          <div className="flex gap-4 items-start">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{packageData.package_name}</h3>
              <p className="text-sm text-gray-600">{packageData.description}</p>
              <p className="text-xs text-gray-500">{packageData.duration} hours</p>
            </div>
            <div className="text-right font-semibold">{formattedPrice}</div>
          </div>


          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Sub-Total</span>
              <span className="font-semibold">{formattedPrice}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <div className="text-right">
                <div className="text-xs text-gray-500 font-normal">USD</div>
                <div>{formattedPrice}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
