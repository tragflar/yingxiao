import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      // Filter for images and videos
      const validFiles = filesArray.filter(file => 
        file.type.startsWith('image/') || file.type.startsWith('video/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center gap-4">
        <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
          <UploadCloud size={40} />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-700">
            点击或拖拽文件到此处上传
          </p>
          <p className="text-slate-500 mt-1">
            支持 JPG, PNG, MP4 等格式，支持多文件上传
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
