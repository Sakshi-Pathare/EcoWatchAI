import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2, Loader2, Sparkles, Scan, Eye, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { compressImageFile } from '../../utils/imageStorage';

export function ImageUploader({ imagePreview, onImageChange, onImageClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [error, setError] = useState(null);
  const [scanActive, setScanActive] = useState(true);
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
      setScanActive(true);
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
    <div className="space-y-3">
      {imagePreview ? (
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-forest-500/40 bg-black/10 aspect-video max-h-80 flex items-center justify-center group shadow-soft-md">
            <img
              src={imagePreview}
              alt="Report Evidence Preview"
              className="w-full h-full object-cover"
            />

            {/* Simulated AI Laser Scan Line Effect */}
            {scanActive && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-limeaccent-400 to-transparent shadow-[0_0_15px_#84cc16] animate-laser-scan" />
                
                {/* Simulated Bounding Box 1 */}
                <div className="absolute top-[28%] left-[22%] w-32 h-24 border-2 border-limeaccent-400/90 bg-limeaccent-400/10 rounded-lg pointer-events-none animate-pulse-subtle">
                  <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-limeaccent-500 text-forest-950 font-mono text-[9px] font-black uppercase tracking-wider">
                    Plastic: 98%
                  </span>
                </div>

                {/* Simulated Bounding Box 2 */}
                <div className="absolute bottom-[20%] right-[25%] w-28 h-20 border-2 border-emerald-400/90 bg-emerald-400/10 rounded-lg pointer-events-none animate-pulse-subtle">
                  <span className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-emerald-500 text-forest-950 font-mono text-[9px] font-black uppercase tracking-wider">
                    Metal: 94%
                  </span>
                </div>
              </div>
            )}

            {/* Control buttons overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => setScanActive(!scanActive)}
                className="px-3 py-1.5 rounded-xl bg-white/95 text-charcoal-800 text-xs font-bold hover:bg-white transition-all shadow-md inline-flex items-center gap-1.5"
              >
                <Scan className="w-3.5 h-3.5 text-forest-700" />
                {scanActive ? 'Hide Vision Overlay' : 'Show Vision Overlay'}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-white/95 text-charcoal-800 text-xs font-bold hover:bg-white transition-all shadow-md"
              >
                Replace Photo
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-md inline-flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Remove
              </button>
            </div>

            {/* Corner Badge */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-limeaccent-400 animate-ping" />
              <span>YOLOv8 Staging Ready</span>
            </div>
          </div>

          {compressionStats && (
            <div className="flex items-center justify-between text-xs text-forest-900 bg-forest-50/90 border border-forest-200 px-3.5 py-2 rounded-xl shadow-xs">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0" />
                <span>Client-Side Optimized: <span className="font-mono">{compressionStats.original} → <b>{compressionStats.compressed}</b></span></span>
              </span>
              <span className="font-mono font-bold text-forest-800 bg-forest-200/80 px-2 py-0.5 rounded text-[11px]">
                {compressionStats.savedPercent}% Quota Saved
              </span>
            </div>
          )}
        </div>
      ) : isCompressing ? (
        <div className="border-2 border-dashed border-forest-400 bg-forest-50/60 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-9 h-9 text-forest-600 animate-spin" />
          <div>
            <p className="text-sm font-bold text-forest-900">Compressing & Optimizing Image Resolution...</p>
            <p className="text-xs text-forest-700 mt-1">Protecting storage quota while preserving detection quality</p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
            isDragging
              ? 'border-forest-600 bg-forest-50 scale-[0.99] shadow-glow-forest'
              : 'border-sage-300 hover:border-forest-500 bg-white/80 hover:bg-offwhite-50 shadow-soft hover:shadow-soft-md'
          }`}
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-limeaccent-100/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-50 to-forest-100 text-forest-700 flex items-center justify-center mx-auto border border-forest-200 shadow-soft-xs transition-transform duration-300 group-hover:scale-110">
              <UploadCloud className="w-8 h-8 text-forest-700" />
            </div>

            <div>
              <p className="text-base font-bold text-charcoal-900">
                Click to upload photographic evidence or drag and drop
              </p>
              <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
                Supports High-Res JPG, PNG, WEBP (Intelligently compressed for smooth storage)
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-forest-800 font-bold bg-forest-100/80 hover:bg-forest-200 px-3.5 py-1.5 rounded-xl border border-forest-200 transition-colors">
                <ImageIcon className="w-3.5 h-3.5 text-forest-700" /> Browse Image Files
              </span>
              <span className="text-[11px] font-mono text-charcoal-400">
                Max 25MB raw
              </span>
            </div>
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
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs border border-rose-200 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
