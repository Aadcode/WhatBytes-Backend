class ApiError extends Error {
    public readonly statusCode: number;
    public readonly success: boolean;

    constructor(statusCode: number, message: string, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
