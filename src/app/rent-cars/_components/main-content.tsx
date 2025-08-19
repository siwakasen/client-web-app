'use client';
import { Car, Meta } from '@/interfaces';
import { useState, useMemo, useEffect } from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CarsCard } from './cars-card';
import { Pagination } from '../../../components/shared/content/pagination';
import { SkeletonCard } from '@/components/shared/skeleton/skeleton-card';
import { useGetAvailableCars } from '@/hooks';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useRouter, useSearchParams } from 'next/navigation';

interface MainContentProps {
  initialStartDate?: string;
  initialEndDate?: string;
  initialSearch?: string;
}

export default function MainContent({
  initialStartDate,
  initialEndDate,
  initialSearch,
}: MainContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch || '');
  const [startDate, setStartDate] = useState<string | undefined>(
    initialStartDate
  );
  const [endDate, setEndDate] = useState<string | undefined>(initialEndDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [cars, setCars] = useState<Car[]>([]);
  const [meta, setMeta] = useState<Meta>({
    currentPage: 1,
    totalItems: 0,
    totalPages: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Function to update URL parameters
  const updateUrlParams = (params: {
    start_date?: string;
    end_date?: string;
    search?: string;
  }) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });

    // Create new URL with updated params
    const search = current.toString();
    const query = search ? `?${search}` : '';

    router.push(`/rent-cars${query}`, { scroll: false });
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setCars([]);
      return;
    }

    try {
      setIsLoading(true);
      const { data, meta: newMeta } = await useGetAvailableCars({
        limit: 10,
        page: currentPage,
        search: searchTerm,
        start_date: startDate,
        end_date: endDate,
      });
      setCars(data);
      setMeta(newMeta);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCars = useMemo(() => {
    return cars;
  }, [cars]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateRangeChange = (
    start: string | undefined,
    end: string | undefined
  ) => {
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);

    // Update URL parameters
    updateUrlParams({
      start_date: start,
      end_date: end,
      search: searchTerm,
    });
  };

  const handleApply = () => {
    fetchData();
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setCars([]);
    setCurrentPage(1);

    // Clear URL parameters
    updateUrlParams({
      start_date: undefined,
      end_date: undefined,
      search: searchTerm,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    // Update URL parameters with search term
    updateUrlParams({
      start_date: startDate,
      end_date: endDate,
      search: value,
    });
  };

  // Fetch data when component mounts with initial parameters or when page changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [currentPage]);

  // Fetch data on initial load if dates are provided
  useEffect(() => {
    if (initialStartDate && initialEndDate) {
      fetchData();
    }
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Date Range Picker */}
          <div className="mb-8">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
              onApply={handleApply}
              onClear={handleClear}
              label="Choose your rental dates"
              className="bg-white shadow-lg"
            />
          </div>

          {/* Show content only when dates are selected */}
          {startDate && endDate && (
            <>
              {/* Search Bar */}
              <div className="mb-6">
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1 ">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search cars..."
                      className="pl-10 h-12 bg-white"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          fetchData();
                        }
                      }}
                    />
                  </div>
                  <Button
                    onClick={fetchData}
                    className="h-11 px-4 bg-slate-900 hover:bg-slate-900 text-white cursor-pointer"
                    disabled={!startDate || !endDate || isLoading}
                  >
                    <Search className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Cars Grid */}
              <>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredCars.map((car) => (
                        <CarsCard
                          key={car.id}
                          car={car}
                          start_date={startDate}
                          end_date={endDate}
                        />
                      ))}
                    </div>
                    {filteredCars.length === 0 && (
                      <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No cars available
                          </h3>
                          <p className="text-gray-500">
                            No cars are available for the selected dates. Please
                            try different dates.
                          </p>
                        </div>
                      </div>
                    )}
                    {filteredCars.length > 0 && (
                      <Pagination
                        meta={meta}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </>
            </>
          )}

          {/* Show message when no dates selected */}
          {(!startDate || !endDate) && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select your rental dates
                </h3>
                <p className="text-gray-500">
                  Please select both pick-up and drop-off dates to view
                  available cars.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
