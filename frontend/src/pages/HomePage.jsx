// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { Upload, Lock, Globe, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Mạng Lưới Nghiên Cứu Phi Tập Trung
                        </h1>
                        <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                            Chia sẻ và bảo mật dữ liệu nghiên cứu của bạn với công nghệ Blockchain và IPFS
                        </p>

                        <div className="flex justify-center space-x-4">
                            {user ? (
                                <Link
                                    to="/upload"
                                    className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 flex items-center space-x-2"
                                >
                                    <Upload size={20} />
                                    <span>Upload Research</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register"
                                        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
                                    >
                                        Bắt đầu ngay
                                    </Link>
                                    <Link
                                        to="/research"
                                        className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
                                    >
                                        Khám phá
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Tính năng nổi bật
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Kết hợp công nghệ Blockchain, IPFS và mã hóa để bảo vệ dữ liệu nghiên cứu của bạn
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Lock className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Bảo mật cao</h3>
                            <p className="text-gray-600">
                                Mã hóa AES-256 trước khi upload lên IPFS
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Globe className="text-purple-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Phi tập trung</h3>
                            <p className="text-gray-600">
                                Dữ liệu lưu trên IPFS, không phụ thuộc server trung tâm
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Zap className="text-pink-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Blockchain</h3>
                            <p className="text-gray-600">
                                Smart contract đảm bảo tính minh bạch và immutable
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Upload className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Dễ sử dụng</h3>
                            <p className="text-gray-600">
                                Giao diện thân thiện, upload chỉ với vài click
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
                            <div className="text-gray-600">Nghiên cứu đã upload</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
                            <div className="text-gray-600">Nhà nghiên cứu</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-pink-600 mb-2">1000+</div>
                            <div className="text-gray-600">Transactions on-chain</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Sẵn sàng bắt đầu?
                        </h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Tham gia mạng lưới nghiên cứu phi tập trung ngay hôm nay
                        </p>
                        <Link
                            to="/register"
                            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50"
                        >
                            Đăng ký miễn phí
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}