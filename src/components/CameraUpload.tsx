'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, Sparkles, Image as ImageIcon, CheckCircle, Info, Zap } from 'lucide-react';
import { LanguageCode } from '@/lib/types';
import { SAMPLE_LEAF_PRESETS, SampleLeafPreset } from '@/lib/sampleData';

interface CameraUploadProps {
  onImageSelected: (base64Data: string, mimeType?: string) => void;
  onSelectPreset: (preset: SampleLeafPreset) => void;
  isAnalyzing: boolean;
  language: LanguageCode;
  selectedImagePreview?: string;
  onClearImage: () => void;
  onStartDiagnosis: () => void;
}

export const CameraUpload: React.FC<CameraUploadProps> = ({
  onImageSelected,
  onSelectPreset,
  isAnalyzing,
  language,
  selectedImagePreview,
  onClearImage,
  onStartDiagnosis,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया केवल पत्ती या पौधे की फोटो चुनें।'
          : language === 'or'
          ? 'ଦୟାକରି କେବଳ ପତ୍ର ବା ଫସଲର ଫଟୋ ବାଛନ୍ତୁ।'
          : 'Please select a valid image file (JPEG, PNG, WebP).'
      );
      return;
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(
        language === 'hi'
          ? 'फोटो का आकार 10MB से कम होना चाहिए।'
          : 'Image size should be less than 10MB.'
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Hidden file & camera triggers */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
        id="camera-capture-input"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        id="file-upload-input"
      />

      {/* Main Hero & Upload Card (VerdaAgro Editorial Style) */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-[24px] p-5 sm:p-8 shadow-[0_8px_30px_rgba(19,57,46,0.06)] relative overflow-hidden">
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E8F3EB] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-60" />

        {/* Hero Title & Subtext */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3EB] text-[#13392E] text-xs font-bold border border-[#CFE6D5] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#70B22C]" />
            <span>
              {language === 'hi'
                ? 'गूगल जेमिनी एआई द्वारा संचालित'
                : language === 'or'
                ? 'ଗୁଗୁଲ୍ ଜେମିନି AI ଦ୍ୱାରା ପରିଚାଳିତ'
                : 'Powered by Google Gemini Vision AI'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#13392E]">
            {language === 'hi'
              ? 'फसल की बीमारी तुरंत पहचानें'
              : language === 'or'
              ? 'ଫସଲ ରୋଗ ତୁରନ୍ତ ଚିହ୍ନଟ କରନ୍ତୁ'
              : 'Diagnose Your Crop Instantly'}
          </h2>

          <p className="text-xs sm:text-sm text-[#4B5548] leading-relaxed">
            {language === 'hi'
              ? 'पत्ती का फोटो लें, बीमारी की सटीक पहचान करें और नजदीकी दुकान पर मिलने वाली दवा की जानकारी पाएं।'
              : language === 'or'
              ? 'ପତ୍ରର ଫଟୋ ଉଠାନ୍ତୁ, ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ ଏବଂ ନିକଟସ୍ଥ ଦୋକାନରୁ ଔଷଧ ପାଆନ୍ତୁ।'
              : 'Capture leaf photo to identify diseases, get organic & chemical remedies, and locate verified medicines nearby.'}
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Image Preview OR Dual Action Zone */}
        {selectedImagePreview ? (
          <div className="space-y-4 animate-fade-in">
            {/* Image Preview Box with Scanning Guide & Animation */}
            <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-[#15211B] border-2 border-[#13392E] shadow-inner group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImagePreview}
                alt="Selected Crop Leaf Preview"
                className="w-full h-full object-contain"
              />

              {/* Scanning Beam Animation when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none bg-emerald-950/20 backdrop-blur-[1px]">
                  <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-[#84CC16] to-transparent shadow-[0_0_15px_#84CC16] animate-scan-beam absolute top-0" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-4 py-2 rounded-full bg-[#13392E]/90 text-[#84CC16] text-xs font-bold shadow-lg border border-[#70B22C]/40 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#84CC16]" />
                      <span>
                        {language === 'hi'
                          ? 'जेमिनी विज़न एआई विश्लेषण कर रहा है...'
                          : language === 'or'
                          ? 'Gemini AI ବିଶ୍ଳେଷଣ କରୁଛି...'
                          : 'Analyzing with Gemini Vision AI...'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset/Retake Button */}
              {!isAnalyzing && (
                <button
                  type="button"
                  onClick={onClearImage}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-[#15211B]/80 hover:bg-[#15211B] text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all shadow"
                >
                  ✕ {language === 'hi' ? 'हटाएं / नया फोटो' : 'Retake'}
                </button>
              )}
            </div>

            {/* Action Trigger Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onStartDiagnosis}
                disabled={isAnalyzing}
                className="flex-1 h-14 rounded-full bg-[#13392E] hover:bg-[#1a473a] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base shadow-[0_4px_16px_rgba(19,57,46,0.15)] flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-[#84CC16]" />
                    <span>
                      {language === 'hi' ? 'जांच जारी है...' : 'Diagnosing Plant Health...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#84CC16]" />
                    <span>
                      {language === 'hi'
                        ? 'रोग की जांच शुरू करें (Diagnose AI)'
                        : language === 'or'
                        ? 'ରୋଗ ପରୀକ୍ଷା ଆରମ୍ଭ କରନ୍ତୁ'
                        : 'Run Instant AI Diagnosis'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClearImage}
                disabled={isAnalyzing}
                className="h-14 px-6 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] font-bold text-sm border border-[#D8D1C3] transition-all disabled:opacity-60"
              >
                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          /* Dual Action Upload Dropzone */
          <div className="space-y-4">
            {/* Visual Drag & Drop Container */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`p-6 sm:p-10 rounded-[20px] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center space-y-4 ${
                dragActive
                  ? 'border-[#70B22C] bg-[#E8F3EB]'
                  : 'border-[#C8D4C9] bg-[#FCFAF7] hover:border-[#13392E]'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#E8F3EB] flex items-center justify-center text-[#13392E] shadow-sm">
                <Camera className="w-8 h-8 text-[#13392E]" />
              </div>

              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold text-[#13392E]">
                  {language === 'hi'
                    ? 'पत्ती का फोटो खींचें या गैलरी से चुनें'
                    : language === 'or'
                    ? 'ପତ୍ରର ଫଟୋ ଉଠାନ୍ତୁ ବା ଗ୍ୟାଲେରୀରୁ ବାଛନ୍ତୁ'
                    : 'Snap a leaf photo or drop an image here'}
                </p>
                <p className="text-xs text-[#4B5548]">
                  Supports high-resolution JPG, PNG, WebP (Max 10MB)
                </p>
              </div>

              {/* Dual Action Pill Buttons */}
              <div className="w-full max-w-md pt-2 flex flex-col sm:flex-row gap-3">
                {/* Primary Button: Direct Camera Trigger */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 h-13 py-3.5 px-6 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(19,57,46,0.15)] flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4 text-[#84CC16]" />
                  <span>{language === 'hi' ? '📷 कैमरा से फोटो लें' : language === 'or' ? '📷 କ୍ୟାମେରାରୁ ଫଟୋ ଉଠାନ୍ତୁ' : '📷 Take Live Photo'}</span>
                </button>

                {/* Secondary Button: Gallery Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-13 py-3.5 px-6 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] font-extrabold text-xs sm:text-sm border border-[#13392E]/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Upload className="w-4 h-4 text-[#13392E]" />
                  <span>{language === 'hi' ? '📁 गैलरी से चुनें' : language === 'or' ? '📁 ଗ୍ୟାଲେରୀରୁ ବାଛନ୍ତୁ' : '📁 Upload Leaf Photo'}</span>
                </button>
              </div>
            </div>

            {/* Interactive Leaf Presets (Demo Quick Samples) */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#13392E] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#70B22C]" />
                  {language === 'hi'
                    ? 'या तुरंत टेस्ट करने के लिए सैंपल पत्ता चुनें:'
                    : language === 'or'
                    ? 'ନମୁନା ପତ୍ର ଚୟନ କରନ୍ତୁ:'
                    : 'Or Try Instant Demo Crop Samples:'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {SAMPLE_LEAF_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectPreset(preset)}
                    className="p-3 rounded-2xl bg-[#FFFFFF] hover:bg-[#E8F3EB] border border-[#E5E0D8] hover:border-[#70B22C] text-left transition-all group flex flex-col justify-between space-y-2 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌿</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          preset.severity === 'Healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : preset.severity === 'Critical' || preset.severity === 'High'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {preset.severity}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-extrabold text-[#13392E] group-hover:text-[#13392E] line-clamp-1">
                        {preset.crop}
                      </h4>
                      <p className="text-[11px] text-[#4B5548] line-clamp-1">
                        {preset.disease}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
