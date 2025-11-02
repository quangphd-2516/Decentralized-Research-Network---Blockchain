import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return errorResponse(res, 'Email đã được sử dụng', StatusCodes.CONFLICT);
            }
            return errorResponse(res, 'Username đã được sử dụng', StatusCodes.CONFLICT);
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        });

        const token = generateToken(user.id);

        return successResponse(
            res,
            { user, token },
            'Đăng ký thành công',
            StatusCodes.CREATED
        );
    } catch (error) {
        console.error('Register error:', error);
        return errorResponse(
            res,
            'Lỗi server khi đăng ký',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return errorResponse(
                res,
                'Email hoặc mật khẩu không đúng',
                StatusCodes.UNAUTHORIZED
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return errorResponse(
                res,
                'Email hoặc mật khẩu không đúng',
                StatusCodes.UNAUTHORIZED
            );
        }

        const token = generateToken(user.id);

        const { passwordHash, ...userWithoutPassword } = user;

        return successResponse(
            res,
            { user: userWithoutPassword, token },
            'Đăng nhập thành công',
            StatusCodes.OK
        );
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(
            res,
            'Lỗi server khi đăng nhập',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                username: true,
                email: true,
                publicKey: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return errorResponse(
                res,
                'User không tồn tại',
                StatusCodes.NOT_FOUND
            );
        }

        return successResponse(res, { user }, 'Lấy thông tin user thành công');
    } catch (error) {
        console.error('GetMe error:', error);
        return errorResponse(
            res,
            'Lỗi server',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
};