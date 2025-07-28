import Hero from "./_components/hero-section/Hero";
import PopularPackage from "./_components/popular-packages/PopularPackage";
import WhyChooseUs from "./_components/why-choose-us/WhyChooseUs";
import PopularCars from "./_components/popular-cars/PopularCars";
import Manager from "./_components/manager-section/Manager";
import { getHeaders } from "@/lib/users-provider";
export default async function Home() {
  const headers = await getHeaders();
  return (
    <div>
      <Hero />
      <PopularPackage headers={headers} />
      <WhyChooseUs />
      <PopularCars headers={headers} />
      <Manager />
    </div>
  );
}
