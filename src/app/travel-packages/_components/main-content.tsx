'use client';
import { Meta, TravelPackages } from '@/interfaces';
import { useState, useMemo, useEffect } from 'react';
import { FilterSearch } from './filter-search';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TourPackageCard } from './packages-card';
import { Pagination } from '../../../components/shared/content/pagination';
import { SkeletonCard } from '@/components/shared/skeleton/skeleton-card';
import { useGetTravelPackages } from '@/hooks';
import { useGetRatingsByTravelPackageId } from '@/hooks/rating.hook';

interface TourPackagesProps {
  tourPackages: TravelPackages[];
  meta: Meta;
}
export default function MainContent({
  tourPackages: initialTourPackages,
  meta: initialMeta,
}: TourPackagesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxGroupSize, setMaxGroupSize] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tourPackages, setTourPackages] = useState(initialTourPackages);
  const [meta, setMeta] = useState(initialMeta);
  const [packageRatings, setPackageRatings] = useState<
    Record<number, { averageRating: number; ratingCount: number }>
  >({});

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when page or debounced search changes
  const fetchData = async () => {
    try {
      const { data, meta: newMeta } = await useGetTravelPackages({
        limit: 6,
        page: currentPage,
        search: debouncedSearchTerm,
      });
      setTourPackages(data);
      setMeta(newMeta);

      // Clear previous ratings and fetch new ones
      setPackageRatings({});
      fetchPackageRatings(data);
    } catch (error: any) {}
  };

  // Fetch ratings for each package asynchronously
  const fetchPackageRatings = async (packages: TravelPackages[]) => {
    for (const pkg of packages) {
      try {
        const response = await useGetRatingsByTravelPackageId(pkg.id);
        if ('data' in response && response.data.averageRating !== undefined) {
          console.log('response', response.data);
          setPackageRatings((prev) => ({
            ...prev,
            [pkg.id]: {
              averageRating: response.data.averageRating,
              ratingCount: response.data.ratingsCount,
            },
          }));
        }
      } catch (error) {
        console.error(`Error fetching rating for package ${pkg.id}:`, error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearchTerm]);

  const filteredPackages = useMemo(() => {
    return tourPackages.filter((pkg: TravelPackages) => {
      const matchesMaxPrice =
        !maxPrice || pkg.package_price <= Number.parseInt(maxPrice);
      const matchesGroupSize =
        !maxGroupSize || pkg.max_persons >= Number.parseInt(maxGroupSize);

      return matchesMaxPrice && matchesGroupSize;
    });
  }, [maxPrice, maxGroupSize, tourPackages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset to top of page when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  <TourPackageCard
                    key={pkg.id}
                    travelPackage={pkg}
                    averageRating={packageRatings[pkg.id]?.averageRating}
                    ratingCount={packageRatings[pkg.id]?.ratingCount}
                  />
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
