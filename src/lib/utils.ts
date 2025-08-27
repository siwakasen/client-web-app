
import { AdjustmentStatus, BookingStatus } from "@/interfaces";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertISOToCurrentTimezone(isoString: string): string {
  if (!isoString) return "";
  console.log("DB ISO",isoString);

  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  // Get timezone offset in minutes
  const timezoneOffset = date.getTimezoneOffset();

  // Adjust the date by the timezone offset
  const adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
  console.log("After convertISOToCurrentTimezone",adjustedDate);
  console.log("After convertISOToCurrentTimezone ISO",adjustedDate.toISOString());
  return adjustedDate.toISOString();
}
export function combineDateAndTime(dateString: string, timeString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (timeString) {
    const [hours, minutes, seconds] = timeString.split(":");
    date.setHours(
      Number(hours) || 0,
      Number(minutes) || 0,
      Number(seconds) || 0,
      0
    );
  }
  return date.toISOString();
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}


export const formatDateTimeLocale = (dateString: string): string => {
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

export const formatStatusText = (status: string) => {
  if (!status) return '';
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};


export const getStatusBadgeClass = (status: string) => {
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

export const  getStatusAdjustmentBadgeClass = (status: string) => {
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
