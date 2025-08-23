import { Separator } from '@/components/ui/separator';
import { Car as CarIcon } from 'lucide-react';
import { Car } from '@/interfaces';

interface OrderSummaryProps {
  carData: Car;
  days: number;
  withDriver: boolean;
}

export function OrderSummary({ carData, days, withDriver }: OrderSummaryProps) {
  const basePrice = carData.price_per_day;
  const driverPrice = withDriver ? 10 : 0; // Driver cost per day
  const dailyTotal = basePrice + driverPrice;
  const totalPrice = dailyTotal * days;

  const formattedBasePrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'USD',
  }).format(basePrice);

  const formattedDriverPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'USD',
  }).format(driverPrice);

  const formattedTotalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'USD',
  }).format(totalPrice);

  return (
    <div className="p-6 md:p-8 ">
      <div className="space-y-6">
        {/* Car Details */}
        <div className="flex gap-4 items-start">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CarIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{carData.car_name}</h3>
            <p className="text-sm text-gray-500">
              {carData.transmission} • {carData.car_color} • Max{' '}
              {carData.max_persons} persons
            </p>
          </div>
          <div className="text-right font-semibold">
            {formattedBasePrice}/day
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>
              Car rental ({days} {days > 1 ? 'days' : 'day'})
            </span>
            <span className="font-semibold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'USD',
              }).format(basePrice * days)}
            </span>
          </div>

          {withDriver && (
            <div className="flex justify-between">
              <span>
                Driver service ({days} {days > 1 ? 'days' : 'day'})
              </span>
              <span className="font-semibold">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'USD',
                }).format(driverPrice * days)}
              </span>
            </div>
          )}

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
