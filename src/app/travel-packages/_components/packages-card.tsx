import type React from 'react';
import type { TravelPackages } from '@/interfaces';
import { convertTravelImageUrl } from '@/helpers/images-url/travel-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface TourPackageCardProps {
  travelPackage: TravelPackages;
  averageRating?: number;
  ratingCount?: number;
}

export const TourPackageCard: React.FC<TourPackageCardProps> = ({
  travelPackage,
  averageRating,
  ratingCount,
}) => {
  return (
    <Link
      href={`/travel-packages/${travelPackage.id}`}
      className="hover:scale-103 transition-all duration-300 "
    >
      {/* 1. Add `h-full`, `flex`, and `flex-col` */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden  h-full flex flex-col">
        <img
          src={convertTravelImageUrl(travelPackage.images?.[0] || '')}
          alt={travelPackage.package_name}
          className="w-full h-48 object-cover"
        />
        {/* 2. Add `flex`, `flex-col`, and `flex-grow` to the content wrapper */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-md">
              {travelPackage.package_name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {travelPackage.description.split(' ').slice(0, 40).join(' ')}
              {travelPackage.description.split(' ').length > 40 && '...'}
            </p>
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
          {/* 3. Add `mt-auto` to push the price to the bottom */}
          <div className="mt-auto p-4 flex items-center justify-between bg-gray-100 border-gray-200 border-1  rounded-lg">
            <span className="text-gray-700 font-medium">
              $ {travelPackage.package_price}/person
            </span>
            <Button className="bg-slate-700 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded cursor-pointer">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
