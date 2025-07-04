import MainContent from "./_components/main-content";
import Image from "next/image";
import { fetchTravelPackages } from "@/_services/travel-packages";
import Navbar from "@/components/navbar/Navbar";
import Footer from "./_components/footer";
import { unstable_cacheLife as cacheLife } from "next/cache";

export default async function TourPackagesPage() {
  "use cache";
  cacheLife("hours");
  const { data, meta } = await fetchTravelPackages({
    limit: 20,
    page: 1,
    search: "",
  });

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar />
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
              Bali our Package
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Explore the best tour packages in Bali
            </p>
          </div>
        </div>
      </section>

      <MainContent tourPackages={data} meta={meta} />
      <Footer />
    </div>
  );
}
