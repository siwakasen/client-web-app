"use server";
import { getHeaders, getToken } from "@/lib/users-provider";
import { cancelBooking, rescheduleBooking } from "@/services";
import { CancelBookingResponse, RescheduleBookingResponse } from "@/interfaces";

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

// {
//   "new_start_date": "2025-08-15T16:31:07.323Z",
//   "new_end_date": "2025-08-16T16:32:07.323Z"
// }
export async function useRescheduleBooking(booking_id: number, new_start_date: string, new_end_date: string) : Promise<RescheduleBookingResponse |  {
    status: number;
    errors: any;
}> {
    try {
        const headers = await getHeaders();
        const token = await getToken();
        const response = await rescheduleBooking(booking_id, headers, token!, new_start_date, new_end_date);
        return response;
    } catch (error: any) {
        return {
            status: error.response.status,
            errors: error.response.data,
        }
    }
}