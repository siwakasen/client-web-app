export const BookingStatus = {
  CONFIRMED: 'CONFIRMED',
  ONGOING: 'ONGOING', 
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  WAITING_PAYMENT: 'WAITING_PAYMENT',
  WAITING_CONFIRMATION: 'WAITING_CONFIRMATION',
  NO_SHOW: 'NO_SHOW',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];
