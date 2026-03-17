import React, { useState, ChangeEvent } from 'react';
import { SKKNInput, OriginalDocxFile, TitleAnalysisResult } from '../types';
import { BookOpen, Target, GraduationCap, FileText, Sparkles, Upload, Type, AlertCircle, Search, Loader2, ExternalLink, X } from 'lucide-react';
import FileUpload from './FileUpload';
import TitleAnalysisPanel from './TitleAnalysisPanel';
import { analyzeTitleSKKN } from '../services/geminiService';
import { hasAnyKey } from '../services/apiKeyService';

interface InputFormProps {
  onSubmit: (data: SKKNInput) => void;
  isLoading: boolean;
}

type InputMode = 'text' | 'file';

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<SKKNInput>({
    title: '',
    level: 'Tiểu học',
    subject: '',
    target: 'Cấp Trường',
    content: ''
  });
  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isAnalyzingTitle, setIsAnalyzingTitle] = useState(false);
  const [titleAnalysis, setTitleAnalysis] = useState<TitleAnalysisResult | null>(null);
  const [showApiKeyGuide, setShowApiKeyGuide] = useState(false);

  const handleAnalyzeTitle = async () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên đề tài trước khi phân tích.');
      return;
    }
    setIsAnalyzingTitle(true);
    try {
      const result = await analyzeTitleSKKN(formData.title, formData.subject, formData.level);
      setTitleAnalysis(result);
    } catch (error: any) {
      alert('Lỗi phân tích đề tài: ' + error.message);
    } finally {
      setIsAnalyzingTitle(false);
    }
  };

  const handleSelectSuggestedTitle = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    setTitleAnalysis(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'content') setFileError(null);
  };

  const handleTextExtracted = (text: string) => {
    setFormData(prev => ({ ...prev, content: text }));
    setFileError(null);
  };

  const handleDocxLoaded = (docx: OriginalDocxFile) => {
    setFormData(prev => ({ ...prev, originalDocx: docx }));
    console.log('Đã lưu file Word gốc cho XML Injection:', docx.fileName);
  };

  const handleFileError = (error: string) => {
    setFileError(error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra API key trước
    if (!hasAnyKey()) {
      setShowApiKeyGuide(true);
      return;
    }
    if (formData.content.length < 50) {
      alert("Vui lòng nhập nội dung dài hơn để hệ thống có thể phân tích chính xác.");
      return;
    }
    onSubmit(formData);
  };

  const handleSampleData = () => {
    setFormData({
      title: "Một số biện pháp giúp học sinh lớp 5 học tốt môn Lịch sử qua việc sử dụng bản đồ tư duy",
      level: "Tiểu học",
      subject: "Lịch sử",
      target: "Cấp Trường",
      content: `I. ĐẶT VẤN ĐỀ
Trong bối cảnh đổi mới giáo dục hiện nay, việc phát huy tính tích cực, chủ động của học sinh là vô cùng quan trọng. Môn Lịch sử ở tiểu học thường bị coi là khô khan, khó nhớ. Học sinh thường học vẹt, nhớ trước quên sau.

II. GIẢI QUYẾT VẤN ĐỀ
1. Cơ sở lý luận
Theo quan điểm dạy học hiện đại, học sinh là trung tâm. Bản đồ tư duy (Mindmap) là công cụ ghi nhớ ưu việt được Tony Buzan phát triển.
2. Thực trạng
Qua khảo sát đầu năm, chỉ có 30% học sinh yêu thích môn Lịch sử. Các em thường ngại học bài cũ vì nhiều số liệu.
3. Các biện pháp thực hiện
Biện pháp 1: Hướng dẫn học sinh làm quen với bản đồ tư duy.
Biện pháp 2: Ứng dụng bản đồ tư duy trong khâu kiểm tra bài cũ.
Biện pháp 3: Sử dụng bản đồ tư duy để tổng kết bài học.
Ví dụ: Khi dạy bài "Chiến thắng Bạch Đằng", tôi cho học sinh vẽ sơ đồ diễn biến trận đánh...

III. KẾT LUẬN
Qua áp dụng sáng kiến, chất lượng môn Lịch sử lớp 5A đã được nâng lên rõ rệt. Số học sinh đạt điểm Giỏi tăng từ 20% lên 55%. Hiệu qủa của phương páp này là rất khả quan.`
    });
  };

  return (
    <>
    {/* API Key Guide Modal */}
    {showApiKeyGuide && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowApiKeyGuide(false)}>
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-center relative">
            <button onClick={() => setShowApiKeyGuide(false)} className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-lg transition-colors text-white">
              <X size={20} />
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🔑</span>
            </div>
            <h3 className="text-xl font-black text-white">Cần API Key để sử dụng</h3>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <p className="text-gray-700 text-center font-medium">
              Tất cả các app đều cần lấy <strong className="text-blue-600">API Key</strong> để dùng nhé thầy cô!
            </p>

            {/* Link lấy API Key */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">📎 Link lấy API Key:</p>
              <a
                href="https://aistudio.google.com/app/api-keys"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm break-all"
              >
                <ExternalLink size={16} className="flex-shrink-0" />
                https://aistudio.google.com/app/api-keys
              </a>
            </div>

            {/* Video hướng dẫn */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-purple-800 mb-2">🎬 Video hướng dẫn lấy API Key:</p>
              <a
                href="https://youtu.be/Wu-yRkugiFw"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                <ExternalLink size={16} className="flex-shrink-0" />
                https://youtu.be/Wu-yRkugiFw
              </a>
            </div>

            {/* Liên hệ hỗ trợ */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-emerald-800 mb-2">💬 Liên hệ hỗ trợ:</p>
              <a
                href="https://zalo.me/0348296773"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
              >
                <ExternalLink size={16} className="flex-shrink-0" />
                Zalo 0348296773
              </a>
            </div>

            {/* Nút đóng */}
            <button
              onClick={() => setShowApiKeyGuide(false)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors"
            >
              Đã hiểu, tôi sẽ lấy API Key
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden animate-fade-in-up border border-teal-100">
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Nhập thông tin SKKN</h2>
        <p className="text-teal-50 opacity-90">Hệ thống sẽ phân tích và đưa ra báo cáo chi tiết trong vài giây</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText size={18} className="text-teal-600" /> Tên đề tài SKKN
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ví dụ: Một số biện pháp giúp học sinh..."
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all shadow-sm hover:shadow-md bg-white"
              />
              <button
                type="button"
                onClick={handleAnalyzeTitle}
                disabled={isAnalyzingTitle || !formData.title.trim()}
                className={`px-4 py-3 rounded-xl font-medium text-white flex items-center gap-2 transition-all shadow-md hover:shadow-lg ${isAnalyzingTitle || !formData.title.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 hover:shadow-teal-200'
                  }`}
                title="Phân tích tên đề tài"
              >
                {isAnalyzingTitle ? (
                  <><Loader2 size={18} className="animate-spin" /> Đang phân tích...</>
                ) : (
                  <><Search size={18} /> Phân tích đề tài</>
                )}
              </button>
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <GraduationCap size={18} className="text-teal-600" /> Cấp học
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
            >
              <option value="Tiểu học">Tiểu học</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-teal-600" /> Môn học / Lĩnh vực
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="VD: Toán, Ngữ Văn, Quản lý..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-all shadow-sm hover:shadow-md bg-white"
            />
          </div>

          {/* Target */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Target size={18} className="text-teal-600" /> Mục tiêu thi đạt giải
            </label>
            <select
              name="target"
              value={formData.target}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm hover:shadow-md transition-all appearance-none cursor-pointer"
            >
              <option value="Cấp Trường">Cấp Trường</option>
              <option value="Cấp Phường">Cấp Phường</option>
              <option value="Cấp Thành phố">Cấp Thành phố</option>
            </select>
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><FileText size={18} className="text-teal-600" /> Nội dung SKKN</span>
              <button
                type="button"
                onClick={handleSampleData}
                className="text-xs text-teal-600 hover:text-teal-800 underline font-normal"
              >
                Dùng dữ liệu mẫu
              </button>
            </label>

            {/* Toggle Tabs */}
            <div className="flex mb-4 bg-gray-100 rounded-xl p-1.5 shadow-inner">
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${inputMode === 'file'
                  ? 'bg-white text-teal-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <Upload size={16} /> Tải file lên
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${inputMode === 'text'
                  ? 'bg-white text-teal-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <Type size={16} /> Nhập văn bản
              </button>
            </div>

            {/* File Upload Mode */}
            {inputMode === 'file' && (
              <div className="space-y-4">
                <FileUpload
                  onTextExtracted={handleTextExtracted}
                  onError={handleFileError}
                  onDocxLoaded={handleDocxLoaded}
                />
                {fileError && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
                {formData.content && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Nội dung đã trích xuất ({formData.content.length} ký tự):</p>
                    <div className="max-h-40 overflow-y-auto">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-6">{formData.content.substring(0, 500)}...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Text Input Mode */}
            {inputMode === 'text' && (
              <>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Dán nội dung SKKN của bạn vào đây (ít nhất 200 từ để có kết quả tốt nhất)..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 min-h-[300px] font-mono text-sm shadow-sm hover:shadow-md transition-all bg-white"
                  required={inputMode === 'text'}
                />
                <p className="text-xs text-gray-500 mt-2 text-right">
                  {formData.content.length} ký tự
                </p>
              </>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              flex items-center gap-3 px-10 py-4 rounded-full text-lg font-bold text-white shadow-lg transform transition-all hover:scale-105
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-[0_8px_25px_rgba(13,148,136,0.4)] hover:from-teal-600 hover:to-cyan-600'}
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang phân tích...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                KIỂM TRA NGAY
              </>
            )}
          </button>
        </div>
      </form>

      {/* Title Analysis Panel */}
      {titleAnalysis && (
        <TitleAnalysisPanel
          result={titleAnalysis}
          onClose={() => setTitleAnalysis(null)}
          onSelectTitle={handleSelectSuggestedTitle}
        />
      )}
    </div>
    </>
  );
};

export default InputForm;
