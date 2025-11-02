import { StatusCodes } from 'http-status-codes';

export const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;
    const errors = [];

    if (!username) errors.push('Username là bắt buộc');
    if (!email) errors.push('Email là bắt buộc');
    if (!password) errors.push('Password là bắt buộc');

    if (errors.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin',
            errors,
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Email không hợp lệ',
        });
    }

    if (password.length < 6) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Mật khẩu phải có ít nhất 6 ký tự',
        });
    }

    if (username.length < 3) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Username phải có ít nhất 3 ký tự',
        });
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới',
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push('Email là bắt buộc');
    if (!password) errors.push('Password là bắt buộc');

    if (errors.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: 'Vui lòng điền đầy đủ thông tin',
            errors,
        });
    }

    next();
};