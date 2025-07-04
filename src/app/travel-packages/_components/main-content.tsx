"use client";
import { Meta, TravelPackages } from "@/_interfaces/travel-packages.interface";
import { useState, useMemo, useEffect } from "react";
import { FilterSearch } from "./filter-search";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TourPackageCard } from "./packages-card";
import { Pagination } from "../../../components/shared/content/pagination";
import { fetchTravelPackages } from "@/_services/travel-packages";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/shared/skeleton/skeleton-card";

interface TourPackagesProps {
  tourPackages: TravelPackages[];
  meta: Meta;
}
export default function MainContent({
  tourPackages: initialTourPackages,
  meta: initialMeta,
}: TourPackagesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tourPackages, setTourPackages] = useState(initialTourPackages);
  const [meta, setMeta] = useState(initialMeta);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when page or debounced search changes
  useEffect(() => {
    // must change to ssr
    const fetchData = async () => {
      try {
        const { data, meta: newMeta } = await fetchTravelPackages({
          limit: 10,
          page: currentPage,
          search: debouncedSearchTerm,
        });
        setTourPackages(data);
        setMeta(newMeta);
      } catch (error) {
        // TOAST ERROR
      }
    };

    fetchData();
  }, [currentPage, debouncedSearchTerm]);

  const filteredPackages = useMemo(() => {
    return tourPackages.filter((pkg: TravelPackages) => {
      const matchesMaxPrice =
        !maxPrice || pkg.package_price <= Number.parseInt(maxPrice);
      const matchesGroupSize =
        !maxGroupSize || pkg.max_persons <= Number.parseInt(maxGroupSize);

      return matchesMaxPrice && matchesGroupSize;
    });
  }, [maxPrice, maxGroupSize, tourPackages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset to top of page when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 md:gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <FilterSearch
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              maxGroupSize={maxGroupSize}
              setMaxGroupSize={setMaxGroupSize}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar for Desktop */}
            <div className=" mb-6 ">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search packages..."
                  className="pl-10 h-12 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Tour Package Cards */}
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                {filteredPackages.map((pkg) => (
                  <TourPackageCard key={pkg.id} travelPackage={pkg} />
                ))}
              </div>
              {filteredPackages.length === 0 && (
                <>
                  <div className="text-center py-3">
                    <p className="text-gray-500 text-md">
                      No travel packages available or not matching your
                      criteria.
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
              {/* Pagination */}
              {filteredPackages.length > 0 && (
                <Pagination
                  meta={meta}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
}
