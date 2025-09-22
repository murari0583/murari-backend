class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        error = [],
        stack = ""
    ) {
        super(message); // Error class से message inherit करना
        this.name = this.constructor.name; // Error का नाम 'ApiError' सेट करना
        this.statusCode = statusCode; // HTTP status code जैसे 400, 500
        this.error = error; // Extra error details जैसे validation errors
        this.stack = stack || new Error().stack; // Stack trace सेट करना
        Error.captureStackTrace(this, this.constructor); // साफ-सुथरा stack trace
    }
}
export {Apierror}