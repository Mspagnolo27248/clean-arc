// src/shared/errors/AppError.ts
export class AppError extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode = 400) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
    }
  }
  