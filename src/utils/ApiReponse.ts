class ApiResponse {
    public readonly statusCode: number;
    public readonly message: string;
    public readonly data: any;
    public readonly success: boolean;

    constructor(statusCode: number, message: string, data: any = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400; // Automatically sets success based on status code
    }
}

export default ApiResponse;
