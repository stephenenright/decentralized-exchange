class BaseError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ErrorInvalidParameter extends BaseError {
    constructor(message = undefined) {
        super("INVALID_PARAMETER", message || 'Invalid parameter passed')
    }
}

module.exports = {
    ErrorInvalidParameter
}



