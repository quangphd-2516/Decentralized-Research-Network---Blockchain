// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { researchService } from '@/services/researchService';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
    User,
    FileText,
    Clock,
    Trash2,
    Share2,
    Download,
    Eye,
    Lock,
    Globe,
    Calendar,
} from 'lucide-react';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('my-researches'); // my-researches | accessed | settings
    const [myResearches, setMyResearches] = useState([]);
    const [accessedResearches, setAccessedResearches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'my-researches') {
                // GỌI SERVICE TRỰC TIẾP
                const response = await researchService.getMyResearches();
                setMyResearches(response.data.researches);
            } else if (activeTab === 'accessed') {
                // GỌI SERVICE TRỰC TIẾP
                const response = await researchService.getAccessedResearches();
                setAccessedResearches(response.data.researches);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa nghiên cứu này?')) return;

        try {
            // GỌI SERVICE TRỰC TIẾP
            await researchService.deleteResearch(id);
            toast.success('Đã xóa nghiên cứu');
            fetchData(); // Refresh list
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Không thể xóa nghiên cứu');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={40} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user?.username}</h1>
                            <p className="text-blue-100">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
                            <button
                                onClick={() => setActiveTab('my-researches')}
                                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'my-researches'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <FileText size={18} />
                                <span>Nghiên cứu của tôi</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('accessed')}
                                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'accessed'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <Share2 size={18} />
                                <span>Được chia sẻ</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'settings'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <User size={18} />
                                <span>Cài đặt</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        {activeTab === 'my-researches' && (
                            <MyResearchesTab
                                researches={myResearches}
                                loading={loading}
                                onDelete={handleDelete}
                            />
                        )}

                        {activeTab === 'accessed' && (
                            <AccessedResearchesTab
                                researches={accessedResearches}
                                loading={loading}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsTab user={user} onLogout={logout} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// MY RESEARCHES TAB
// ==========================================
function MyResearchesTab({ researches, loading, onDelete }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (researches.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Chưa có nghiên cứu nào
                </h3>
                <p className="text-gray-500 mb-6">
                    Hãy upload nghiên cứu đầu tiên của bạn!
                </p>
                <Link
                    to="/upload"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Upload ngay
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    Nghiên cứu của tôi ({researches.length})
                </h2>
                <Link
                    to="/upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    + Upload mới
                </Link>
            </div>

            {researches.map((research) => (
                <ResearchCard
                    key={research.id}
                    research={research}
                    onDelete={onDelete}
                    showActions
                />
            ))}
        </div>
    );
}

// ==========================================
// ACCESSED RESEARCHES TAB
// ==========================================
function AccessedResearchesTab({ researches, loading }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (researches.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Share2 className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Chưa có nghiên cứu được chia sẻ
                </h3>
                <p className="text-gray-500">
                    Các nghiên cứu được chia sẻ cho bạn sẽ xuất hiện ở đây
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Được chia sẻ cho tôi ({researches.length})
            </h2>

            {researches.map((research) => (
                <ResearchCard key={research.id} research={research} showActions={false} />
            ))}
        </div>
    );
}

// ==========================================
// SETTINGS TAB
// ==========================================
function SettingsTab({ user, onLogout }) {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin tài khoản</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={user?.username || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tham gia từ
                        </label>
                        <input
                            type="text"
                            value={new Date(user?.createdAt).toLocaleDateString('vi-VN')}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Hành động</h2>
                <button
                    onClick={onLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}

// ==========================================
// RESEARCH CARD COMPONENT
// ==========================================
function ResearchCard({ research, onDelete, showActions }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {research.title}
                        </h3>
                        {research.isPublic ? (
                            <Globe className="text-green-600" size={18} />
                        ) : (
                            <Lock className="text-gray-400" size={18} />
                        )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {research.description || 'Không có mô tả'}
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Calendar size={16} />
                            <span>{new Date(research.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {research.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {research.category}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                    <Link
                        to={`/research/${research.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Xem chi tiết"
                    >
                        <Eye size={20} />
                    </Link>

                    {showActions && (
                        <>
                            <Link
                                to={`/research/${research.id}/manage`}
                                className="p-2 text-green-600 hover:bg-green-50 rounded"
                                title="Quản lý quyền truy cập"
                            >
                                <Share2 size={20} />
                            </Link>

                            <button
                                onClick={() => onDelete(research.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Xóa"
                            >
                                <Trash2 size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}