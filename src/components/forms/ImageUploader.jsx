import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import { compressImageFile } from '../../utils/imageStorage';

export function ImageUploader({ imagePreview, onImageChange, onImageClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFile = async (file) => {
    setError(null);
    setCompressionStats(null);
    if (!file) return;

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
    if (!file.type.startsWith('image/') && !validTypes.includes(file.type.toLowerCase())) {
      setError('Please select a valid photographic image (JPEG, PNG, WEBP).');
      return;
    }

    // Upper limit guard for raw camera uploads
    if (file.size > 25 * 1024 * 1024) {
      setError('Selected image exceeds the 25MB maximum upload threshold. Please select a smaller photo.');
      return;
    }

    setIsCompressing(true);

    try {
      // Compress and optimize image to prevent localStorage/IndexedDB quota overflow
      const { dataUrl, originalSize, compressedSize } = await compressImageFile(
        file,
        1200,
        1200,
        0.72
      );

      const savedPercent = originalSize > 0
        ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
        : 0;

      setCompressionStats({
        original: formatFileSize(originalSize),
        compressed: formatFileSize(compressedSize),
        savedPercent: Math.max(0, savedPercent),
      });

      onImageChange(dataUrl, file);
    } catch (err) {
      console.error('Image compression failed', err);
      setError(err.message || 'Failed to process and compress selected image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleClear = () => {
    setCompressionStats(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageClear();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {imagePreview ? (
        <div className="space-y-2">
          <div className="relative rounded-2xl overflow-hidden border border-sage-300 bg-black/5 aspect-video max-h-72 flex items-center justify-center group shadow-soft">
            <img
              src={imagePreview}
              alt="Report Evidence Preview"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/90 text-charcoal-800 text-xs font-semibold hover:bg-white transition-colors"
              >
                Replace Photo
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-semibold hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>

          {compressionStats && (
            <div className="flex items-center justify-between text-[11px] text-forest-800 bg-forest-50/90 border border-forest-200 px-3 py-1.5 rounded-lg">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                <span>Client-Side Optimized: {compressionStats.original} → <b>{compressionStats.compressed}</b></span>
              </span>
              <span className="font-semibold text-forest-700 bg-forest-100 px-2 py-0.5 rounded text-[10px]">
                {compressionStats.savedPercent}% Quota Saved
              </span>
            </div>
          )}
        </div>
      ) : isCompressing ? (
        <div className="border-2 border-dashed border-forest-400 bg-forest-50/40 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
          <div>
            <p className="text-xs font-bold text-forest-900">Compressing & Optimizing Image...</p>
            <p className="text-[11px] text-forest-700 mt-0.5">Scaling resolution to protect client storage quota</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-forest-600 bg-forest-50/50 scale-[0.99]'
              : 'border-sage-300 hover:border-forest-500 bg-white/70 hover:bg-offwhite-50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-forest-50 text-forest-700 flex items-center justify-center mx-auto mb-3 border border-forest-200">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-charcoal-800">
            Click to upload photographic evidence or drag and drop
          </p>
          <p className="text-xs text-charcoal-500 mt-1">
            Supports High-Res JPG, PNG, WEBP (Auto-compressed to prevent quota errors)
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-forest-700 font-medium bg-forest-50 px-3 py-1 rounded-full border border-forest-200">
              <ImageIcon className="w-3.5 h-3.5" /> Select Local File
            </span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

