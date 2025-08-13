import { Booking } from "./booking.interface";

export interface CancelBookingResponse {
    data: Booking | BookingAdjustment;
    message: string;
}
export interface BookingAdjustment {
    id: number
    request_type: string
    status: string
    reason: string
    new_start_date: any
    new_end_date: any
    additional_price: number
    created_at: string
    updated_at: string
  }
  export enum RequestType {
    CANCELLATION = 'CANCELLATION',
    RESCHEDULE = 'RESCHEDULE'
  }
  
  export enum AdjustmentStatus {
    PENDING = 'PENDING',
    WAITING_PAYMENT = 'WAITING_PAYMENT',
    WAITING_REASSIGNMENT = 'WAITING_REASSIGNMENT',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED'
  }

  export interface RescheduleBookingResponse {
    data: BookingAdjustment;
    message: string;
  }
