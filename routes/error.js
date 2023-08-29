import {ApplicationError} from "../services/applicationErrors.js";

export default async (err, req, res, next) => {
    console.error('Error Handler:', err);

    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof ApplicationError) {
        const message = err.message;
        const statusCode = err.status;

        return res.status(statusCode).json({
            errorMessage: message,
        });
    }

    return res.status(500).json({
        errorMessage: "Internal Server Error.",
    });
};
