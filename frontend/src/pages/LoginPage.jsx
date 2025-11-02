// src/pages/LoginPage.jsx
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900">
                        Chào mừng trở lại!
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Đăng nhập để tiếp tục
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <LoginForm />

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Chưa có tài khoản?{' '}
                            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}