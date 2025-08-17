import { AxiosError } from "axios";

export const ErrorResponse = <T>(error: any, returnType?: T) : T => {
    if(error instanceof AxiosError) {
        console.error('Axios response message:', error.response?.data.message);
      } else {
        console.error('Error message:', error.message);
      }
      return returnType ?? {
        status: error.response?.status,
        errors: error.response?.data,
      } as T;
}