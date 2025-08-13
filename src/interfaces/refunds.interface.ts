import { Booking } from "./booking.interface"

export interface RefundsResponse {
    data: Refund | null
    message: string
  }
  
  export interface Refund {
    id: number
    amount: string
    method: RefundMethod
    bank_name: any
    account_number: any
    account_name: any
    status: string
    refund_date: any
    reason: string
    created_at: string
    updated_at: string
    booking: Booking
  }
  
 
  export enum RefundStatus {
    WAITING_FORM = 'WAITING_FORM',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
  }
  
  export enum RefundMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYPAL = 'PAYPAL',
}