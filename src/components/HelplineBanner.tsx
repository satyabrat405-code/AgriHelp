'use client';

import React from 'react';
import { Phone, ShieldAlert, Sparkles, MapPin } from 'lucide-react';
import { LanguageCode } from '@/lib/types';

interface HelplineBannerProps {
  language: LanguageCode;
  onLocateStore: () => void;
}

export const HelplineBanner: React.FC<HelplineBannerProps> = ({ language, onLocateStore }) => {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-y border-emerald-500/20 py-2 px-4 text-xs text-slate-300">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'hi' ? 'किसान सहायता डेस्क:' : 'Farmer Support Advisory:'}
          </span>
          <span className="text-slate-300 hidden sm:inline">
            {language === 'hi'
              ? 'फसल सुरक्षा, कीटनाशक खुराक व नजदीकी कृषि केंद्र की मुफ्त जानकारी'
              : 'Free crop diagnosis, exact pesticide dosage & local store navigation'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={onLocateStore}
            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 underline underline-offset-2"
          >
            <MapPin className="w-3 h-3" />
            {language === 'hi' ? 'नजदीकी खाद-बीज दुकान' : 'Find Nearby Agri Stores'}
          </button>

          <a
            href="tel:18001801551"
            className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-amber-400" />
            1800-180-1551 (Toll-Free)
          </a>
        </div>
      </div>
    </div>
  );
};
