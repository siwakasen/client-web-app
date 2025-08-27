import { useGetBookingById, useGetTravelPackagesDetailHistory } from '@/hooks';
import { useGetCarsDetailHistory } from '@/hooks/cars.hook';
import { useGetRefundsByIdBooking } from '@/hooks/refunds.hook';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingStatus } from '@/constants/booking-status';
import Image from 'next/image';
import { formatCurrency, convertISOToCurrentTimezone } from '@/lib/utils';
import {
  convertCarImageUrl,
  convertTravelImageUrl,
} from '@/helpers/images-url';
import { BookingActions } from './_components/booking-action';
import { PaymentAction } from './_components/payment-action';
import { AdjustmentStatus, BookingAdjustment } from '@/interfaces';
import { RequestType } from '@/interfaces';
import { RefundStepper } from './_components/refund-stepper';
import { RefundFormDialog } from './_components/refund-form-dialog';
import { RefundStatus } from '@/interfaces/refunds.interface';

export default async function HistoryOrderDetailPage({
  params,
}: {
  params: Promise<{ booking_id: string }>;
}) {
  const { booking_id } = await params;

  const response = await useGetBookingById(booking_id);
  if ('errors' in response) {
    redirect('/history-order');
  }

  if (!('data' in response)) {
    redirect('/history-order');
  }

  const booking = response.data;

  // Fetch refund data if there's a cancellation adjustment that's approved
  let refundData = null;
  const hasCancellationAdjustment = booking.booking_adjustments.some(
    (adjustment: BookingAdjustment) =>
      adjustment.request_type === RequestType.CANCELLATION &&
      adjustment.status === AdjustmentStatus.APPROVED
  );

  if (hasCancellationAdjustment) {
    try {
      const refundResponse = await useGetRefundsByIdBooking(Number(booking_id));
      if ('data' in refundResponse && refundResponse.data) {
        refundData = refundResponse.data;
      }
    } catch (error) {
      console.error('Error fetching refund details:', error);
    }
  }

  // Fetch package or car details based on the booking
  let packageData = null;
  let carData = null;

  if (booking.package_id) {
    try {
      const packageResponse = await useGetTravelPackagesDetailHistory(
        booking.package_id
      );
      if ('data' in packageResponse) {
        packageData = packageResponse.data;
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
    }
  }

  if (booking.car_id) {
    try {
      const carResponse = await useGetCarsDetailHistory(booking.car_id);
      if ('data' in carResponse) {
        carData = carResponse.data;
      }
    } catch (error) {
      console.error('Error fetching car details:', error);
    }
  }

  const getStatusAdjustmentBadgeClass = (status: string) => {
    switch (status) {
      case AdjustmentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case AdjustmentStatus.WAITING_PAYMENT:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case AdjustmentStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case AdjustmentStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case AdjustmentStatus.EXPIRED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatusText = (status: string) => {
    if (!status) return '';
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusBadgeClass = (status: string) => {
    const upperStatus = status?.toUpperCase();

    // Payment Status Colors
    if (upperStatus === 'PENDING') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm';
    }
    if (upperStatus === 'SUCCESS') {
      return 'bg-green-100 text-green-800 border-green-300 shadow-sm';
    }
    if (upperStatus === 'FAILED') {
      return 'bg-red-100 text-red-800 border-red-300 shadow-sm';
    }

    // Booking Status Colors
    switch (upperStatus) {
      case BookingStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm';
      case BookingStatus.ONGOING:
        return 'bg-cyan-100 text-cyan-800 border-cyan-300 shadow-sm';
      case BookingStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-300 shadow-sm';
      case BookingStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-300 shadow-sm';
      case BookingStatus.WAITING_PAYMENT:
        return 'bg-orange-100 text-orange-800 border-orange-300 shadow-sm';
      case BookingStatus.WAITING_CONFIRMATION:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-sm';
      case BookingStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800 border-gray-300 shadow-sm';
      case BookingStatus.PAYMENT_FAILED:
        return 'bg-red-100 text-red-800 border-red-300 shadow-sm';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 shadow-sm';
    }
  };

  const formatDateTimeLocale = (dateString: string): string => {
    if (!dateString) return '';
    const isoMatch = dateString.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/
    );
    if (!isoMatch) return '';
    const [_, year, month, day, hour, minute] = isoMatch;

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate day of week manually
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    // Zeller's congruence algorithm to get day of week
    let adjustedMonth = monthNum;
    let adjustedYear = yearNum;
    if (monthNum < 3) {
      adjustedMonth += 12;
      adjustedYear -= 1;
    }
    const k = adjustedYear % 100;
    const j = Math.floor(adjustedYear / 100);
    const h =
      (dayNum +
        Math.floor((13 * (adjustedMonth + 1)) / 5) +
        k +
        Math.floor(k / 4) +
        Math.floor(j / 4) -
        2 * j) %
      7;
    const dayOfWeek = (h + 5) % 7; // Adjust to match Sunday=0

    const monthName = months[monthNum - 1];
    const weekdayName = weekdays[dayOfWeek];

    // Format time
    const hourNum = parseInt(hour, 10);
    const isPM = hourNum >= 12;
    const displayHour =
      hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    const ampm = isPM ? 'PM' : 'AM';

    return `${weekdayName}, ${monthName} ${dayNum}, ${yearNum}, ${displayHour
      .toString()
      .padStart(2, '0')}:${minute} ${ampm}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
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
              <Badge className={getStatusBadgeClass(booking.status)}>
                {formatStatusText(booking.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <span className=" text-sm text-gray-500">Date:</span>
                <p className="text-gray-900">
                  {formatDateTimeLocale(booking.start_date)} -{' '}
                  {formatDateTimeLocale(booking.end_date)}
                </p>
              </div>
              <div>
                <span className=" text-sm text-gray-500">Pickup Time:</span>
                <p className="text-gray-900">{booking.pickup_time}</p>
                <span className=" text-sm text-gray-500">
                  Date and pickup time are shown in Bali Timezone (GMT +8).
                </span>
              </div>

              <div>
                <span className=" text-sm text-gray-500">
                  Number of Persons:
                </span>
                <p className="text-gray-900">
                  {booking.number_of_persons} person(s)
                </p>
              </div>

              <div>
                <span className=" text-sm text-gray-500">Pickup Location:</span>
                <p className="text-gray-900">{booking.pickup_location}</p>
              </div>

              <div>
                <span className=" text-sm text-gray-500">Order Date:</span>
                <p className="text-gray-900">
                  {formatDateTimeLocale(
                    convertISOToCurrentTimezone(booking.created_at)
                  )}
                </p>
              </div>

              {booking.with_driver !== null && (
                <div>
                  <span className="text-sm text-gray-500">With Driver:</span>
                  <p className="text-gray-900">
                    {booking.with_driver ? 'Yes' : 'No'}
                  </p>
                </div>
              )}

              {booking.additional_notes && (
                <div>
                  <span className=" text-sm text-gray-500">
                    Additional Notes:
                  </span>
                  <p className="text-gray-900">{booking.additional_notes}</p>
                </div>
              )}

              <div className="pt-3 border-t">
                <span className=" text-sm text-gray-500">Total Price:</span>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(booking.total_price)}
                </p>
              </div>

              {/* Booking Action Buttons */}
              <BookingActions
                bookingId={booking.id}
                status={booking.status}
                isRequestingCancel={booking.booking_adjustments.some(
                  (adjustment: BookingAdjustment) =>
                    adjustment.request_type === RequestType.CANCELLATION
                )}
                isRequestingReschedule={booking.booking_adjustments.some(
                  (adjustment: BookingAdjustment) =>
                    adjustment.request_type === RequestType.RESCHEDULE
                )}
                isCarRental={!booking.package_id}
                currentStartDate={booking.start_date}
                currentEndDate={booking.end_date}
              />
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
                      <Badge className={getStatusBadgeClass(payment.status)}>
                        {formatStatusText(payment.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Method: {payment.payment_method}</p>
                      <p>Amount: {formatCurrency(payment.gross_amount)}</p>
                      <p>
                        Payment Date:{' '}
                        {payment.payment_date
                          ? formatDateTimeLocale(payment.payment_date)
                          : 'N/A'}
                      </p>
                    </div>

                    {/* Pay Now Button for Pending Payments */}
                    <PaymentAction
                      payment_status={payment.status}
                      payment_method={payment.payment_method}
                      payment_gateway_id={payment.payment_gateway_id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No payment information available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Adjustment Details */}
      {booking.booking_adjustments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Reschedule & Cancellation Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Booking Adjustments */}
              <div className="space-y-4">
                {booking.booking_adjustments.map((adjustment) => (
                  <div
                    key={adjustment.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium">
                          {adjustment.request_type === RequestType.CANCELLATION
                            ? 'Cancellation'
                            : 'Reschedule'}
                        </p>
                      </div>
                      <Badge
                        className={getStatusAdjustmentBadgeClass(
                          adjustment.status
                        )}
                      >
                        {formatStatusText(adjustment.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Reason: {adjustment.reason}</p>
                      <p>
                        Requested Date:{' '}
                        {formatDateTimeLocale(
                          convertISOToCurrentTimezone(adjustment.created_at)
                        )}
                      </p>
                    </div>
                    {adjustment.request_type === RequestType.RESCHEDULE && (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="m-0">
                          New Start Date:{' '}
                          {formatDateTimeLocale(adjustment.new_start_date)}
                        </p>
                        <p>
                          New End Date:{' '}
                          {formatDateTimeLocale(adjustment.new_end_date)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Refund Information */}
              {refundData && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Refund Details
                  </h3>
                  <RefundStepper refund={refundData} bookingId={booking_id} />

                  {/* Show refund form button if status is WAITING_FORM */}
                  {refundData.status === RefundStatus.WAITING_FORM && (
                    <div className="mt-4">
                      <RefundFormDialog
                        bookingId={booking_id}
                        refund={refundData}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
                    <h3 className="text-xl font-semibold mb-3">
                      {packageData.package_name}
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Duration:</span>{' '}
                        {packageData.duration} days
                      </p>
                      <p>
                        <span className="font-medium">Max Persons:</span>{' '}
                        {packageData.max_persons}
                      </p>
                      <p>
                        <span className="font-medium">Price:</span>{' '}
                        {formatCurrency(packageData.package_price)}
                      </p>
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

                {packageData.itineraries &&
                  packageData.itineraries.length > 0 && (
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
                    <h3 className="text-xl font-semibold mb-3">
                      {carData.car_name}
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Color:</span>{' '}
                        {carData.car_color}
                      </p>
                      <p>
                        <span className="font-medium">Police Number:</span>{' '}
                        {carData.police_number}
                      </p>
                      <p>
                        <span className="font-medium">Transmission:</span>{' '}
                        {carData.transmission}
                      </p>
                      <p>
                        <span className="font-medium">Max Persons:</span>{' '}
                        {carData.max_persons}
                      </p>
                      <p>
                        <span className="font-medium">Price per Day:</span>{' '}
                        {formatCurrency(carData.price_per_day)}
                      </p>
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
