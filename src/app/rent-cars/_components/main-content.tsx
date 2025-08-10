"use client";
import { Car, Meta } from "@/interfaces";
import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CarsCard } from "./cars-card";
import { Pagination } from "../../../components/shared/content/pagination";
import { SkeletonCard } from "@/components/shared/skeleton/skeleton-card";
import { useGetCars } from "@/hooks";

interface CarsProps {
  cars: Car[];
  meta: Meta;
}
export default function MainContent({
  cars: initialCars,
  meta: initialMeta,
}: CarsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState(initialCars);
  const [meta, setMeta] = useState(initialMeta);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      const { data, meta: newMeta } = await useGetCars({
        limit: 6,
        page: currentPage,
        search: debouncedSearchTerm,
      });
      setCars(data);
      setMeta(newMeta);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearchTerm]);

  const filteredCars = useMemo(() => {
    return cars.filter((car: Car) => {
      const matchesMaxPrice =
        !maxPrice || car.price_per_day <= Number.parseInt(maxPrice);
      const matchesGroupSize =
        !maxGroupSize || car.max_persons >= Number.parseInt(maxGroupSize);

      return matchesMaxPrice && matchesGroupSize;
    });
  }, [maxPrice, maxGroupSize, cars]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search cars..."
                className="pl-10 h-12 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => (
                <CarsCard key={car.id} car={car} />
              ))}
            </div>
            {filteredCars.length === 0 && (
              <>
                <div className="text-center py-3">
                  <p className="text-gray-500 text-md">
                    No cars available or not matching your criteria.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </>
            )}
            {filteredCars.length > 0 && (
              <Pagination
                meta={meta}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        </div>
      </div>
    </>
  );
}
