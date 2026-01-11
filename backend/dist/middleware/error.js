"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
// Error handler middleware
const errorHandler = (err, _req, res, _next) => {
    let error = { ...err };
    error.message = err.message;
    // Log to console for dev
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error.message = message;
        error.statusCode = 404;
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error.message = message;
        error.statusCode = 400;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors || {})
            .map((val) => val.message)
            .join(', ');
        error.message = message;
        error.statusCode = 400;
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
// Not found middleware
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
//# sourceMappingURL=error.js.map