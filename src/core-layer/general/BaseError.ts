export abstract class BaseError extends Error {
    public readonly name: string;
    public readonly isOperational: boolean;

    protected constructor(name: string, message: string, isOperational = true) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}