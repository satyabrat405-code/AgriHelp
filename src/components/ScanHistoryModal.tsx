'use client';

import React from 'react';
import { ScanHistoryItem, LanguageCode } from '@/lib/types';
import { X, History, Trash2, ArrowRight, Sprout, ShieldCheck, AlertCircle } from 'lucide-react';

interface ScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectScan: (item: ScanHistoryItem) => void;
  onClearHistory: () => void;
  language: LanguageCode;
}

export const ScanHistoryModal: React.FC<ScanHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectScan,
  onClearHistory,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15211B]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-[24px] p-6 border border-[#E5E0D8] shadow-[0_20px_50px_rgba(19,57,46,0.15)] space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E8F3EB] text-[#13392E]">
              <History className="w-5 h-5 text-[#70B22C]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#13392E]">
                {language === 'hi' ? 'पिछले स्कैन का इतिहास' : language === 'or' ? 'ପୂର୍ବ ସ୍କାନ ଇତିହାସ' : 'Plant Scan History'}
              </h3>
              <p className="text-[11px] text-[#4B5548]">
                {history.length} {language === 'hi' ? 'स्कैन सुरक्षित हैं' : 'records stored locally'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all active:scale-95 cursor-pointer"
                title="Clear all saved scans"
              >
                <Trash2 className="w-3 h-3" />
                <span>{language === 'hi' ? 'मिटाएं' : 'Clear'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[60vh] scrollbar-none">
          {history.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Sprout className="w-12 h-12 text-[#4B5548]/40 mx-auto" />
              <p className="text-sm font-bold text-[#13392E]">
                {language === 'hi' ? 'कोई पिछला स्कैन उपलब्ध नहीं है' : 'No previous scan history found.'}
              </p>
              <p className="text-xs text-[#4B5548]">
                {language === 'hi'
                  ? 'पत्ती का फोटो लेकर जांच शुरू करें।'
                  : 'Start by capturing or uploading a crop leaf photo.'}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectScan(item);
                  onClose();
                }}
                className="p-3.5 rounded-2xl bg-[#FCFAF7] hover:bg-[#E8F3EB] border border-[#E5E0D8] hover:border-[#70B22C] cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  {item.image_preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image_preview}
                      alt={item.diagnosis.crop_name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#E5E0D8] bg-[#F7F5F0]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#E8F3EB] flex items-center justify-center text-[#13392E]">
                      <Sprout className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-[#13392E] group-hover:text-[#13392E]">
                        {item.diagnosis.crop_name}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          item.diagnosis.is_healthy
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.diagnosis.is_healthy ? 'Healthy' : item.diagnosis.urgency_level}
                      </span>
                    </div>

                    <p className="text-xs text-[#4B5548] font-medium mt-0.5">
                      {item.diagnosis.disease_detected}
                    </p>

                    <span className="text-[10px] text-[#4B5548]/70 block mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#FFFFFF] group-hover:bg-[#13392E] flex items-center justify-center text-[#13392E] group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
