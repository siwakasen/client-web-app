import MainContent from "./_components/main-content";
import Image from "next/image";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/content/footer";
import { Car, Meta } from "@/interfaces";

import { useGetCustomer, useGetCars } from "@/hooks";
export default async function RentCarsPage() {
  const { isAuthenticated, customer } = await useGetCustomer();
  let cars: Car[] = [];
  let meta: Meta = {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  };
  try {
    const { data, meta: metaData } = await useGetCars({
      limit: 6,
      page: 1,
      search: "",
    });
    cars = data;
    meta = metaData;
  } catch (error) {
    console.log("Error fetching cars:", error);
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar isAuthenticated={isAuthenticated} customer={customer!} />
      {/* Hero Section */}
      <section className="relative h-64 md:h-80">
        <Image
          src="/images/bali_1.jpg"
          priority
          alt="Bali landscape"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover "
        />
        <div className="absolute inset-0 " />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Car Rental</h1>
            <p className="text-lg md:text-xl opacity-90">
              Explore the best cars in Bali
            </p>
          </div>
        </div>
      </section>

      <MainContent cars={cars} meta={meta} />
      <Footer />
    </div>
  );
}
