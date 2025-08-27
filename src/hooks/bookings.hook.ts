"use server";
import { createBooking, createBookingWithRegister, getBookingById, getBookingHistory } from "@/services";
import { getHeaders } from "@/lib/users-provider";
import { z } from "zod";
import { BookingFormSchema, BookingRegisterFormSchema } from "@/lib/validation";
import { createSession, getToken } from "@/lib/users-provider/cookies";
import { BookingHistoryResponse, BookingResponse, BookingResponseById } from "@/interfaces";
import { useUploadIdentityFile } from "./customer.hook";
import { ErrorResponse } from "./common.hook";
import { revalidateTag } from "next/cache";

export async function useCreateBooking(
  formData: z.infer<typeof BookingFormSchema>
) : Promise<BookingResponse | {
  status: number;
  errors: any;
}> {
  try {
    const headers = await getHeaders();
    const token = await getToken();
    const response: BookingResponse = await createBooking(
      formData,
      token!,
      headers
    );
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useCreateBookingWithRegister(
  formData: z.infer<typeof BookingRegisterFormSchema>
) : Promise<BookingResponse | {
  status: number;
  errors: any;
}> {
  try {
    const response = await createBookingWithRegister(formData);
    await createSession(response.data.token);
    revalidateTag('session');
    
    // Upload identity files after account creation if files are provided
    if (formData.identity_file && formData.identity_file.length > 0) {
      try {
        await useUploadIdentityFile(formData.identity_file);
      } catch (uploadError) {
        // Don't fail the entire booking if upload fails - user can try again later
      }
    }
    
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}
export async function useGetBookingById(order_id: string): Promise<BookingResponseById | {
  status: number;
  errors?: any;
}> {
  try {
    const headers = await getHeaders();
    const token = await getToken();
    const response: BookingResponseById = await getBookingById(order_id, headers, token!);
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}

export async function useGetBookingHistory(page: number, limit: number, status?: string) : Promise<BookingHistoryResponse | {
  status: number;
  errors: any;
}> {
  try {
    const headers = await getHeaders();
    const token = await getToken();
    const response: BookingHistoryResponse = await getBookingHistory(headers, token!, page, limit, status);
    return response;
  } catch (error: any) {
    return ErrorResponse(error);
  }
}