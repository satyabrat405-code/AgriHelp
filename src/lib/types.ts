export type LanguageCode = 'en' | 'hi' | 'or' | 'te' | 'ta' | 'mr' | 'pa' | 'bn';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface DiseaseRemedy {
  name: string;
  dosage: string;
  application_method: string;
  safety_precautions?: string;
  approx_cost?: string;
}

export interface CropDiagnosis {
  crop_name: string;
  scientific_crop_name?: string;
  disease_detected: string;
  is_healthy: boolean;
  confidence_score: number; // 0 to 100
  urgency_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  summary_diagnosis: string;
  symptoms: string[];
  organic_treatment: {
    overview: string;
    remedies: DiseaseRemedy[];
  };
  chemical_treatment: {
    overview: string;
    medicines: DiseaseRemedy[];
  };
  prevention_tips: string[];
  recommended_fertilizers?: string[];
  audio_speech_text: {
    en: string;
    hi?: string;
    native?: string;
  };
  analyzed_at: string;
  image_preview?: string;
}

export interface UserLocation {
  city: string;
  state?: string;
  latitude: number;
  longitude: number;
  isManual?: boolean;
}

export interface AgriStore {
  id: string;
  name: string;
  address: string;
  distance_km: number;
  rating?: number;
  total_ratings?: number;
  open_now?: boolean;
  phone?: string;
  latitude: number;
  longitude: number;
  maps_url: string;
  image_url?: string;
  store_type: 'Krishi Kendra' | 'Fertilizer & Pesticide' | 'Seed & Agro Store' | 'Government Agro Center';
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  crop_name: string;
  disease_detected: string;
  is_healthy?: boolean;
  confidence_score?: number;
  image_preview?: string;
  diagnosis: CropDiagnosis;
}
