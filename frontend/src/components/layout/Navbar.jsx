// src/components/layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Upload } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                            <span className="text-xl font-bold text-gray-900">
                                ResearchNet
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/research"
                            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Khám phá
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/upload"
                                    className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    <Upload size={18} />
                                    <span>Upload</span>
                                </Link>

                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                                    >
                                        <User size={20} />
                                        <span className="text-sm font-medium">{user.username}</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-500 hover:text-red-600"
                                        title="Đăng xuất"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}