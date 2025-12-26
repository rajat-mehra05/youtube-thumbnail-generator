'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_MB } from '@/lib/constants';

interface ImageDropzoneProps {
  preview: string | null;
  onFileChange: (file: File | null, preview: string | null) => void;
  disabled?: boolean;
}

export const ImageDropzone = ({ preview, onFileChange, disabled }: ImageDropzoneProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFile = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please upload a valid image file (PNG, JPG, WebP, GIF)');
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onFileChange(file, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-violet-500 bg-violet-500/5' : 'border-border hover:border-violet-500/50'}`}
    >
      {preview ? (
        <div className="relative aspect-video max-w-md mx-auto">
          <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
          <button type="button" onClick={() => onFileChange(null, null)} className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70">✕</button>
        </div>
      ) : (
        <>
          <div className="text-4xl mb-4">📷</div>
          <p className="font-medium mb-1">Drag and drop your image here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
          <input type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={disabled} />
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF up to {MAX_FILE_SIZE_MB}MB</p>
        </>
      )}
    </div>
  );
};
