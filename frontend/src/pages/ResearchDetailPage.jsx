// src/pages/ResearchDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { researchService } from '@/services/researchService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {
    Download,
    Calendar,
    User,
    Lock,
    Globe,
    Hash,
    ExternalLink,
    Trash2,
    Share2,
    Loader2,
} from 'lucide-react';

export default function ResearchDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [research, setResearch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(() => {
        fetchResearchDetail();
    }, [id]);

    // GỌI SERVICE TRỰC TIẾP
    const fetchResearchDetail = async () => {
        setLoading(true);
        try {
            const response = await researchService.getResearchById(id);
            setResearch(response.data.research);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Không thể tải thông tin nghiên cứu');
            navigate('/research');
        } finally {
            setLoading(false);
        }
    };

    // Download file
    const handleDownload = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để tải file');
            navigate('/login');
            return;
        }

        setDownloading(true);
        try {
            // GỌI SERVICE TRỰC TIẾP
            const blob = await researchService.downloadResearch(id);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${research.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success('Đã tải file thành công!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error(error.response?.data?.message || 'Không thể tải file');
        } finally {
            setDownloading(false);
        }
    };

    // Delete research
    const handleDelete = async () => {
        if (!confirm('Bạn có chắc muốn xóa nghiên cứu này?')) return;

        try {
            // GỌI SERVICE TRỰC TIẾP
            await researchService.deleteResearch(id);
            toast.success('Đã xóa nghiên cứu');
            navigate('/research');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Không thể xóa nghiên cứu');
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

    const isOwner = user && user.id === research.authorId;
    const canAccess = research.isPublic || isOwner; // TODO: Check AccessGrant

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Link to="/research" className="hover:underline">
                            Khám phá
                        </Link>
                        <span>/</span>
                        <span>{research.title}</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{research.title}</h1>
                    <div className="flex items-center space-x-4 text-blue-100">
                        <div className="flex items-center space-x-1">
                            <User size={18} />
                            <span>{research.author?.username || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Calendar size={18} />
                            <span>{new Date(research.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            {research.isPublic ? (
                                <>
                                    <Globe size={18} />
                                    <span>Công khai</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    <span>Riêng tư</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
                            <p className="text-gray-700 whitespace-pre-line">
                                {research.description || 'Không có mô tả'}
                            </p>
                        </div>

                        {/* Tags */}
                        {research.tags && research.tags.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {research.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Blockchain Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Thông tin Blockchain</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start space-x-2">
                                    <Hash className="text-gray-400 mt-1" size={16} />
                                    <div className="flex-1">
                                        <p className="text-gray-600 mb-1">IPFS Hash:</p>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded block break-all">
                                            {research.ipfsHash}
                                        </code>
                                    </div>
                                </div>

                                {research.txHash && (
                                    <div className="flex items-start space-x-2">
                                        <ExternalLink className="text-gray-400 mt-1" size={16} />
                                        <div className="flex-1">
                                            <p className="text-gray-600 mb-1">Transaction Hash:</p>
                                            <a
                                                href={`https://sepolia.etherscan.io/tx/${research.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-xs break-all"
                                            >
                                                {research.txHash}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Category */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">Danh mục</h3>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {research.category || 'Khác'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-semibold text-gray-600 mb-4">Hành động</h3>
                            <div className="space-y-3">
                                {/* Download Button */}
                                {canAccess ? (
                                    <button
                                        onClick={handleDownload}
                                        disabled={downloading}
                                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {downloading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Đang tải...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download size={18} />
                                                <span>Tải xuống</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <Lock className="mx-auto mb-2 text-gray-400" size={24} />
                                        <p className="text-sm text-gray-600">
                                            Bạn không có quyền truy cập
                                        </p>
                                    </div>
                                )}

                                {/* Owner Actions */}
                                {isOwner && (
                                    <>
                                        <button
                                            onClick={() => setShowShareModal(true)}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            <Share2 size={18} />
                                            <span>Chia sẻ</span>
                                        </button>

                                        <button
                                            onClick={handleDelete}
                                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                            <span>Xóa</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <ShareModal
                    researchId={research.id}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
}

// Share Modal Component
function ShareModal({ researchId, onClose }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleShare = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // GỌI SERVICE TRỰC TIẾP
            await researchService.grantAccess(researchId, email);
            toast.success('Đã cấp quyền truy cập');
            setEmail('');
            onClose();
        } catch (error) {
            console.error('Grant error:', error);
            toast.error(error.response?.data?.message || 'Không thể cấp quyền');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold mb-4">Chia sẻ nghiên cứu</h3>
                <form onSubmit={handleShare}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email người nhận
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    />

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
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Chia sẻ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}