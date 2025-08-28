import { AxiosError } from "axios";

export const ErrorResponse = <T>(error: any, returnType?: T) : T => {
  console.log('errorResponse', error.response.data);
    if(error instanceof AxiosError) {
        console.error('Axios response :', error.response?.data);
      } else {
        console.error('Error response:', error.message);
      }
      return returnType ?? {
        status: error.response?.status,
        errors: error.response?.data,
      } as T;
}