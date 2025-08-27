'use client';

import { Badge } from '@/components/ui/badge';
import { BookingAdjustment, RequestType } from '@/interfaces';
import {
  convertISOToCurrentTimezone,
  formatDateTimeLocale,
  formatStatusText,
  getStatusAdjustmentBadgeClass,
} from '@/lib/utils';

export function AdjustmentsInformation({
  adjustment,
}: {
  adjustment: BookingAdjustment;
}) {
  return (
    <div key={adjustment.id} className="p-3 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium">
            {adjustment.request_type === RequestType.CANCELLATION
              ? 'Cancellation'
              : 'Reschedule'}
          </p>
        </div>
        <Badge className={getStatusAdjustmentBadgeClass(adjustment.status)}>
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
            New Start Date: {formatDateTimeLocale(adjustment.new_start_date)}
          </p>
          <p>New End Date: {formatDateTimeLocale(adjustment.new_end_date)}</p>
        </div>
      )}
    </div>
  );
}
