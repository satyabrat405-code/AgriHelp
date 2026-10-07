'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Search, X, Check, Globe } from 'lucide-react';
import { UserLocation, LanguageCode } from '@/lib/types';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (loc: UserLocation) => void;
  onDetectGPS: () => void;
  language: LanguageCode;
  isDetectingGPS: boolean;
}

const POPULAR_AGRICULTURAL_CITIES: UserLocation[] = [
  { city: 'Bhubaneswar', state: 'Odisha', latitude: 20.2961, longitude: 85.8245, isManual: true },
  { city: 'Cuttack', state: 'Odisha', latitude: 20.4625, longitude: 85.8830, isManual: true },
  { city: 'Sambalpur', state: 'Odisha', latitude: 21.4669, longitude: 83.9812, isManual: true },
  { city: 'Balasore', state: 'Odisha', latitude: 21.4934, longitude: 86.9135, isManual: true },
  { city: 'Berhampur', state: 'Odisha', latitude: 19.3150, longitude: 84.7941, isManual: true },
  { city: 'Patna', state: 'Bihar', latitude: 25.5941, longitude: 85.1376, isManual: true },
  { city: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3176, longitude: 82.9739, isManual: true },
  { city: 'Ludhiana', state: 'Punjab', latitude: 30.9010, longitude: 75.8573, isManual: true },
  { city: 'Indore', state: 'Madhya Pradesh', latitude: 22.7196, longitude: 75.8577, isManual: true },
  { city: 'New Delhi', state: 'Delhi NCR', latitude: 28.6139, longitude: 77.2090, isManual: true },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onDetectGPS,
  language,
  isDetectingGPS,
}) => {
  const [manualQuery, setManualQuery] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    // Check if matching popular city
    const match = POPULAR_AGRICULTURAL_CITIES.find(
      (c) => c.city.toLowerCase().includes(manualQuery.trim().toLowerCase())
    );

    if (match) {
      onSelectLocation(match);
      onClose();
    } else {
      // Default to the entered city with fallback nearby coords
      onSelectLocation({
        city: manualQuery.trim(),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        isManual: true,
      });
      onClose();
    }
  };

  const filteredCities = POPULAR_AGRICULTURAL_CITIES.filter((c) =>
    c.city.toLowerCase().includes(manualQuery.toLowerCase()) ||
    (c.state && c.state.toLowerCase().includes(manualQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15211B]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-[24px] p-6 border border-[#E5E0D8] shadow-[0_20px_50px_rgba(19,57,46,0.15)] space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E8F3EB] text-[#13392E]">
              <MapPin className="w-5 h-5 text-[#70B22C]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#13392E]">
                {language === 'hi' ? 'स्थान चुनें या बदलें' : language === 'or' ? 'ସ୍ଥାନ ବାଛନ୍ତୁ' : 'Select or Change Location'}
              </h3>
              <p className="text-[11px] text-[#4B5548]">
                {language === 'hi' ? 'नजदीकी दुकानों की सटीक दूरी के लिए' : 'For accurate nearby agricultural stores'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live GPS Auto-Detect Button */}
        <button
          type="button"
          onClick={() => {
            onDetectGPS();
            onClose();
          }}
          disabled={isDetectingGPS}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white text-xs sm:text-sm font-extrabold shadow-[0_4px_16px_rgba(19,57,46,0.15)] active:scale-95 transition-all cursor-pointer"
        >
          <Navigation className={`w-4 h-4 text-[#84CC16] ${isDetectingGPS ? 'animate-spin' : ''}`} />
          <span>
            {isDetectingGPS
              ? 'जीपीएस से स्थान खोजा जा रहा है...'
              : language === 'hi'
              ? '📍 मेरे वर्तमान GPS से स्वतः पहचानें (Auto-Detect)'
              : language === 'or'
              ? '📍 ବର୍ତ୍ତମାନର GPS ସ୍ଥାନ ବ୍ୟବହାର କରନ୍ତୁ'
              : '📍 Use Current GPS Location (Auto-Detect)'}
          </span>
        </button>

        {/* Manual City Search Bar */}
        <form onSubmit={handleManualSubmit} className="relative">
          <Search className="w-4 h-4 text-[#4B5548] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={manualQuery}
            onChange={(e) => setManualQuery(e.target.value)}
            placeholder={language === 'hi' ? 'जिले या शहर का नाम लिखें...' : 'Type city or district name...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FCFAF7] border border-[#E5E0D8] text-xs sm:text-sm text-[#13392E] placeholder-[#4B5548]/70 focus:outline-none focus:border-[#13392E] transition-all"
          />
        </form>

        {/* Popular Agro Districts List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-64 scrollbar-none">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#13392E] block mb-2">
            {language === 'hi' ? 'प्रमुख कृषि जिले व शहर:' : 'Popular Agricultural Hubs:'}
          </span>

          {filteredCities.map((item) => {
            const isSelected = currentLocation.city.toLowerCase() === item.city.toLowerCase();
            return (
              <button
                key={item.city}
                type="button"
                onClick={() => {
                  onSelectLocation(item);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left text-xs transition-all ${
                  isSelected
                    ? 'bg-[#E8F3EB] border border-[#70B22C] text-[#13392E] font-extrabold'
                    : 'bg-[#FCFAF7] hover:bg-[#F3EFE8] border border-[#E5E0D8] text-[#13392E]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#70B22C]' : 'text-[#4B5548]'}`} />
                  <div>
                    <span className="font-bold">{item.city}</span>
                    {item.state && <span className="text-[11px] text-[#4B5548] ml-1.5">({item.state})</span>}
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#70B22C]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
