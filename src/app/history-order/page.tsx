import { useGetBookingHistory } from "@/hooks/bookings.hook";
import { useGetTravelPackagesDetailHistory, useGetCarsDetailHistory  } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/constants/booking-status";

import { Calendar, MapPin, Clock, Users, Car, CreditCard, TreePalm } from "lucide-react";
import { HistoryPagination } from "./_components/history-pagination";
import { BookingActions } from "./_components/booking-actions";
import Image from "next/image";
import Footer from "@/components/shared/content/footer";
import Link from "next/link";


export default async function HistoryPage({ searchParams }: {searchParams: Promise<{
  page?: string;
}>}) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;

  // Fetch booking history on server
  const response = await useGetBookingHistory(currentPage, limit);

  // Handle error response
  if ('errors' in response) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-destructive text-lg mb-2">Error Loading History</div>
          <div className="text-muted-foreground">{response.errors.message}</div>
        </div>
      </div>
    );
    
  }

  const { data: bookings, meta } = response;

  // Fetch package and car data for bookings
  const enrichedBookings = await Promise.all(
    bookings.map(async (booking) => {
      let packageName = null;
      let carName = null;

      // Fetch package data if package_id exists
      if (booking.package_id) {
        try {
          const packageResponse = await useGetTravelPackagesDetailHistory(booking.package_id);
          if ('data' in packageResponse) {
            packageName = packageResponse.data.package_name;
          }
        } catch (error) {
          console.error(`Error fetching package ${booking.package_id}:`, error);
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

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toUpperCase()) {
      case BookingStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case BookingStatus.ONGOING:
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case BookingStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      case BookingStatus.WAITING_PAYMENT:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case BookingStatus.WAITING_CONFIRMATION:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case BookingStatus.NO_SHOW:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case BookingStatus.PAYMENT_FAILED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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


  return (
    <>
    
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
            <h1 className="text-3xl md:text-5xl font-bold mb-4">History Order</h1>
            <p className="text-lg md:text-xl opacity-90">
              View and manage your bookings and rental history
            </p>
          </div>
        </div>
      </section>
      
    <div className="container mx-auto px-4 py-8">
      {enrichedBookings.length === 0 ? (
        <div className="text-center py-12">
          <TreePalm className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
          <p className="text-muted-foreground">
            You haven't made any bookings yet. Start exploring our services!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {enrichedBookings.map((booking) => (
              <Link key={booking.id} href={`/history-order/${booking.id}`}>
                <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {booking.package_id ? (
                            <TreePalm className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Car className="h-5 w-5 text-green-600" />
                          )}
                          {getBookingTitle(booking)}
                        </CardTitle>
                        {(booking.packageName || booking.carName) && (
                          <p className="text-xs text-muted-foreground">
                            Order #{booking.id}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Placed on {formatDate(booking.created_at)}
                        </p>
                      </div>
                      <Badge className={`${getStatusBadgeClass(booking.status)} px-3 py-1.5 text-sm font-medium`}>
                        {formatStatusText(booking.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Booking Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Start Date</p>
                          <p className="text-sm">{formatDate(booking.start_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">End Date</p>
                          <p className="text-sm">{formatDate(booking.end_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Pickup Location</p>
                          <p className="text-sm">{booking.pickup_location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Pickup Time</p>
                          <p className="text-sm">{booking.pickup_time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {booking.number_of_persons && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.number_of_persons} persons</span>
                        </div>
                      )}
                      
                      {booking.with_driver && (
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span>With Driver</span>
                        </div>
                      )}
                      
                      {booking.payments && booking.payments.length > 0 && (
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.payments[0].payment_method}</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Notes */}
                    {booking.additional_notes && (
                      <div className="border-t pt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Additional Notes</p>
                        <p className="text-sm">{booking.additional_notes}</p>
                      </div>
                    )}

                    {/* Total Price */}
                    <div className="border-t pt-3 flex justify-between items-center">
                      <span className="font-medium">Total Price:</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(booking.total_price)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <BookingActions bookingId={booking.id} status={booking.status} />
                  </div>
                </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <HistoryPagination meta={meta} currentPage={currentPage} />
          )}
        </>
      )}
    </div>
    <Footer />
      </>
  );
}