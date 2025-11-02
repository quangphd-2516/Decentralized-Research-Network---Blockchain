// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }

        setLoading(true);

        const success = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });

        if (success) {
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên người dùng
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="johndoe"
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                    />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Đang đăng ký...</span>
                    </>
                ) : (
                    <span>Đăng ký</span>
                )}
            </button>
        </form>
    );
}