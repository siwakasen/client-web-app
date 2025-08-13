import { RefundMethod } from "@/interfaces/refunds.interface";
import { z } from "zod";

export const RefundFormSchema = (payment_method: RefundMethod) => {
  if (payment_method === RefundMethod.BANK_TRANSFER) {
    return z.object({
      account_name: z
        .string()
        .min(1, { message: "Account name must be provided" })
        .trim(),
      account_number: z
        .string()
        .min(1, { message: "Account number must be provided" })
        .trim(),
      bank_name: z.string().min(1, { message: "Bank name must be provided" }).trim(),
    });
  } else if (payment_method === RefundMethod.PAYPAL) {
    return z.object({
      account_name: z.string().min(1, { message: "Account name must be provided" }).trim(),
    });
  }
};
