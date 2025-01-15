import { Response as ExpressResponse } from "express";

interface ResponseData {
  success: boolean;
  message: string;
  data?: object | null;
  error?: object | string | null;
}

export default class Response {
  static success(
    res: ExpressResponse,
    status: number,
    message: string,
    data?: object
  ): ExpressResponse {
    const responseData: ResponseData = {
      success: true,
      message,
      data: data || null,
    };
    return res.status(status).json(responseData);
  }

  static error(
    res: ExpressResponse,
    status: number,
    message: string,
    errorDetails?: object | string
  ): ExpressResponse {
    const responseData: ResponseData = {
      success: false,
      message,
      error: errorDetails || null,
    };
    return res.status(status).json(responseData);
  }
}
