import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kiểm tra token khi load app
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await authService.getCurrentUser();
            setUser(response.data.user);
        } catch (error) {
            authService.logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            toast.success('Đăng nhập thành công!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            toast.success('Đăng ký thành công!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại');
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.success('Đã đăng xuất');
    };

    // ✅ Đây mới là cách return đúng
    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
