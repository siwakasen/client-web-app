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
