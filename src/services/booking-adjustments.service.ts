import { createApiInstance } from "./api";

export const cancelBooking = async (booking_id: number, headers: Record<string, string>, token: string, reason: string) => {
    const api = await createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL, headers, token);
    const response = await api.post(`/bookings/cancel/${booking_id}`, {
        reason
    });
    return response.data;
}
