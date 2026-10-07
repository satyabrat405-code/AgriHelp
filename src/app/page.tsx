'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { CameraUpload } from '@/components/CameraUpload';
import { DiagnosisResult } from '@/components/DiagnosisResult';
import { StoreLocator } from '@/components/StoreLocator';
import { ScanHistoryModal } from '@/components/ScanHistoryModal';
import { LocationModal } from '@/components/LocationModal';
import {
  CropDiagnosis,
  LanguageCode,
  ScanHistoryItem,
  UserLocation,
} from '@/lib/types';
import { SampleLeafPreset } from '@/lib/sampleData';
import { Sprout, PhoneCall, CheckCircle, ShieldCheck } from 'lucide-react';

const DEFAULT_LOCATION: UserLocation = {
  city: 'Bhubaneswar',
  state: 'Odisha',
  latitude: 20.2961,
  longitude: 85.8245,
  isManual: false,
};

export default function Home() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [currentDiagnosis, setCurrentDiagnosis] = useState<CropDiagnosis | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string | undefined>(undefined);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [highlightMedicine, setHighlightMedicine] = useState<string | undefined>(undefined);

  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem('agrihelp_scan_history') || localStorage.getItem('agricure_scan_history');
        if (savedHistory) {
          setScanHistory(JSON.parse(savedHistory));
        }

        const savedActive = localStorage.getItem('agrihelp_active_diagnosis') || localStorage.getItem('agricure_active_diagnosis');
        const savedImage = localStorage.getItem('agrihelp_active_image') || localStorage.getItem('agricure_active_image');
        if (savedActive) {
          setCurrentDiagnosis(JSON.parse(savedActive));
        }
        if (savedImage) {
          setCurrentImagePreview(savedImage);
        }

        const savedLocation = localStorage.getItem('agrihelp_user_location') || localStorage.getItem('agricure_user_location');
        if (savedLocation) {
          setUserLocation(JSON.parse(savedLocation));
        } else {
          detectLiveGPSLocation();
        }

        const savedLang = (localStorage.getItem('agrihelp_language') || localStorage.getItem('agricure_language')) as LanguageCode;
        if (savedLang) {
          setCurrentLanguage(savedLang);
        }
      } catch (e) {
        console.warn('Failed to parse localStorage session:', e);
      }
    }
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrihelp_language', lang);
    }
  };

  const handleSelectLocation = (loc: UserLocation) => {
    setUserLocation(loc);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrihelp_user_location', JSON.stringify(loc));
    }
  };

  const detectLiveGPSLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        let detectedCity = 'Detected Location';

        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
          );
          const geoData = await geoRes.json();
          detectedCity =
            geoData.address?.city ||
            geoData.address?.town ||
            geoData.address?.district ||
            geoData.address?.county ||
            'My Location';
        } catch {
          detectedCity = `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
        }

        const detected: UserLocation = {
          city: detectedCity,
          latitude: lat,
          longitude: lng,
          isManual: false,
        };

        setUserLocation(detected);
        if (typeof window !== 'undefined') {
          localStorage.setItem('agrihelp_user_location', JSON.stringify(detected));
        }
        setIsDetectingGPS(false);
      },
      (err) => {
        console.warn('GPS location detection failed:', err.message);
        setIsDetectingGPS(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const saveScanToHistory = (diagnosis: CropDiagnosis, imagePreview?: string) => {
    const newItem: ScanHistoryItem = {
      id: `scan-${Date.now()}`,
      timestamp: Date.now(),
      crop_name: diagnosis.crop_name,
      disease_detected: diagnosis.disease_detected,
      image_preview: imagePreview,
      diagnosis,
    };

    const updated = [newItem, ...scanHistory].slice(0, 20);
    setScanHistory(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('agrihelp_scan_history', JSON.stringify(updated));
      localStorage.setItem('agrihelp_active_diagnosis', JSON.stringify(diagnosis));
      if (imagePreview) {
        localStorage.setItem('agrihelp_active_image', imagePreview);
      }
    }
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrihelp_scan_history');
    }
  };

  const handleImageSelected = (base64Data: string, mimeType: string = 'image/jpeg') => {
    setCurrentImagePreview(base64Data);
    setSelectedMimeType(mimeType);
    setSelectedPresetId(undefined);
  };

  const handleSelectPreset = (preset: SampleLeafPreset) => {
    setCurrentImagePreview(preset.svgDataUri);
    setSelectedMimeType('image/svg+xml');
    setSelectedPresetId(preset.id);

    // Auto-run diagnosis for demo preset
    runDiagnosis(preset.svgDataUri, 'image/svg+xml', preset.id);
  };

  const runDiagnosis = async (
    imageBase64: string = currentImagePreview || '',
    mimeType: string = selectedMimeType,
    presetId?: string
  ) => {
    if (!imageBase64) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          language: currentLanguage,
          presetId: presetId || selectedPresetId,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        setCurrentDiagnosis(json.data);
        saveScanToHistory(json.data, imageBase64);

        // Smooth scroll to diagnosis result
        setTimeout(() => {
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }, 150);
      } else {
        alert(json.error || 'Failed to diagnose leaf. Please try a clearer picture.');
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      alert('Network error while connecting to AI Diagnostic engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentDiagnosis(null);
    setCurrentImagePreview(undefined);
    setSelectedPresetId(undefined);
    setHighlightMedicine(undefined);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('agrihelp_active_diagnosis');
      localStorage.removeItem('agrihelp_active_image');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToShop = (medicineKeyword?: string) => {
    setHighlightMedicine(medicineKeyword);
    const element = document.getElementById('nearby-stores-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectHistoricalScan = (item: ScanHistoryItem) => {
    setCurrentDiagnosis(item.diagnosis);
    setCurrentImagePreview(item.image_preview);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrihelp_active_diagnosis', JSON.stringify(item.diagnosis));
      if (item.image_preview) {
        localStorage.setItem('agrihelp_active_image', item.image_preview);
      }
    }
    setTimeout(() => {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#15211B] pb-16">
      {/* 1. Header with Location Selector */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
        onOpenHistory={() => setIsHistoryOpen(true)}
        hasHistory={scanHistory.length > 0}
        userLocation={userLocation}
        onOpenLocationModal={() => setIsLocationOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Feature 1: Camera & Upload Section */}
        <section className="no-print">
          <CameraUpload
            onImageSelected={handleImageSelected}
            onSelectPreset={handleSelectPreset}
            isAnalyzing={isLoading}
            language={currentLanguage}
            selectedImagePreview={currentImagePreview}
            onClearImage={handleReset}
            onStartDiagnosis={() => runDiagnosis()}
          />
        </section>

        {/* Feature 2: Gemini Diagnosis Results & TTS Audio */}
        {currentDiagnosis && (
          <section className="space-y-6">
            <DiagnosisResult
              diagnosis={currentDiagnosis}
              language={currentLanguage}
              onReset={handleReset}
              onNavigateToShop={handleNavigateToShop}
              imagePreview={currentImagePreview}
            />
          </section>
        )}

        {/* Feature 3: Nearby Agri-Shop Locator with Photos & Dynamic Location */}
        <section className="no-print pt-2">
          <StoreLocator
            language={currentLanguage}
            highlightMedicine={highlightMedicine}
            userLocation={userLocation}
            onOpenLocationModal={() => setIsLocationOpen(true)}
          />
        </section>
      </main>

      {/* Footer (VerdaAgro Style) */}
      <footer className="w-full border-t border-[#E5E0D8] bg-[#FFFFFF] text-xs text-[#4B5548] py-8 px-4 no-print mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#13392E] flex items-center justify-center text-[#84CC16]">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-[#13392E]">AgriHelp AI</span>
            <span>— Smart Crop Doctor & Agro Remedy Hub</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[#4B5548] font-semibold">
            <a href="tel:18001801551" className="hover:text-[#13392E] flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#70B22C]" />
              <span>Kisan Toll-Free: 1800-180-1551</span>
            </a>
            <span>•</span>
            <a
              href="https://farmer.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#13392E] transition-colors"
            >
              Farmer Portal (Govt of India) ↗
            </a>
          </div>
        </div>
      </footer>

      {/* Scan History Drawer/Modal */}
      <ScanHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={scanHistory}
        onSelectScan={handleSelectHistoricalScan}
        onClearHistory={handleClearHistory}
        language={currentLanguage}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={handleSelectLocation}
        onDetectGPS={detectLiveGPSLocation}
        language={currentLanguage}
        isDetectingGPS={isDetectingGPS}
      />
    </div>
  );
}
