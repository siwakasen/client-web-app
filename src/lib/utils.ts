import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertISOToCurrentTimezone(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  // Get timezone offset in minutes
  const timezoneOffset = date.getTimezoneOffset();

  // Adjust the date by the timezone offset
  const adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);

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
