'use client';

import { useEffect, useState } from 'react';
import { useGetBookingHistory } from '@/hooks/bookings.hook';
import {
  useGetTravelPackagesDetailHistory,
  useGetCarsDetailHistory,
} from '@/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/constants/booking-status';
import {
  Calendar,
  MapPin,
  UserRound,
  Car,
  TreePalm,
  IdCardLanyardIcon,
  NotebookIcon,
} from 'lucide-react';
import { HistoryPagination } from './history-pagination';
import { BookingActions } from './booking-actions';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Booking, BookingAdjustment, Meta, RequestType } from '@/interfaces';

interface BookingListProps {
  currentPage: number;
  limit: number;
}

// Skeleton component for loading state
function BookingSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Middle: Booking Details Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="mb-3 md:mb-2">
              <div className="flex items-center gap-2 mb-3 md:mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>

            {/* Info Grid Skeleton */}
            <div className="space-y-3 md:space-y-1 mb-4 md:mb-0">
              <div className="flex items-center gap-3 md:gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3 md:gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3 md:gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* Additional Notes Skeleton */}
            <div className="mt-3 md:mt-2 mb-4 md:mb-0">
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          {/* Right: Pricing and Actions Skeleton */}
          <div className="flex flex-col items-center md:items-end gap-4 md:gap-3 flex-shrink-0 w-full md:w-auto">
            <div className="text-center md:text-right w-full md:w-auto">
              <div className="border-t md:border-t-0 pt-3 md:pt-0">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BookingList({ currentPage, limit }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [meta, setMeta] = useState<Meta>({
    totalPages: 0,
    totalItems: 0,
    currentPage: 0,
    limit: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch booking history
      const response = await useGetBookingHistory(currentPage, limit);

      if ('errors' in response) {
        setError(response.errors.message);
        return;
      }

      const { data: bookingsData, meta: metaData } = response;
      setMeta(metaData);

      // Fetch package and car data for bookings
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking: Booking) => {
          let packageName = null;
          let carName = null;

          // Fetch package data if package_id exists
          if (booking.package_id) {
            try {
              const packageResponse = await useGetTravelPackagesDetailHistory(
                booking.package_id
              );
              if ('data' in packageResponse) {
                packageName = packageResponse.data.package_name;
              }
            } catch (error) {
              console.error(
                `Error fetching package ${booking.package_id}:`,
                error
              );
            }
          }

          // Fetch car data if car_id exists
          if (booking.car_id) {
            try {
              const carResponse = await useGetCarsDetailHistory(booking.car_id);
              if ('data' in carResponse) {
                carName = carResponse.data.car_name;
              }
            } catch (error) {
              console.error(`Error fetching car ${booking.car_id}:`, error);
            }
          }

          return {
            ...booking,
            packageName,
            carName,
          };
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, limit]);

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case BookingStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case BookingStatus.ONGOING:
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case BookingStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      case BookingStatus.WAITING_PAYMENT:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case BookingStatus.WAITING_CONFIRMATION:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case BookingStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case BookingStatus.PAYMENT_FAILED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const formatStatusText = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'WAITING_PAYMENT':
        return 'Waiting Payment';
      case 'WAITING_CONFIRMATION':
        return 'Waiting Confirmation';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'ONGOING':
        return 'Ongoing';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'NO_SHOW':
        return 'No Show';
      case 'PAYMENT_FAILED':
        return 'Payment Failed';
      default:
        return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
    }
  };

  const getBookingTitle = (booking: any) => {
    if (booking.packageName) {
      return booking.packageName;
    }
    if (booking.carName) {
      return booking.carName;
    }
    return `Order #${booking.id}`;
  };

  if (loading) {
    return (
      <div className="grid gap-6">
        {Array.from({ length: limit }).map((_, index) => (
          <BookingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive text-lg mb-2">
          Error Loading History
        </div>
        <div className="text-muted-foreground">{error}</div>
        <button
          onClick={fetchBookings}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <TreePalm className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
        <p className="text-muted-foreground">
          You haven't made any bookings yet. Start exploring our services!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <a key={booking.id} href={`/history-order/${booking.id}`}>
            <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer py-0">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Middle: Booking Details */}
                  <div className="flex-1 min-w-0 text-start md:text-left">
                    <div className="mb-3 md:mb-2">
                      <div className="flex items-center gap-2 mb-3 md:mb-2">
                        <Badge
                          className={`px-3 py-1.5 text-sm flex items-center gap-1 ${
                            booking.package_id
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {booking.package_id ? (
                            <>
                              <TreePalm className="h-3 w-3" />
                              Travel
                            </>
                          ) : (
                            <>
                              <Car className="h-3 w-3" />
                              Rental Car
                            </>
                          )}
                        </Badge>
                        <Badge
                          className={`${getStatusBadgeClass(
                            booking.status
                          )} px-3 py-1.5 text-sm`}
                        >
                          {formatStatusText(booking.status)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-xl md:text-lg truncate mb-2 md:mb-1">
                        {getBookingTitle(booking)}
                      </h3>
                      <p className="text-sm md:text-xs text-muted-foreground">
                        Order #{booking.id} • {formatDate(booking.created_at)}
                      </p>
                    </div>

                    {/* Compact Info Grid - Mobile optimized */}
                    <div className="space-y-3 md:space-y-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-3 md:gap-2 justify-center md:justify-start">
                        <Calendar className="h-4 w-4 md:h-3 md:w-3 text-muted-foreground" />
                        <span className="text-sm md:text-sm">
                          {formatDate(booking.start_date)} -{' '}
                          {formatDate(booking.end_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 md:gap-2 justify-start md:justify-start">
                        <MapPin className="h-4 w-4 md:h-3 md:w-3 text-muted-foreground" />
                        <span className="text-sm md:text-sm">
                          {booking.pickup_location}
                        </span>
                      </div>

                      {booking.number_of_persons && (
                        <div className="flex items-center gap-3 md:gap-2 justify-start md:justify-start">
                          <UserRound className="h-4 w-4 md:h-3 md:w-3 text-muted-foreground" />
                          <span className="text-sm md:text-sm">
                            {booking.number_of_persons} persons
                          </span>
                        </div>
                      )}

                      {booking.with_driver !== null && (
                        <div className="flex items-center gap-3 md:gap-2 justify-start md:justify-start">
                          <IdCardLanyardIcon className="h-4 w-4 md:h-3 md:w-3 text-muted-foreground" />
                          <span className="text-sm md:text-sm">
                            {booking.with_driver
                              ? 'With Driver'
                              : 'Without Driver'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Additional Notes - Only if exists */}
                    {booking.additional_notes && (
                      <div className="flex items-center gap-3 md:gap-2 justify-start md:justify-start">
                        <NotebookIcon className="h-4 w-4 md:h-3 md:w-3 text-muted-foreground" />
                        <span className="text-sm md:text-sm">
                          {booking.additional_notes}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Pricing and Actions */}
                  <div className="flex flex-col items-center md:items-end gap-4 md:gap-3 flex-shrink-0 w-full md:w-auto">
                    <div className="text-center md:text-right w-full md:w-auto">
                      <div className="border-t md:border-t-0 pt-3 md:pt-0">
                        <p className="text-sm md:text-xs text-muted-foreground mb-1">
                          Total Price
                        </p>
                        <p className="text-2xl md:text-xl font-bold text-primary">
                          {formatCurrency(booking.total_price)}
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto">
                      <BookingActions
                        bookingId={booking.id}
                        status={booking.status}
                        refetch={fetchBookings}
                        isRequestingCancel={booking.booking_adjustments.some(
                          (adjustment: BookingAdjustment) =>
                            adjustment.request_type === RequestType.CANCELLATION
                        )}
                        isRequestingReschedule={booking.booking_adjustments.some(
                          (adjustment: BookingAdjustment) =>
                            adjustment.request_type === RequestType.RESCHEDULE
                        )}
                        payment_method={booking.payments[0].payment_method}
                        payment_gateway_id={
                          booking.payments[0].payment_gateway_id
                        }
                        isCarRental={!booking.package_id}
                        currentStartDate={booking.start_date}
                        currentEndDate={booking.end_date}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <HistoryPagination meta={meta} currentPage={currentPage} />
      )}
    </>
  );
}
