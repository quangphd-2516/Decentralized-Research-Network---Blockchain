// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const success = await login(formData.email, formData.password);
        if (success) {
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Đang đăng nhập...</span>
                    </>
                ) : (
                    <span>Đăng nhập</span>
                )}
            </button>
        </form>
    );
}
