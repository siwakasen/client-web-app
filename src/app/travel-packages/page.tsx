import MainContent from "./_components/main-content";
import Image from "next/image";
import Navbar from "@/components/shared/navbar/Navbar";
import Footer from "../../components/shared/content/footer";
import { Meta, TravelPackages, Customer } from "@/interfaces";
import { getToken, hasSession } from "@/lib/session";
import { getCustomer } from "@/services/customers";
import { getHeaders } from "@/lib";
import { useGetTravelPackages } from "@/hooks";

export default async function TourPackagesPage() {
  const headers = await getHeaders();
  let isAuthenticated = await hasSession();
  let token: string = "";
  let customer: Customer;
  try {
    if (isAuthenticated) {
      token = (await getToken()) || "";
      const header = await getHeaders();
      const { data } = await getCustomer(token, header);
      customer = data;
    }
  } catch (error) {}
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
    const { data, meta: metaData } = await useGetTravelPackages(
      {
        limit: 6,
        page: 1,
        search: "",
      },
      headers
    );
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
