import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import ContentDivider from "../content-divider/ContentDivider";
import { fetchCars } from "@/_services/rent-cars";
import { convertCarImageUrl } from "@/_helpers/images-url/car-images";
export default async function PopularCars() {
  const { data } = await fetchCars({
    limit: 2,
    page: 1,
    search: "",
  });

  // Use the actual data from the API response
  const packages = data.map((pkg) => ({
    id: pkg.id,
    title: pkg.car_name,
    image:
      pkg.car_image && pkg.car_image.length > 0
        ? convertCarImageUrl(pkg.car_image)
        : "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: pkg.car_name,
  }));

  return (
    <section className="bg-gray-50 px-16 py-16 md:px-8 min-h-fit">
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
        <div className="flex flex-col md:flex-row w-full justify-between gap-8">
          {packages.length > 0 ? (
            packages.map((pkg, index) => (
              <Card
                key={pkg.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-0"
              >
                <CardContent className={`p-0 w-full h-80 md:h-96 md:min-w-2xl`}>
                  <div className="relative h-full w-full">
                    <div className="relative w-full h-full overflow-hidden">
                      <Image
                        src={pkg.image}
                        alt={pkg.alt}
                        fill
                        priority={true}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-georgia text-2xl md:text-3xl font-bold text-white leading-tight">
                        {pkg.title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500">
                No travel packages available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
