import { StatusCodes } from 'http-status-codes';

export const successResponse = (res, data, message = 'Success', statusCode = StatusCodes.OK) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res, message = 'Error', statusCode = StatusCodes.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};