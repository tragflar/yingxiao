import React, { useState, useEffect } from 'react';
import { UploadCloud, X, FileImage, FileVideo, AlertCircle, CheckCircle2 } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import AccountSelect from '../components/AccountSelect';

// Mock Data
const MOCK_ACCOUNTS = [
  { id: '1', name: '品牌主账号-美妆', accountId: '1001' },
  { id: '2', name: '品牌主账号-服饰', accountId: '1002' },
  { id: '3', name: '分销商账号-华东', accountId: '2001' },
  { id: '4', name: '分销商账号-华南', accountId: '2002' },
];

interface MaterialFile {
  id: string;
  name: string; // User editable name
  remark: string; // New field
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  accountId?: string;
  errorMsg?: string;
}

const BatchUpload: React.FC = () => {
  const [files, setFiles] = useState<MaterialFile[]>([]);
  const [globalAccountId, setGlobalAccountId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.previewUrl));
    };
  }, []);

  const handleFilesSelected = (newFiles: File[]) => {
    const newMaterialFiles: MaterialFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      name: '', // Default to empty to guide user to input name
      remark: '',
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      accountId: globalAccountId || undefined, // Apply global account if selected
    }));
    setFiles(prev => [...prev, ...newMaterialFiles]);
  };

  const handleFileNameChange = (id: string, newName: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, name: newName } : f
    ));
  };

  const handleFileRemarkChange = (id: string, newRemark: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, remark: newRemark } : f
    ));
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleGlobalAccountChange = (accountId: string) => {
    setGlobalAccountId(accountId);
    // Optional: Update all pending files to use this account?
    // Let's decide: Yes, if they don't have one manually set or if we want to override.
    // Simple approach: Update all pending files.
    setFiles(prev => prev.map(f => 
      f.status === 'pending' ? { ...f, accountId } : f
    ));
  };

  const handleFileAccountChange = (id: string, accountId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, accountId } : f
    ));
  };

  const startUpload = async (submitForReview: boolean = false) => {
    const filesToUpload = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (filesToUpload.length === 0) return;
    
    // Check if all files have accounts
    const missingAccounts = filesToUpload.some(f => !f.accountId);
    if (missingAccounts) {
      alert('请为所有素材选择广告账户');
      return;
    }

    // Check if all files have names
    const missingNames = filesToUpload.some(f => !f.name.trim());
    if (missingNames) {
      alert('请输入所有素材的名称');
      return;
    }

    setIsUploading(true);
    
    console.log(submitForReview ? 'Starting upload and submit for review...' : 'Starting upload only...');

    // Simulate upload for each file
    for (const file of filesToUpload) {
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      // Simulate progress
      await simulateFileUpload(file.id);
    }

    setIsUploading(false);
    if (submitForReview) {
      alert('所有素材上传成功并已提交审核！');
    } else {
      alert('所有素材上传成功！');
    }
  };

  const simulateFileUpload = (fileId: string) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, status: 'success', progress: 100 } : f
          ));
          resolve();
        } else {
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ));
        }
      }, 200);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">批量上传素材</h2>
        <div className="flex items-center gap-4">
          <div className="w-64">
             <AccountSelect
              accounts={MOCK_ACCOUNTS}
              value={globalAccountId}
              onChange={handleGlobalAccountChange}
              placeholder="默认广告账户 (应用到全部)"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => startUpload(false)}
              disabled={isUploading || files.length === 0}
              className={`px-4 py-2 rounded-lg font-medium text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-2 ${
                isUploading || files.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <UploadCloud size={18} />
              {isUploading ? '正在上传...' : '批量上传'}
            </button>
            
            <button
              onClick={() => startUpload(true)}
              disabled={isUploading || files.length === 0}
              className={`px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                isUploading || files.length === 0
                  ? 'bg-blue-300 cursor-not-allowed'
                  : ''
              }`}
            >
              <CheckCircle2 size={18} />
              {isUploading ? '正在上传...' : '上传并提审'}
            </button>
          </div>
        </div>
      </div>

      <UploadArea onFilesSelected={handleFilesSelected} />

      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file) => (
            <div key={file.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
              {/* Preview Area */}
              <div className="relative h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                {file.file.type.startsWith('image/') ? (
                  <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={file.previewUrl} className="w-full h-full object-cover" />
                )}
                
                {/* Overlay Remove Button */}
                <button
                  onClick={() => handleRemoveFile(file.id)}
                  className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X size={16} />
                </button>

                {/* Status Overlay */}
                {file.status !== 'pending' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {file.status === 'uploading' && (
                      <div className="text-white font-bold">{file.progress}%</div>
                    )}
                    {file.status === 'success' && (
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <CheckCircle2 size={24} />
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="bg-red-500 text-white p-2 rounded-full">
                        <AlertCircle size={24} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      素材名称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={file.name}
                      onChange={(e) => handleFileNameChange(file.id, e.target.value)}
                      className={`w-full text-sm font-medium text-slate-800 border rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none bg-slate-50 transition-colors mb-2 ${
                        !file.name.trim() ? 'border-red-300 bg-red-50 placeholder:text-red-300' : 'border-slate-200'
                      }`}
                      placeholder="请输入素材名称"
                    />
                  </div>
                  {file.file.type.startsWith('image/') ? (
                    <FileImage size={16} className="text-slate-400 flex-shrink-0 mt-8" />
                  ) : (
                    <FileVideo size={16} className="text-slate-400 flex-shrink-0 mt-8" />
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <AccountSelect
                    accounts={MOCK_ACCOUNTS}
                    value={file.accountId}
                    onChange={(val) => handleFileAccountChange(file.id, val)}
                    placeholder="选择账户"
                    className="text-xs py-1.5"
                  />
                  
                  <div className="mt-2">
                       <input
                        type="text"
                        value={file.remark}
                        onChange={(e) => handleFileRemarkChange(file.id, e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 focus:border-blue-500 focus:outline-none bg-slate-50 transition-colors"
                        placeholder="备注 (选填)"
                      />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BatchUpload;
