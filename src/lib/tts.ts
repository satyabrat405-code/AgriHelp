import { LanguageCode } from './types';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  currentLanguage: LanguageCode;
  rate: number;
}

export class TextToSpeechManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: ((state: { isPlaying: boolean; isPaused: boolean }) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return !!this.synth;
  }

  public subscribe(callback: (state: { isPlaying: boolean; isPaused: boolean }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notify(isPlaying: boolean, isPaused: boolean) {
    this.listeners.forEach(cb => cb({ isPlaying, isPaused }));
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public getBestVoiceForLanguage(lang: LanguageCode): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (!voices.length) return null;

    const langPrefixMap: Record<LanguageCode, string[]> = {
      en: ['en-IN', 'en-US', 'en-GB', 'en'],
      hi: ['hi-IN', 'hi'],
      or: ['or-IN', 'or', 'hi-IN', 'en-IN'],
      te: ['te-IN', 'te', 'hi-IN', 'en-IN'],
      mr: ['mr-IN', 'mr', 'hi-IN', 'en-IN'],
      ta: ['ta-IN', 'ta', 'en-IN'],
      pa: ['pa-IN', 'pa', 'hi-IN', 'en-IN'],
      bn: ['bn-IN', 'bn', 'hi-IN', 'en-IN'],
    };

    const targetPrefixes = langPrefixMap[lang] || ['en'];

    for (const prefix of targetPrefixes) {
      const match = voices.find(v => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
      if (match) return match;
    }

    return voices[0] || null;
  }

  public speak(text: string, lang: LanguageCode = 'en', rate: number = 1.0) {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.stop();

    if (!text || text.trim().length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voice = this.getBestVoiceForLanguage(lang);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    }

    utterance.onstart = () => {
      this.notify(true, false);
    };

    utterance.onpause = () => {
      this.notify(true, true);
    };

    utterance.onresume = () => {
      this.notify(true, false);
    };

    utterance.onend = () => {
      this.notify(false, false);
      this.currentUtterance = null;
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis utterance error:', e);
      this.notify(false, false);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
      this.notify(true, true);
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
      this.notify(true, false);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false, false);
      this.currentUtterance = null;
    }
  }
}

export const ttsManager = new TextToSpeechManager();
