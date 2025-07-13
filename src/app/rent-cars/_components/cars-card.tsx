import type React from "react";
import type { Car } from "@/_interfaces";
import { convertCarImageUrl } from "@/_helpers/images-url/car-images";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CarsCardProps {
  car: Car;
}

export {};

export const CarsCard: React.FC<CarsCardProps> = ({ car }) => {
  return (
    <Link
      href={`/rent-cars/${car.id}`}
      className="hover:scale-103 transition-all duration-300 "
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden  h-full flex flex-col">
        <img
          src={convertCarImageUrl(car.car_image || "")}
          alt={car.car_name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 text-md">
              {car.car_name}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{car.description}</p>
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
