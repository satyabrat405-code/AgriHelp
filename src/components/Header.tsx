'use client';

import React from 'react';
import { Sprout, Globe, MapPin, History } from 'lucide-react';
import { LanguageCode, UserLocation } from '@/lib/types';
import { SUPPORTED_LANGUAGES } from '@/lib/sampleData';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenHistory: () => void;
  hasHistory: boolean;
  userLocation: UserLocation;
  onOpenLocationModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenHistory,
  hasHistory,
  userLocation,
  onOpenLocationModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#F7F5F0]/90 border-b border-[#E5E0D8] transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#13392E] text-[#84CC16] shadow-sm">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#13392E] flex items-center gap-1">
                AgriHelp <span className="text-[#70B22C]">AI</span>
              </h1>
              <span className="inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E8F3EB] text-[#13392E] border border-[#CFE6D5]">
                AI Doctor
              </span>
            </div>
            <p className="text-[11px] text-[#4B5548] hidden xs:block font-medium">
              {currentLanguage === 'hi'
                ? 'स्मार्ट फसल रोग पहचान एवं उपचार'
                : currentLanguage === 'or'
                ? 'ସ୍ମାର୍ଟ ଫସଲ ରୋଗ ଚିହ୍ନଟ ଏବଂ ପ୍ରତିକାର'
                : 'Smart Crop Diagnostics & Remedy Finder'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live GPS / City Selector Pill */}
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFE8] text-[#13392E] text-xs font-semibold border border-[#E5E0D8] shadow-sm transition-all active:scale-95"
            title="Change Location / Detect GPS"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#70B22C]"></span>
            </span>
            <span className="max-w-[85px] sm:max-w-[120px] truncate">{userLocation.city}</span>
          </button>

          {/* Language Selector Pill */}
          <div className="flex items-center bg-[#EDE8DF] rounded-full p-0.5 border border-[#D8D1C3]">
            <Globe className="w-3.5 h-3.5 text-[#4B5548] ml-2 mr-1 hidden sm:inline" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-xs font-bold text-[#13392E] py-1 px-2.5 rounded-full focus:outline-none cursor-pointer"
              aria-label="Select Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#FFFFFF] text-[#13392E]">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center justify-center p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFE8] text-[#13392E] text-xs font-semibold border border-[#E5E0D8] shadow-sm transition-all active:scale-95"
            title="View Scan History"
          >
            <History className="w-4 h-4 text-[#13392E]" />
            <span className="hidden md:inline ml-1.5">History</span>
            {hasHistory && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#70B22C] rounded-full ring-2 ring-[#F7F5F0]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
