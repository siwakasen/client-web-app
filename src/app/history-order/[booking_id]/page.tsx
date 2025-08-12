import { useGetBookingById, useGetTravelPackagesDetailHistory } from "@/hooks";
import { useGetCarsDetailHistory } from "@/hooks/cars.hook";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { convertCarImageUrl, convertTravelImageUrl } from "@/helpers/images-url";

export default async function HistoryOrderDetailPage({
  params,
}: {
  params: Promise<{ booking_id: string }>;
}) {
  const { booking_id } = await params;

  const response = await useGetBookingById(booking_id);
  if('errors' in response) {
    redirect("/history-order");
  }

  if(!('data' in response)) {
    redirect("/history-order");
  }

  const booking = response.data;
  
  // Fetch package or car details based on the booking
  let packageData = null;
  let carData = null;
  
  if (booking.package_id) {
    try {
      const packageResponse = await useGetTravelPackagesDetailHistory(booking.package_id);
      if ('data' in packageResponse) {
        packageData = packageResponse.data;
      }
    } catch (error) {
      console.error("Error fetching package details:", error);
    }
  }
  
  if (booking.car_id) {
    try {
      const carResponse = await useGetCarsDetailHistory(booking.car_id);
      if ('data' in carResponse) {
        carData = carResponse.data;
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
        <p className="text-gray-600">Booking ID: #{booking.id}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Booking Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Booking Information
              <Badge variant={getStatusVariant(booking.status)}>
                {booking.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <span className="font-medium text-gray-700">Order Date:</span>
                <p className="text-gray-900">{formatDateTime(booking.created_at)}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-900">
                  {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                </p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Number of Persons:</span>
                <p className="text-gray-900">{booking.number_of_persons} person(s)</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Pickup Location:</span>
                <p className="text-gray-900">{booking.pickup_location}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Pickup Time:</span>
                <p className="text-gray-900">{booking.pickup_time}</p>
              </div>
              
              {booking.with_driver !== null && (
                <div>
                  <span className="font-medium text-gray-700">With Driver:</span>
                  <p className="text-gray-900">{booking.with_driver ? 'Yes' : 'No'}</p>
                </div>
              )}
              
              {booking.additional_notes && (
                <div>
                  <span className="font-medium text-gray-700">Additional Notes:</span>
                  <p className="text-gray-900">{booking.additional_notes}</p>
                </div>
              )}
              
              <div className="pt-3 border-t">
                <span className="font-medium text-gray-700">Total Price:</span>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(booking.total_price)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            {booking.payments && booking.payments.length > 0 ? (
              <div className="space-y-3">
                {booking.payments.map((payment, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Payment #{payment.id}</span>
                      <Badge variant={getStatusVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Method: {payment.payment_method}</p>
                      <p>Gross Amount: {formatCurrency(payment.gross_amount)}</p>
                      <p>Net Amount: {formatCurrency(payment.net_amount)}</p>
                      <p>Payment Date: {payment.payment_date ? formatDateTime(payment.payment_date) : 'N/A'}</p>
                      <p>Created: {formatDateTime(payment.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No payment information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Package or Car Details */}
      {(packageData || carData) && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              {packageData ? 'Travel Package Details' : 'Car Rental Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {packageData && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{packageData.package_name}</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Duration:</span> {packageData.duration} days</p>
                      <p><span className="font-medium">Max Persons:</span> {packageData.max_persons}</p>
                      <p><span className="font-medium">Price:</span> {formatCurrency(packageData.package_price)}</p>
                    </div>
                  </div>
                  {packageData.images && packageData.images.length > 0 && (
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={convertTravelImageUrl(packageData.images[0])}
                        alt={packageData.package_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="text-gray-700">{packageData.description}</p>
                </div>
                
                {packageData.itineraries && packageData.itineraries.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Itinerary:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {packageData.itineraries.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {packageData.includes && packageData.includes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Includes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {packageData.includes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {carData && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{carData.car_name}</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Color:</span> {carData.car_color}</p>
                      <p><span className="font-medium">Police Number:</span> {carData.police_number}</p>
                      <p><span className="font-medium">Transmission:</span> {carData.transmission}</p>
                      <p><span className="font-medium">Max Persons:</span> {carData.max_persons}</p>
                      <p><span className="font-medium">Price per Day:</span> {formatCurrency(carData.price_per_day)}</p>
                    </div>
                  </div>
                  {carData.car_image && (
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={convertCarImageUrl(carData.car_image)}
                        alt={carData.car_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description:</h4>
                  <p className="text-gray-700">{carData.description}</p>
                </div>
                
                {carData.includes && carData.includes.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Includes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {carData.includes.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}