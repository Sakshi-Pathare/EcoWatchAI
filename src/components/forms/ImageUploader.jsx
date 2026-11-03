import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

export function ImageUploader({ imagePreview, onImageChange, onImageClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageChange(e.target.result, file);
    };
    reader.readAsDataURL(file);
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
              onClick={onImageClear}
              className="px-3 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-semibold hover:bg-rose-600 transition-colors inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
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
            Supports High-Res JPG, PNG, WEBP (Max 10MB)
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

