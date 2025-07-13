import MainContent from "./_components/main-content";
import Image from "next/image";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "../../components/shared/content/footer";
import { Car, Meta, Customer } from "@/_interfaces";
import { getToken, hasSession } from "@/lib/session";
import { getHeaders } from "@/lib";
import { useGetCustomer, useGetCars } from "@/_hooks";
export default async function RentCarsPage() {
  const headers = await getHeaders();
  let isAuthenticated = await hasSession();
  let customer: Customer;
  try {
    if (isAuthenticated) {
      const token = await getToken();
      const header = await getHeaders();
      const { data } = await useGetCustomer(token!, header);
      customer = data;
    }
  } catch (error) {
    isAuthenticated = false;
  }
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
    const { data, meta: metaData } = await useGetCars(
      {
        limit: 6,
        page: 1,
        search: "",
      },
      headers
    );
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
