export interface Payment {
    id: number
    gross_amount: number
    net_amount: number
    payment_date: string
    payment_method: string
    payment_gateway_id: string
    status: string
    created_at: string
    updated_at: string
  }

export interface PaymentResponse {
  data: Payment;
  message: string;
}