import type React from 'react';
import type { Car } from '@/interfaces';
import { convertCarImageUrl } from '@/helpers/images-url/car-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface CarsCardProps {
  car: Car;
  start_date: string;
  end_date: string;
  averageRating?: number;
  ratingCount?: number;
}

export {};

export const CarsCard: React.FC<CarsCardProps> = ({
  car,
  start_date,
  end_date,
  averageRating,
  ratingCount,
}) => {
  return (
    <Link
      href={`/rent-cars/${car.id}?start_date=${start_date}&end_date=${end_date}`}
      className="hover:scale-103 transition-all duration-300 "
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden  h-full flex flex-col">
        <img
          src={convertCarImageUrl(car.car_image || '')}
          alt={car.car_name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-md">
              {car.car_name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{car.description}</p>
            {/* Average Rating Display */}
            <div className="mt-2 flex items-center gap-1">
              {averageRating !== undefined ? (
                <>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-700">
                    {ratingCount && ratingCount > 0
                      ? `${averageRating.toFixed(1)} | (${ratingCount} reviews)`
                      : 'No reviews'}
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-400">...</span>
              )}
            </div>
          </div>
          <div className="mt-auto p-4 flex items-center justify-between bg-gray-100 border-gray-200 border-1  rounded-lg">
            <span className="text-gray-700 font-medium">
              $ {car.price_per_day}/day
            </span>
            <Button className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded cursor-pointer">
              Rent Now
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
