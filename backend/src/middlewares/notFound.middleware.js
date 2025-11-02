import { StatusCodes } from 'http-status-codes';

export const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} không tồn tại`,
    });
};