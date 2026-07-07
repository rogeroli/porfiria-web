export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  error: {
    message: string | string[];
  };
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
