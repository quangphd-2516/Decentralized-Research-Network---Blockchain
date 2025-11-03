// src/pages/ManageAccessPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { researchService } from '@/services/researchService';
import toast from 'react-hot-toast';
import { Mail, Trash2, Calendar, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';

export default function ManageAccessPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [research, setResearch] = useState(null);
    const [accessList, setAccessList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGrantModal, setShowGrantModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // GỌI SERVICE TRỰC TIẾP - Fetch research detail
            const researchResponse = await researchService.getResearchById(id);
            setResearch(researchResponse.data.research);

            // GỌI SERVICE TRỰC TIẾP - Fetch access list
            const accessResponse = await researchService.getAccessList(id);
            setAccessList(accessResponse.data.accessList);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Không thể tải dữ liệu');
            navigate('/profile');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (userId) => {
        if (!confirm('Bạn có chắc muốn thu hồi quyền truy cập?')) return;

        try {
            // GỌI SERVICE TRỰC TIẾP
            await researchService.revokeAccess(id, userId);
            toast.success('Đã thu hồi quyền truy cập');
            fetchData(); // Refresh
        } catch (error) {
            console.error('Revoke error:', error);
            toast.error('Không thể thu hồi quyền truy cập');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!research) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>Quay lại Profile</span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900">Quản lý quyền truy cập</h1>
                    <p className="text-gray-600 mt-2">{research.title}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Grant Access Button */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                Cấp quyền truy cập
                            </h2>
                            <p className="text-sm text-gray-600">
                                Chia sẻ nghiên cứu này với người khác
                            </p>
                        </div>
                        <button
                            onClick={() => setShowGrantModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <UserPlus size={20} />
                            <span>Thêm người dùng</span>
                        </button>
                    </div>
                </div>

                {/* Access List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Danh sách người được cấp quyền ({accessList.length})
                    </h2>

                    {accessList.length === 0 ? (
                        <div className="text-center py-12">
                            <UserPlus className="mx-auto text-gray-400 mb-3" size={48} />
                            <p className="text-gray-500">
                                Chưa có ai được cấp quyền truy cập
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {accessList.map((access) => (
                                <AccessItem
                                    key={access.id}
                                    access={access}
                                    onRevoke={handleRevoke}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Grant Modal */}
            {showGrantModal && (
                <GrantAccessModal
                    researchId={id}
                    onClose={() => setShowGrantModal(false)}
                    onSuccess={() => {
                        setShowGrantModal(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}

// ==========================================
// ACCESS ITEM COMPONENT
// ==========================================
function AccessItem({ access, onRevoke }) {
    return (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                    <p className="font-medium text-gray-900">{access.user.username}</p>
                    <p className="text-sm text-gray-500">{access.user.email}</p>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(access.grantedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>

                <button
                    onClick={() => onRevoke(access.userId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Thu hồi quyền"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
}

// ==========================================
// GRANT ACCESS MODAL
// ==========================================
function GrantAccessModal({ researchId, onClose, onSuccess }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // GỌI SERVICE TRỰC TIẾP
            await researchService.grantAccess(researchId, email);
            toast.success('Đã cấp quyền truy cập');
            onSuccess();
        } catch (error) {
            console.error('Grant error:', error);
            toast.error(error.response?.data?.message || 'Không thể cấp quyền');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <h3 className="text-xl font-semibold mb-4">Cấp quyền truy cập</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email người nhận
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Người dùng này sẽ có thể xem và tải nghiên cứu
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                <span>Cấp quyền</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}