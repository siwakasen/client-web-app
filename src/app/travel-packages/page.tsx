import MainContent from "./_components/main-content";
import Image from "next/image";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "@/components/shared/content/footer";

import { Meta, TravelPackages } from "@/interfaces";
import { useGetTravelPackages } from "@/hooks";
import { useGetCustomer } from "@/hooks/customer.hook";

export default async function TourPackagesPage() {
  const { isAuthenticated, customer } = await useGetCustomer();
  let travelPackages: TravelPackages[] = [];
  let metaPackages: Meta = {
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  };
  try {
    const { data, meta: metaData } = await useGetTravelPackages({
      limit: 6,
      page: 1,
      search: "",
    });
    travelPackages = data;
    metaPackages = metaData;
  } catch (error) {
    console.log("Error fetching travel packages:", error);
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Travel Packages
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Explore the best tour packages in Bali
            </p>
          </div>
        </div>
      </section>

      <MainContent tourPackages={travelPackages} meta={metaPackages} />
      <Footer />
    </div>
  );
}
