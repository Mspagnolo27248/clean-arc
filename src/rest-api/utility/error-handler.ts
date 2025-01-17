import { Response } from "express";
import { DomainError, InfrastructureError } from "../../core-layer/general/Errors/errors";
import { AppError } from "../../core-layer/general/AppError";


export function handleError(res: Response, error: unknown): Response {
    if (error instanceof DomainError) {
        return res.status(400).json({ message: error.message }); // Bad Request
    }

    if (error instanceof InfrastructureError) {
        return res.status(500).json({ message: error.message }); // Internal Server Error
    }

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message }); // Custom App Errors
    }

    if (error instanceof Error) {
        return res.status(500).json({ message: error.message }); // Custom App Errors
    }

    console.error("Unexpected error occurred:", error);
    return res.status(500).json({ message: "An unexpected error occurred" }); // Fallback for unknown errors
}
