// src/pages/ResearchListPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { researchService } from '@/services/researchService';
import toast from 'react-hot-toast';
import { Search, Filter, Calendar, User, Lock, Globe } from 'lucide-react';
import { CATEGORIES } from '@/utils/constants';

export default function ResearchListPage() {
    const [researches, setResearches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        page: 1,
        limit: 12,
    });

    // Fetch researches khi component mount hoặc filters thay đổi
    useEffect(() => {
        fetchResearches();
    }, [filters.category, filters.page]);

    // GỌI SERVICE TRỰC TIẾP
    const fetchResearches = async () => {
        setLoading(true);
        try {
            const response = await researchService.getResearchList(filters);
            setResearches(response.data.researches);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Không thể tải danh sách nghiên cứu');
        } finally {
            setLoading(false);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchResearches();
    };

    // Handle category filter
    const handleCategoryChange = (category) => {
        setFilters({ ...filters, category, page: 1 });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-4">Khám phá nghiên cứu</h1>
                    <p className="text-xl text-blue-100">
                        Tìm kiếm và truy cập hàng trăm nghiên cứu được chia sẻ
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    placeholder="Tìm kiếm theo tiêu đề, mô tả..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </form>

                        {/* Category Filter */}
                        <div className="md:w-64">
                            <select
                                value={filters.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Tất cả danh mục</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Research Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : researches.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Không tìm thấy nghiên cứu nào</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {researches.map((research) => (
                            <ResearchCard key={research.id} research={research} />
                        ))}
                    </div>
                )}

                {/* Pagination (simplified) */}
                {researches.length > 0 && (
                    <div className="mt-8 flex justify-center space-x-2">
                        <button
                            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                            disabled={filters.page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                            Trang {filters.page}
                        </span>
                        <button
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Research Card Component
function ResearchCard({ research }) {
    return (
        <Link
            to={`/research/${research.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
        >
            {/* Card Header */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {research.title}
                    </h3>
                    {research.isPublic ? (
                        <Globe className="text-green-600 flex-shrink-0 ml-2" size={20} />
                    ) : (
                        <Lock className="text-gray-400 flex-shrink-0 ml-2" size={20} />
                    )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {research.description || 'Không có mô tả'}
                </p>

                {/* Category Badge */}
                {research.category && (
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {research.category}
                        </span>
                    </div>
                )}

                {/* Tags */}
                {research.tags && research.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {research.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                            >
                                #{tag}
                            </span>
                        ))}
                        {research.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                +{research.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                    <div className="flex items-center space-x-1">
                        <User size={16} />
                        <span>{research.author?.username || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(research.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}