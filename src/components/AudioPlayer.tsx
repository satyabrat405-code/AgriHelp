'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Volume2, FastForward } from 'lucide-react';
import { LanguageCode } from '@/lib/types';
import { ttsManager } from '@/lib/tts';

interface AudioPlayerProps {
  speechTexts: {
    en: string;
    hi?: string;
    native?: string;
  };
  currentLanguage: LanguageCode;
  cropName: string;
  diseaseName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  speechTexts,
  currentLanguage,
  cropName,
  diseaseName,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [selectedAudioLang, setSelectedAudioLang] = useState<LanguageCode>(
    currentLanguage === 'hi' ? 'hi' : currentLanguage === 'or' ? 'or' : 'en'
  );

  // Sync selectedAudioLang if currentLanguage changes
  useEffect(() => {
    setSelectedAudioLang(currentLanguage === 'hi' ? 'hi' : currentLanguage === 'or' ? 'or' : 'en');
  }, [currentLanguage]);

  useEffect(() => {
    const unsubscribe = ttsManager.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsPaused(state.isPaused);
    });

    return () => {
      ttsManager.stop();
      unsubscribe();
    };
  }, []);

  const getActiveText = (): string => {
    if (selectedAudioLang === 'hi' && speechTexts?.hi) {
      return speechTexts.hi;
    }
    if (selectedAudioLang === 'en' && speechTexts?.en) {
      return speechTexts.en;
    }
    return speechTexts?.native || speechTexts?.hi || speechTexts?.en || `${cropName || 'Crop'}: ${diseaseName || 'Advisory'}`;
  };

  const handlePlay = () => {
    const textToSpeak = getActiveText();
    ttsManager.speak(textToSpeak, selectedAudioLang, speechRate);
  };

  const handlePause = () => {
    ttsManager.pause();
  };

  const handleResume = () => {
    ttsManager.resume();
  };

  const handleStop = () => {
    ttsManager.stop();
  };

  const toggleRate = () => {
    const nextRate = speechRate === 1.0 ? 1.2 : speechRate === 1.2 ? 0.85 : 1.0;
    setSpeechRate(nextRate);
    if (isPlaying && !isPaused) {
      ttsManager.speak(getActiveText(), selectedAudioLang, nextRate);
    }
  };

  return (
    <div className="w-full rounded-[24px] p-4 sm:p-5 bg-[#E8F3EB] border border-[#CFE6D5] shadow-[0_4px_20px_rgba(19,57,46,0.06)] relative overflow-hidden transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left Info & Soundwave Indicator */}
        <div className="flex items-center gap-3.5">
          {/* High-visibility Play/Pause circular button in Deep Forest Green #13392E */}
          <button
            type="button"
            onClick={isPlaying ? (isPaused ? handleResume : handlePause) : handlePlay}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white shadow-md active:scale-95 transition-all flex-shrink-0 cursor-pointer"
            aria-label={isPlaying && !isPaused ? 'Pause Speech' : 'Play Voice Advisory'}
          >
            {isPlaying && !isPaused ? (
              <Pause className="w-5 h-5 fill-white text-white" />
            ) : (
              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-[#13392E]">
                {selectedAudioLang === 'hi'
                  ? '🔊 आवाज़ में सलाह सुनें (Audio Prescription)'
                  : selectedAudioLang === 'or'
                  ? '🔊 ଧ୍ୱନି ପରାମର୍ଶ ଶୁଣନ୍ତୁ'
                  : '🔊 Play Audio Prescription'}
              </span>
              {isPlaying && !isPaused && (
                <div className="flex items-end justify-center h-4 gap-0.5">
                  <span className="sound-bar" />
                  <span className="sound-bar" />
                  <span className="sound-bar" />
                  <span className="sound-bar" />
                  <span className="sound-bar" />
                </div>
              )}
            </div>
            <p className="text-xs text-[#4B5548] line-clamp-1 font-medium mt-0.5">
              {getActiveText()}
            </p>
          </div>
        </div>

        {/* Right Audio Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#CFE6D5]">
          {/* Language Switcher for Audio */}
          <div className="flex items-center bg-[#FFFFFF] rounded-full p-0.5 border border-[#CFE6D5] text-xs">
            {currentLanguage === 'or' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAudioLang('or');
                  if (isPlaying) ttsManager.speak(speechTexts?.native || speechTexts?.hi || speechTexts?.en, 'or', speechRate);
                }}
                className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                  selectedAudioLang === 'or'
                    ? 'bg-[#13392E] text-white shadow-sm'
                    : 'text-[#4B5548] hover:text-[#13392E]'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedAudioLang('hi');
                if (isPlaying) ttsManager.speak(speechTexts?.hi || speechTexts?.en, 'hi', speechRate);
              }}
              className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                selectedAudioLang === 'hi'
                  ? 'bg-[#13392E] text-white shadow-sm'
                  : 'text-[#4B5548] hover:text-[#13392E]'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedAudioLang('en');
                if (isPlaying) ttsManager.speak(speechTexts?.en, 'en', speechRate);
              }}
              className={`px-2.5 py-1 rounded-full font-bold transition-all ${
                selectedAudioLang === 'en'
                  ? 'bg-[#13392E] text-white shadow-sm'
                  : 'text-[#4B5548] hover:text-[#13392E]'
              }`}
            >
              EN
            </button>
          </div>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={toggleRate}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFFFF] hover:bg-[#F3EFE8] text-[#13392E] text-xs font-bold border border-[#CFE6D5] transition-all"
            title="Toggle Voice Speed"
          >
            <FastForward className="w-3 h-3 text-[#70B22C]" />
            <span>{speechRate}x</span>
          </button>

          {/* Stop Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={handleStop}
              className="p-1.5 rounded-full bg-[#FFFFFF] hover:bg-red-50 text-red-600 border border-red-200 transition-all"
              title="Stop Speech"
            >
              <Square className="w-3.5 h-3.5 fill-red-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
