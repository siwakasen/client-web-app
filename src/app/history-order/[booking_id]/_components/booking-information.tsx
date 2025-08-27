'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/interfaces/booking.interface';
import { formatCurrency } from '@/lib/utils';
import {
  convertISOToCurrentTimezone,
  formatDateTimeLocale,
  formatStatusText,
  getStatusBadgeClass,
} from '@/lib/utils';
import { BookingActions } from './booking-action';
import { BookingAdjustment, RequestType } from '@/interfaces';

export function BookingInformation({ booking }: { booking: Booking }) {
  return (
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
            <span className=" text-sm text-gray-500">Number of Persons:</span>
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
              <span className=" text-sm text-gray-500">Additional Notes:</span>
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
  );
}
