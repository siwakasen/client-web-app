import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import { TravelPackages } from "@/interfaces";

interface OrderSummaryProps {
  packageData: TravelPackages;
  numberOfPersons: number;
}

export function OrderSummary({
  packageData,
  numberOfPersons,
}: OrderSummaryProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "USD",
  }).format(packageData.package_price);

  const totalPrice = packageData.package_price * numberOfPersons;
  const formattedTotalPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "USD",
  }).format(totalPrice);

  return (
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
            <p className="text-sm text-gray-500">
              Duration Trip: {packageData.duration} hours
            </p>
          </div>
          <div className="text-right font-semibold">{formattedPrice}</div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>
              Sub-Total ({numberOfPersons}{" "}
              {numberOfPersons > 1 ? "persons" : "person"})
            </span>
            <span className="font-semibold">{formattedTotalPrice}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <div className="text-right">
              <div className="text-xs text-gray-500 font-normal">USD</div>
              <div>{formattedTotalPrice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
