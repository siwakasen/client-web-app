"use server";
import { getHeaders, getToken } from "@/lib/users-provider";
import { cancelBooking } from "@/services";
import { CancelBookingResponse } from "@/interfaces";

export async function useCancelBooking(booking_id: number, reason: string) : Promise<CancelBookingResponse |  {
    status: number;
    errors: any;
}> {
    try {
        const headers = await getHeaders();
        const token = await getToken();

        const response = await cancelBooking(booking_id, headers, token!, reason);
        return response;
    } catch (error: any) {
        return {
            status: error.response.status,
            errors: error.response.data,
        }
    }
}