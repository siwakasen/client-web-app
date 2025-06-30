// utils/apiService.ts
import { BookingWithRegisterRequest, BookingWithRegisterResponse } from '@/_interfaces/booking.interface';
import { createApiInstance } from '../api';
  
  const api = createApiInstance(process.env.NEXT_PUBLIC_BOOKINGS_API_URL);


  export const createBookingWithRegister = async (payload: BookingWithRegisterRequest): Promise<BookingWithRegisterResponse> => {
    const response: BookingWithRegisterResponse = await api.post('/bookings/and-register', payload);
    return response;
  };

  