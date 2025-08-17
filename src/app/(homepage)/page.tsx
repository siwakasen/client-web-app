'use cache';
import Hero from './_components/hero-section/Hero';
import PopularPackage from './_components/popular-packages/PopularPackage';
import WhyChooseUs from './_components/why-choose-us/WhyChooseUs';
import PopularCars from './_components/popular-cars/PopularCars';
import Manager from './_components/manager-section/Manager';
export default async function Home() {
  return (
    <div>
      <Hero />
      <PopularPackage />
      <WhyChooseUs />
      <PopularCars />
      <Manager />
    </div>
  );
}
