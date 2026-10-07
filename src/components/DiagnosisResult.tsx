'use client';

import React, { useState } from 'react';
import {
  CropDiagnosis,
  LanguageCode,
} from '@/lib/types';
import { AudioPlayer } from './AudioPlayer';
import {
  ShieldCheck,
  AlertTriangle,
  Leaf,
  FlaskConical,
  ShieldAlert,
  Sprout,
  Printer,
  RotateCcw,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
} from 'lucide-react';

interface DiagnosisResultProps {
  diagnosis: CropDiagnosis;
  language: LanguageCode;
  onReset: () => void;
  onNavigateToShop: (medicineKeyword?: string) => void;
  imagePreview?: string;
}

// Convert any dollar ($) prices to Indian Rupees (₹)
export const formatRupeePrice = (priceStr?: string): string => {
  if (!priceStr) return '';
  if (priceStr.includes('₹')) return priceStr;

  // Convert $ amounts (e.g. $8 - $15 -> ₹680 - ₹1,275 or $10 -> ₹850)
  return priceStr.replace(/\$\s*(\d+(?:\.\d+)?)/g, (_, val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return `₹${val}`;
    const inr = Math.round(num * 85);
    return `₹${inr.toLocaleString('en-IN')}`;
  });
};

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  diagnosis,
  language,
  onReset,
  onNavigateToShop,
  imagePreview,
}) => {
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical' | 'prevention' | 'fertilizer'>('organic');

  const handlePrint = () => {
    window.print();
  };

  const getUrgencyBadge = (urgency?: string) => {
    switch (urgency) {
      case 'Critical':
        return {
          bg: 'bg-red-50 text-red-700 border-red-200',
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
          label: language === 'hi' ? 'गंभीर आपातकाल (तत्काल छिड़काव)' : language === 'or' ? 'ଅତି ଗୁରୁତର (ତୁରନ୍ତ ଚିକିତ୍ସା)' : 'Critical Urgency (Immediate Action)',
        };
      case 'High':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
          label: language === 'hi' ? 'उच्च चेतावनी (36 घंटे में उपचार)' : language === 'or' ? 'ଉଚ୍ଚ ଚେତାବନୀ (୩୬ ଘଣ୍ଟା ମଧ୍ୟରେ)' : 'High Urgency (Treat in 36h)',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Info className="w-4 h-4 text-amber-600" />,
          label: language === 'hi' ? 'मध्यम संक्रमण' : language === 'or' ? 'ମଧ୍ୟମ ସଂକ୍ରମଣ' : 'Moderate Infection',
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          label: language === 'hi' ? 'सामान्य / सुरक्षित' : language === 'or' ? 'ସୁରକ୍ଷିତ / ସାଧାରଣ' : 'Low / Safe Stage',
        };
    }
  };

  const urgencyInfo = getUrgencyBadge(diagnosis?.urgency_level);

  // Safe extractions
  const organicRemedies = diagnosis?.organic_treatment?.remedies || [];
  const chemicalMedicines = diagnosis?.chemical_treatment?.medicines || [];
  const preventionTips = diagnosis?.prevention_tips || [];
  const recommendedFertilizers = diagnosis?.recommended_fertilizers || [];
  const symptoms = diagnosis?.symptoms || [];
  const speechTexts = diagnosis?.audio_speech_text || {
    en: `${diagnosis?.crop_name || 'Crop'}: ${diagnosis?.disease_detected || 'Diagnosis complete.'}`,
  };

  // Extract first chemical medicine or organic remedy name for store query
  const primaryMedicine = chemicalMedicines[0]?.name || organicRemedies[0]?.name || '';

  return (
    <div className="w-full space-y-6 animate-slide-up">
      {/* Top Main Diagnosis Card (VerdaAgro Editorial Layout) */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-[24px] p-5 sm:p-7 shadow-[0_8px_30px_rgba(19,57,46,0.06)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#EAE5DC]">
          <div className="flex items-start gap-4">
            {imagePreview && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-[#F7F5F0] border border-[#E5E0D8] flex-shrink-0 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt={diagnosis?.crop_name || 'Crop Image'}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8F3EB] text-[#13392E] border border-[#CFE6D5]">
                  {diagnosis?.crop_name || 'Crop'}
                </span>
                {diagnosis?.scientific_crop_name && (
                  <span className="text-xs text-[#4B5548] italic">
                    ({diagnosis.scientific_crop_name})
                  </span>
                )}
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${urgencyInfo.bg}`}>
                  {urgencyInfo.icon}
                  <span>{urgencyInfo.label}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#13392E] tracking-tight flex items-center gap-2">
                {diagnosis?.disease_detected || 'Diagnosis Complete'}
                {diagnosis?.is_healthy && (
                  <ShieldCheck className="w-7 h-7 text-[#70B22C] inline flex-shrink-0" />
                )}
              </h2>
            </div>
          </div>

          {/* Confidence Meter & Actions */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="w-28 sm:w-36 bg-[#EDE8DF] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#13392E] transition-all duration-1000"
                    style={{ width: `${diagnosis?.confidence_score || 0}%` }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-[#13392E]">
                  {diagnosis?.confidence_score || 0}%
                </span>
              </div>
              <span className="text-[10px] text-[#4B5548] font-medium block mt-0.5">
                {language === 'hi' ? 'एआई सटीकता (Confidence)' : language === 'or' ? 'AI ସଠିକତା' : 'AI Confidence Score'}
              </span>
            </div>

            <div className="flex items-center gap-2 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] text-xs font-bold border border-[#D8D1C3] transition-all active:scale-95 cursor-pointer"
                title="Print Prescription Slip"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'hi' ? 'पर्चा प्रिंट' : language === 'or' ? 'ପ୍ରିଣ୍ଟ କରନ୍ତୁ' : 'Print Slip'}</span>
              </button>
              <button
                type="button"
                onClick={onReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                title="Scan another plant"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#84CC16]" />
                <span className="hidden sm:inline">{language === 'hi' ? 'नया स्कैन' : language === 'or' ? 'ନୂଆ ସ୍କାନ' : 'New Scan'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Diagnosis Quote */}
        {diagnosis?.summary_diagnosis && (
          <div className="pt-4 pb-2">
            <p className="text-sm sm:text-base text-[#13392E] leading-relaxed font-medium bg-[#FCFAF7] p-4 rounded-2xl border border-[#EAE5DC]">
              💡 {diagnosis.summary_diagnosis}
            </p>
          </div>
        )}

        {/* Observable Symptoms Badges */}
        {symptoms.length > 0 && (
          <div className="pt-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4B5548] block mb-2">
              {language === 'hi' ? 'पहचाने गए मुख्य लक्षण (Key Symptoms):' : language === 'or' ? 'ଦେଖାଯାଇଥିବା ମୁଖ୍ୟ ଲକ୍ଷଣ:' : 'Observable Symptoms:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F3EFE8] text-[#13392E] border border-[#E5E0D8]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#70B22C] flex-shrink-0" />
                  <span>{symptom}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Interactive Audio Advisory Player (VerdaAgro Soft Mint Bar) */}
      <AudioPlayer
        speechTexts={speechTexts}
        currentLanguage={language}
        cropName={diagnosis?.crop_name || 'Crop'}
        diseaseName={diagnosis?.disease_detected || 'Disease Advisory'}
      />

      {/* Remedies & Treatment Breakdown (VerdaAgro Clean Cards) */}
      <div className="bg-[#FFFFFF] border border-[#E5E0D8] rounded-[24px] p-5 sm:p-7 shadow-[0_8px_30px_rgba(19,57,46,0.06)]">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#EAE5DC] gap-2 overflow-x-auto pb-3 scrollbar-none no-print">
          <button
            type="button"
            onClick={() => setActiveTab('organic')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'organic'
                ? 'bg-[#13392E] text-white shadow-sm'
                : 'text-[#4B5548] hover:text-[#13392E] bg-[#F7F5F0]'
            }`}
          >
            <Leaf className="w-4 h-4 text-[#84CC16]" />
            <span>{language === 'hi' ? '🌿 जैविक / घरेलू उपचार' : language === 'or' ? '🌿 ଜୈବିକ ଉପଚାର' : '🌿 Organic / Home Remedy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chemical')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'chemical'
                ? 'bg-[#13392E] text-white shadow-sm'
                : 'text-[#4B5548] hover:text-[#13392E] bg-[#F7F5F0]'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-[#84CC16]" />
            <span>{language === 'hi' ? '🧪 रासायनिक दवाइयां व खुराक' : language === 'or' ? '🧪 ରାସାୟନିକ ଔଷଧ' : '🧪 Recommended Chemical / Fungicide'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prevention')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'prevention'
                ? 'bg-[#13392E] text-white shadow-sm'
                : 'text-[#4B5548] hover:text-[#13392E] bg-[#F7F5F0]'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-[#84CC16]" />
            <span>{language === 'hi' ? '🛡️ रोकथाम व सावधानी' : language === 'or' ? '🛡️ ସାବଧାନତା' : '🛡️ Prevention & Soil Care'}</span>
          </button>

          {recommendedFertilizers.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('fertilizer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'fertilizer'
                  ? 'bg-[#13392E] text-white shadow-sm'
                  : 'text-[#4B5548] hover:text-[#13392E] bg-[#F7F5F0]'
              }`}
            >
              <Sprout className="w-4 h-4 text-[#84CC16]" />
              <span>{language === 'hi' ? '🌱 पोषण व खाद' : language === 'or' ? '🌱 ସାର ଓ ପୋଷକ' : '🌱 Nutrients & Fertilizers'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Organic Treatment */}
        {activeTab === 'organic' && (
          <div className="pt-5 space-y-4 animate-fade-in">
            {diagnosis?.organic_treatment?.overview && (
              <p className="text-xs sm:text-sm text-[#4B5548] italic bg-[#FCFAF7] p-3.5 rounded-2xl border border-[#EAE5DC]">
                {diagnosis.organic_treatment.overview}
              </p>
            )}

            {organicRemedies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organicRemedies.map((remedy, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E5E0D8] hover:border-[#70B22C] transition-all space-y-2.5 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm sm:text-base font-extrabold text-[#13392E] flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-[#70B22C] flex-shrink-0" />
                        {remedy.name}
                      </h4>
                      {remedy.approx_cost && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8F3EB] text-[#13392E] font-bold border border-[#CFE6D5]">
                          {formatRupeePrice(remedy.approx_cost)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-[#4B5548]">
                      <p>
                        <span className="font-bold text-[#13392E]">{language === 'hi' ? 'खुराक: ' : 'Dosage: '}</span>
                        <span className="text-[#15211B] font-semibold">{remedy.dosage}</span>
                      </p>
                      <p>
                        <span className="font-bold text-[#13392E]">{language === 'hi' ? 'छिड़काव विधि: ' : 'Method: '}</span>
                        <span>{remedy.application_method}</span>
                      </p>
                      {remedy.safety_precautions && (
                        <p className="text-amber-800 text-[11px] bg-amber-50 p-2 rounded-xl border border-amber-100">
                          <span className="font-bold">{language === 'hi' ? 'सावधानी: ' : 'Precaution: '}</span>
                          {remedy.safety_precautions}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#4B5548]">
                {language === 'hi' ? 'कोई जैविक उपचार आवश्यक नहीं है।' : 'No organic intervention required.'}
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Chemical Treatment */}
        {activeTab === 'chemical' && (
          <div className="pt-5 space-y-4 animate-fade-in">
            {diagnosis?.chemical_treatment?.overview && (
              <p className="text-xs sm:text-sm text-[#4B5548] italic bg-[#FCFAF7] p-3.5 rounded-2xl border border-[#EAE5DC]">
                {diagnosis.chemical_treatment.overview}
              </p>
            )}

            {chemicalMedicines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chemicalMedicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E5E0D8] hover:border-[#13392E] transition-all space-y-3 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-[#13392E] flex items-center gap-1.5">
                          <FlaskConical className="w-4 h-4 text-[#70B22C] flex-shrink-0" />
                          {med.name}
                        </h4>
                        {med.approx_cost && (
                          <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8F3EB] text-[#13392E] font-bold border border-[#CFE6D5]">
                            {formatRupeePrice(med.approx_cost)}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-[#4B5548]">
                        <p>
                          <span className="font-bold text-[#13392E]">{language === 'hi' ? 'मात्रा व घोल: ' : 'Dosage: '}</span>
                          <span className="text-[#15211B] font-semibold">{med.dosage}</span>
                        </p>
                        <p>
                          <span className="font-bold text-[#13392E]">{language === 'hi' ? 'उपयोग का समय: ' : 'Application: '}</span>
                          <span>{med.application_method}</span>
                        </p>
                        {med.safety_precautions && (
                          <p className="text-red-700 text-[11px] bg-red-50 p-2 rounded-xl border border-red-100 flex items-start gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{med.safety_precautions}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action: Search this specific medicine at nearby shops */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigateToShop(med.name)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#84CC16]" />
                        <span>{language === 'hi' ? 'दुकान पर यह दवा खोजें' : language === 'or' ? 'ଦୋକାନରେ ଖୋଜନ୍ତୁ' : `Find "${med.name.split(' ')[0]}" at Stores`}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                {language === 'hi'
                  ? 'फसल स्वस्थ है। रासायनिक कीटनाशक की कोई आवश्यकता नहीं है।'
                  : 'Crop is healthy. No chemical pesticides are needed.'}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Prevention Tips */}
        {activeTab === 'prevention' && (
          <div className="pt-5 space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#13392E]">
              {language === 'hi' ? 'फसल सुरक्षा एवं भविष्य की सावधानियां' : language === 'or' ? 'ଫସଲ ସୁରକ୍ଷା ପାଇଁ ପଦକ୍ଷେପ' : 'Preventive Measures & Agronomic Practices'}
            </h4>
            {preventionTips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preventionTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FCFAF7] border border-[#E5E0D8] text-xs text-[#15211B] font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#70B22C] mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#4B5548]">Standard good agronomic practices recommended.</p>
            )}
          </div>
        )}

        {/* Tab 4: Fertilizers */}
        {activeTab === 'fertilizer' && recommendedFertilizers.length > 0 && (
          <div className="pt-5 space-y-3 animate-fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#13392E]">
              {language === 'hi' ? 'रोग प्रतिरोधक क्षमता बढ़ाने हेतु खाद' : language === 'or' ? 'ପୋଷକ ତତ୍ତ୍ୱ ଓ ଖତ ସାର' : 'Plant Immunity & Growth Enhancers'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedFertilizers.map((fert, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#FCFAF7] border border-[#E5E0D8] text-xs text-[#15211B] font-medium"
                >
                  <Sprout className="w-4 h-4 text-[#70B22C] mt-0.5 flex-shrink-0" />
                  <span>{fert}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Direct Action: Locate Nearby Stores */}
        <div className="mt-8 pt-6 border-t border-[#EAE5DC] flex flex-wrap items-center justify-between gap-4 no-print">
          <div>
            <h4 className="text-base font-extrabold text-[#13392E] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#70B22C]" />
              {language === 'hi' ? 'दवा खरीदने के लिए नजदीकी कृषि केंद्र खोजें' : language === 'or' ? 'ନିକଟସ୍ଥ କୃଷି ସେବା କେନ୍ଦ୍ର ଖୋଜନ୍ତୁ' : 'Need Medicines? Locate Nearby Krishi Kendra'}
            </h4>
            <p className="text-xs text-[#4B5548] mt-0.5">
              {language === 'hi'
                ? 'अपने जीपीएस से खाद-बीज की दुकानों की दूरी और गूगल मैप्स रास्ता देखें'
                : language === 'or'
                ? 'ନିକଟସ୍ଥ ସାର ଓ ଔଷଧ ଦୋକାନର ଠିକଣା ଓ ନମ୍ବର ପାଆନ୍ତୁ'
                : 'Get driving navigation and contact numbers of nearby certified agro-dealers'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToShop(primaryMedicine)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_16px_rgba(19,57,46,0.15)] active:scale-95 transition-all cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#84CC16]" />
            <span>{language === 'hi' ? 'नजदीकी दुकानें देखें' : language === 'or' ? 'ନିକଟସ୍ଥ ଦୋକାନ ଦେଖନ୍ତୁ' : 'View Stores Near Me'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hidden Printable Prescription Card for Farmers */}
      <div className="hidden print-prescription">
        <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '15px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>AgriHelp AI - Crop Advisory Prescription Slip</h1>
          <p style={{ fontSize: '12px' }}>Date: {new Date(diagnosis?.analyzed_at || Date.now()).toLocaleString()}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h3><strong>Crop:</strong> {diagnosis?.crop_name || 'N/A'} ({diagnosis?.scientific_crop_name || 'N/A'})</h3>
          <h3><strong>Diagnosis:</strong> {diagnosis?.disease_detected || 'N/A'}</h3>
          <p><strong>Urgency:</strong> {diagnosis?.urgency_level || 'N/A'} | <strong>Confidence:</strong> {diagnosis?.confidence_score || 0}%</p>
          <p><strong>Summary:</strong> {diagnosis?.summary_diagnosis || 'N/A'}</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4><strong>Recommended Chemical Medicines (To purchase at Agro Store):</strong></h4>
          {chemicalMedicines.map((m, idx) => (
            <div key={idx} style={{ marginLeft: '15px', marginTop: '5px' }}>
              <p>• <strong>{m.name}</strong> - Dosage: {m.dosage}</p>
              <p style={{ fontSize: '11px' }}>Method: {m.application_method}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4><strong>Organic Remedies:</strong></h4>
          {organicRemedies.map((r, idx) => (
            <div key={idx} style={{ marginLeft: '15px', marginTop: '5px' }}>
              <p>• <strong>{r.name}</strong> - Dosage: {r.dosage}</p>
              <p style={{ fontSize: '11px' }}>Method: {r.application_method}</p>
            </div>
          ))}
        </div>

        <div>
          <h4><strong>Field Prevention Guidelines:</strong></h4>
          <ul>
            {preventionTips.map((tip, idx) => (
              <li key={idx} style={{ fontSize: '11px' }}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
