import { createApiInstance } from "./api";

export const cancelBooking = async (booking_id: number, headers: Record<string, string>, token: string, reason: string) => {
    const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL, headers, token);
    const response = await api.post(`/bookings/cancel/${booking_id}`, {
        reason
    });
    return response.data;
}

export const rescheduleBooking = async (booking_id: number, headers: Record<string, string>, token: string, new_start_date: string, new_end_date: string) => {
    const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL, headers, token);
    const response = await api.post(`/bookings/reschedule/${booking_id}`, {
        new_start_date,
        new_end_date,
    });
    return response.data;
}