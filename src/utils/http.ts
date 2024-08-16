import axios, { AxiosResponse } from 'axios';

export enum HttpErrorStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500
}

type AxiosErrorData = {
  statusCode: HttpErrorStatusCode;
  errorData: unknown | string | Record<string, string>;
};

export const getAxiosError = (error: unknown): AxiosErrorData => {
  if (axios.isAxiosError(error)) {
    const errorResponse: AxiosResponse | undefined = error.response;
    if (errorResponse) {
      const statusCode = errorResponse.status as HttpErrorStatusCode;
      return { statusCode, errorData: errorResponse.data };
    }

    return { statusCode: HttpErrorStatusCode.BAD_REQUEST, errorData: error.message };
  }

  return { statusCode: HttpErrorStatusCode.INTERNAL_SERVER_ERROR, errorData: error };
};
