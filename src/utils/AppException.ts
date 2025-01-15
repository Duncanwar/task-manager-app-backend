export default class AppException extends Error {
    public statusCode: number;
    public details?: object | string;
  
    constructor(message: string, statusCode = 500, details?: object | string) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
  
      // Ensure the name of this error is the same as the class name
      Object.setPrototypeOf(this, new.target.prototype);
  
      // Capture stack trace for debugging
      Error.captureStackTrace(this);
    }
  }
  