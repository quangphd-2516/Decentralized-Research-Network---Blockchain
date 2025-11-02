import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(
                res,
                'Không có token xác thực',
                StatusCodes.UNAUTHORIZED
            );
        }

        const token = authHeader.substring(7);

        const decoded = verifyToken(token);

        if (!decoded) {
            return errorResponse(
                res,
                'Token không hợp lệ hoặc đã hết hạn',
                StatusCodes.UNAUTHORIZED
            );
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return errorResponse(
            res,
            'Lỗi xác thực',
            StatusCodes.UNAUTHORIZED
        );
    }
};