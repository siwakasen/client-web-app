import { useGetBookingHistory } from "@/hooks/bookings.hook";
import { Booking, BookingHistoryResponse } from "@/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Car, Package, CreditCard } from "lucide-react";
import { HistoryPagination } from "./_components/history-pagination";

interface HistoryPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
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

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'success';
      case 'COMPLETED':
        return 'success';
      case 'ONGOING':
        return 'default';
      case 'WAITING_PAYMENT':
      case 'WAITING_CONFIRMATION':
        return 'secondary';
      case 'CANCELLED':
      case 'NO_SHOW':
      case 'PAYMENT_FAILED':
        return 'destructive';
      default:
        return 'outline';
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
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking History</h1>
        <p className="text-muted-foreground">
          View and manage your past bookings and reservations
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
          <p className="text-muted-foreground">
            You haven't made any bookings yet. Start exploring our services!
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="w-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {booking.package_id ? (
                          <Package className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Car className="h-5 w-5 text-green-600" />
                        )}
                        Order #{booking.id}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {formatDate(booking.created_at)}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(booking.status)}>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <HistoryPagination meta={meta} currentPage={currentPage} />
          )}
        </>
      )}
    </div>
  );
}