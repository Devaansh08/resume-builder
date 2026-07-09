import React, { useRef, useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { parseFile } from '../../utils/fileParser';
import { Upload, X, FileText, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ImportModal({ isOpen, onClose, onSuccess }: ImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { currentResume, createNewResume, setCurrentResume } = useResumeStore();

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setIsParsing(true);
    setErrorMsg(null);

    try {
      const parsedSections = await parseFile(file);
      const title = file.name.replace(/\.[^/.]+$/, '') || 'My Resume';
      
      if (currentResume) {
        const updated = {
          ...currentResume,
          title,
          sections: parsedSections,
          updatedAt: new Date().toISOString(),
        };
        setCurrentResume(updated);
      } else {
        const resume = createNewResume(title);
        resume.sections = parsedSections;
        setCurrentResume(resume);
      }

      setIsParsing(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error('[File Import Parse Error]', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to parse file. Please verify it is a valid .pdf, .docx, or .txt file.');
      setIsParsing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-surface-900 border border-gray-100 dark:border-surface-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Upload size={18} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">
                Upload & Import Resume
              </h3>
              <p className="text-xs text-gray-500">
                Instantly convert your PDF, DOCX, or TXT into editable sections
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !isParsing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[0.99]'
                : 'border-gray-200 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-gray-50/50 dark:hover:bg-surface-800/40'
            } ${isParsing ? 'pointer-events-none opacity-80' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            {isParsing ? (
              <div className="py-6 flex flex-col items-center justify-center space-y-3">
                <Loader2 size={36} className="text-brand-500 animate-spin" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Extracting text & formatting sections...
                </div>
                <p className="text-xs text-gray-500 max-w-xs">
                  Our ATS intelligence is organizing your work experience, education, and skills into clean layout components.
                </p>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mx-auto shadow-sm">
                  <FileText size={26} />
                </div>
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">
                    Click to browse or drag & drop file here
                  </span>
                  <span className="text-xs text-gray-500 mt-1 block">
                    Supported formats: .pdf, .docx, .txt (up to 10MB)
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <span className="badge bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-[11px] gap-1 px-2.5 py-1">
                    <Sparkles size={12} /> ATS Auto-Parsing
                  </span>
                </div>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
              <div className="flex-1">
                <strong className="block font-semibold mb-0.5">Upload Error</strong>
                {errorMsg}
              </div>
            </div>
          )}

          <div className="mt-6 bg-gray-50 dark:bg-surface-800/60 rounded-xl p-3.5 flex items-start gap-3">
            <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white block mb-0.5">How our file import works:</span>
              Your document is processed locally inside your browser using PDF.js and Word extraction engines. Your sensitive personal data never leaves your device.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-surface-800/80 border-t border-gray-100 dark:border-surface-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isParsing}
            className="btn btn-ghost btn-md text-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
