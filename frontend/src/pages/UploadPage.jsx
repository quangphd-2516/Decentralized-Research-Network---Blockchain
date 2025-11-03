// src/pages/UploadPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { researchService } from '@/services/researchService';
import toast from 'react-hot-toast';
import { Upload, FileText, Loader2, X } from 'lucide-react';
import { CATEGORIES } from '@/utils/constants';

export default function UploadPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tags: '',
        isPublic: false,
    });

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File không được vượt quá 10MB');
                return;
            }
            setSelectedFile(file);
            toast.success(`Đã chọn file: ${file.name}`);
        }
    };

    // Remove selected file
    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Vui lòng chọn file!');
            return;
        }

        setLoading(true);

        try {
            // Tạo FormData
            const uploadData = new FormData();
            uploadData.append('file', selectedFile);
            uploadData.append('title', formData.title);
            uploadData.append('description', formData.description);
            uploadData.append('category', formData.category);
            uploadData.append('tags', formData.tags);
            uploadData.append('isPublic', formData.isPublic);

            // GỌI SERVICE TRỰC TIẾP
            const response = await researchService.uploadResearch(uploadData);

            toast.success('Upload thành công!');

            // Redirect to detail page
            navigate(`/research/${response.data.research.id}`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Upload thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Upload Research
                    </h1>
                    <p className="text-gray-600">
                        Chia sẻ nghiên cứu của bạn một cách an toàn và phi tập trung
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Area */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                File nghiên cứu *
                            </label>

                            {!selectedFile ? (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click để chọn file</span> hoặc kéo thả vào đây
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            PDF, DOCX, TXT, ZIP (Max 10MB)
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.txt,.zip"
                                    />
                                </label>
                            ) : (
                                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="text-blue-600" size={24} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="p-1 hover:bg-red-100 rounded"
                                    >
                                        <X className="text-red-600" size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tên nghiên cứu của bạn"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Mô tả ngắn gọn về nghiên cứu..."
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (phân cách bằng dấu phẩy)
                            </label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="machine learning, AI, neural network"
                            />
                        </div>

                        {/* Public/Private */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isPublic"
                                checked={formData.isPublic}
                                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                                Công khai (ai cũng có thể xem)
                            </label>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">
                                🔒 Bảo mật thông tin
                            </h4>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>• File sẽ được mã hóa AES-256 trước khi upload lên IPFS</li>
                                <li>• Chỉ bạn và những người được cấp quyền mới có thể xem</li>
                                <li>• Thông tin sẽ được ghi lại trên Blockchain</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/research')}
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Đang upload...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} />
                                        <span>Upload Research</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Upload Process Info */}
                {loading && (
                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Đang xử lý...</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm text-gray-600">Mã hóa file...</span>
                            </div>
                            <div className="flex items-center space-x-3 opacity-50">
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                <span className="text-sm text-gray-600">Upload lên IPFS...</span>
                            </div>
                            <div className="flex items-center space-x-3 opacity-50">
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                <span className="text-sm text-gray-600">Ghi lên Blockchain...</span>
                            </div>
                            <div className="flex items-center space-x-3 opacity-50">
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                                <span className="text-sm text-gray-600">Lưu vào database...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}