import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.code === 'P2002') {
        return res.status(StatusCodes.CONFLICT).json({
            success: false,
            message: 'Dữ liệu đã tồn tại',
            error: err.meta?.target,
        });
    }

    if (err.code === 'P2025') {
        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Không tìm thấy dữ liệu',
        });
    }

    if (err.code === 'P2003') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Vi phạm ràng buộc khóa ngoại',
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Token không hợp lệ',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Token đã hết hạn',
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: err.errors,
        });
    }

    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'File quá lớn (max 10MB)',
            });
        }
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Lỗi upload file',
        });
    }

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Lỗi server',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
