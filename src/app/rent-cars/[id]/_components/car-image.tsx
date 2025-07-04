import Image from "next/image";
import { convertCarImageUrl } from "@/_helpers/images-url/car-images";
import React from "react";

interface CarImageProps {
  image: string;
  alt: string;
  className?: string;
}

const CarImage: React.FC<CarImageProps> = ({ image, alt, className = "" }) => {
  if (!image) {
    return (
      <div
        className={`relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-200 ${className}`}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          No image available
        </div>
      </div>
    );
  }
  return (
    <div className={`relative ${className}`}>
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={convertCarImageUrl(image)}
          alt={`${alt} - Image`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default CarImage;
