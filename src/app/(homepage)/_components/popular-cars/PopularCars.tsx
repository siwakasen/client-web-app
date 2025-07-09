"use cache";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import ContentDivider from "../content-divider/ContentDivider";
import { convertCarImageUrl } from "@/_helpers/images-url/car-images";
import { SkeletonCard } from "@/components/shared/skeleton/skeleton-card";
import { Car } from "@/_interfaces/rent-car.interface";
import Link from "next/link";
import { useGetCars } from "@/_hooks/rent-cars/cars.hook";

export default async function PopularCars({
  headers,
}: {
  headers: Record<string, string>;
}) {
  let cars: Car[] = [];
  try {
    const { data } = await useGetCars(
      {
        limit: 2,
        page: 1,
        search: "",
      },
      headers
    );
    cars = data;
  } catch (error) {
    // TOAST ERROR
  }

  // Use the actual data from the API response
  const carsData = cars.map((car) => ({
    id: car.id,
    title: car.car_name,
    image:
      car.car_image && car.car_image.length > 0
        ? convertCarImageUrl(car.car_image)
        : "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: car.car_name,
  }));

  return (
    <section className="bg-gray-50 pt-16 px-4 md:px-8 min-h-fit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <ContentDivider
          titleClass={3}
          dividerText="Rent a Car"
          title1="High-quality car rentals"
          title2="that will take you to see the beauty of the world."
          description="Explore the best cars with our exclusive tour packages. Enjoy the beauty of these locations with our professional guides."
        />

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 w-full justify-between gap-8">
          {carsData.length > 0 ? (
            carsData.map((car) => (
              <Link href={`/rent-cars/${car.id}`} key={car.id}>
                <Card
                  key={car.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-0"
                >
                  <CardContent
                    className={`p-0 w-full h-80 md:h-96 md:min-w-2xl`}
                  >
                    <div className="relative h-full w-full">
                      <div className="relative w-full h-full overflow-hidden">
                        <Image
                          src={car.image}
                          alt={car.alt}
                          fill
                          priority={true}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-georgia text-2xl md:text-3xl font-bold text-white leading-tight">
                          {car.title}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="w-full text-center py-8 flex flex-row gap-4 justify-center">
              <div className="w-full">
                <SkeletonCard />
              </div>
              <div className="w-full">
                <SkeletonCard />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
