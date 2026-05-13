import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ImageUploadProps {
  images: Record<string, File>;
  setImages: React.Dispatch<React.SetStateAction<Record<string, File>>>;
  onNext: () => void;
  onBack: () => void;
}

const PLATFORMS = [
  { id: 'ambitionbox', name: 'AmbitionBox', color: '#FF6F00', description: 'Verification Screenshot' },
  { id: 'google', name: 'Google Maps', color: '#4285F4', description: 'Review Proof' },
  { id: 'glassdoor', name: 'Glassdoor', color: '#0CAA41', description: 'Employer Review' },
];

export default function ImageUpload({ images, setImages, onNext, onBack }: ImageUploadProps) {
  
  const handleFileSelect = (platformId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = Array.from(files).find(f => f.type.startsWith('image/'));
    if (file) {
      setImages(prev => ({ ...prev, [platformId]: file }));
    }
  };

  const removeImage = (e: React.MouseEvent, platformId: string) => {
    e.stopPropagation();
    setImages(prev => {
      const newImages = { ...prev };
      delete newImages[platformId];
      return newImages;
    });
  };

  const uploadedCount = Object.keys(images).length;

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Step header */}
      <div className="flex items-center gap-2 text-indigo font-bold text-[13px] uppercase tracking-wider mb-4">
        <span className="w-8 h-[2px] bg-indigo/20" />
        Step 4 of 4
      </div>
      
      <h2 className="font-serif text-3xl lg:text-[38px] font-bold text-slate mb-3 tracking-tight leading-tight">
        Supporting Evidence
      </h2>
      <p className="text-[17px] text-slate-mid font-medium mb-8">
        Optional: Attach screenshots to verify your reviews and earn double points! 🚀
      </p>

      <div className="flex-1 space-y-4">
        {PLATFORMS.map((platform, index) => {
          const file = images[platform.id];
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PlatformUploadRow 
                platform={platform}
                file={file}
                onFiles={(files) => handleFileSelect(platform.id, files)}
                onRemove={(e) => removeImage(e, platform.id)}
              />
            </motion.div>
          );
        })}

        <div className="mt-8 p-6 bg-indigo/5 rounded-3xl border border-indigo/10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-slate-800">Secure Verification</p>
            <p className="text-[13px] font-medium text-slate-500">Your screenshots are only used for reward verification.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack} 
          className="flex-1 py-5 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          Back
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className={`flex-1 py-5 rounded-2xl font-bold text-[17px] transition-all flex items-center justify-center gap-2 shadow-lg ${
            uploadedCount > 0 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-200'
              : 'bg-indigo text-white shadow-indigo-200'
          }`}
        >
          {uploadedCount > 0 ? `Submit ${uploadedCount} Proofs →` : 'Skip & Finish →'}
        </motion.button>
      </div>
    </div>
  );
}

interface PlatformUploadRowProps {
  platform: { id: string; name: string; color: string; description: string };
  file?: File;
  onFiles: (files: FileList | null) => void;
  onRemove: (e: React.MouseEvent) => void;
}

function PlatformUploadRow({ platform, file, onFiles, onRemove }: PlatformUploadRowProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFiles(e.dataTransfer.files);
  };

  return (
    <div className={`group flex flex-col sm:flex-row items-center gap-6 p-5 rounded-3xl border-2 transition-all bg-white ${
      file ? 'border-emerald-100 shadow-sm' : 'border-slate-100 hover:border-indigo/20 hover:shadow-md'
    }`}>
      {/* Left side: Platform Info */}
      <div className="flex items-center gap-4 w-full sm:w-[220px] shrink-0">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg"
          style={{ background: platform.color }}
        >
          {platform.name[0]}
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-bold text-slate-800 leading-tight">{platform.name}</span>
          <span className="text-[12px] font-medium text-slate-400 mt-0.5">{platform.description}</span>
        </div>
      </div>

      {/* Right side: Dropzone / Preview */}
      <div className="flex-1 w-full min-h-[100px]">
        <AnimatePresence mode="wait">
          {file ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative group w-full h-[100px] rounded-2xl overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 flex items-center justify-center shadow-inner"
            >
               <img
                 src={URL.createObjectURL(file)}
                 alt={`${platform.name} preview`}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                 onClick={() => document.getElementById(`file-upload-${platform.id}`)?.click()}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
               
               <div className="absolute bottom-3 left-4 flex items-center gap-2">
                 <div className="bg-emerald-500 text-white p-1 rounded-full">
                   <CheckCircle2 size={12} strokeWidth={3} />
                 </div>
                 <span className="text-white text-[11px] font-bold tracking-wide uppercase">File Ready</span>
               </div>

               <motion.button
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 onClick={onRemove}
                 className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl text-slate-500 shadow-xl flex items-center justify-center transition-colors hover:text-red-500"
                 title="Remove image"
               >
                 <X size={16} strokeWidth={2.5} />
               </motion.button>
               
               <input
                 type="file"
                 id={`file-upload-${platform.id}`}
                 className="hidden"
                 accept="image/*"
                 onChange={(e) => onFiles(e.target.files)}
               />
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              tabIndex={0}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => document.getElementById(`file-upload-${platform.id}`)?.click()}
              className={`w-full h-[100px] relative border-2 border-dashed rounded-2xl flex items-center justify-center gap-4 cursor-pointer transition-all outline-none ${
                isDragging
                  ? 'border-indigo bg-indigo/5 text-indigo'
                  : 'border-slate-200 bg-slate-50/50 text-slate-400 hover:border-indigo/40 hover:bg-indigo/[0.02]'
              }`}
            >
              <input
                 type="file"
                 id={`file-upload-${platform.id}`}
                 className="hidden"
                 accept="image/*"
                 onChange={(e) => onFiles(e.target.files)}
               />
              <motion.div 
                animate={isDragging ? { y: [0, -4, 0] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-indigo text-white shadow-indigo/20' : 'bg-white text-slate-300 shadow-sm'
                }`}
              >
                {isDragging ? <Upload size={24} /> : <ImageIcon size={24} />}
              </motion.div>
              <div className="text-left select-none">
                <p className={`text-[15px] font-bold ${isDragging ? 'text-indigo' : 'text-slate-600'}`}>
                  {isDragging ? 'Drop Image Here' : 'Upload Proof'}
                </p>
                <p className="text-[12px] font-medium text-slate-400 mt-0.5">
                  Click to browse or drag & drop
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
