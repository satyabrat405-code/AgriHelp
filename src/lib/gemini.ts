import { GoogleGenerativeAI } from '@google/generative-ai';
import { CropDiagnosis } from './types';

const DIAGNOSIS_PROMPT_TEMPLATE = (language: string) => `
You are AgriHelp AI, a world-class Agronomist and Plant Pathologist specialized in crop disease diagnosis, organic farming, and agrochemical medicine recommendations.

Analyze this leaf/crop image with extreme scientific precision and produce an actionable advisory for the farmer in JSON format.

Farmer's preferred language for audio/explanation: ${language}

REQUIRED JSON SCHEMA (Respond ONLY with valid JSON, without markdown formatting or code blocks):
{
  "crop_name": "Common crop name (e.g., Tomato, Rice / Paddy, Potato, Wheat, Cotton, Apple, Mango)",
  "scientific_crop_name": "Botanical name (e.g., Solanum lycopersicum)",
  "disease_detected": "Exact disease name (e.g., Early Blight, Leaf Spot, Powdery Mildew, Rice Blast) OR 'Healthy Crop' if no disease is found",
  "is_healthy": false,
  "confidence_score": 92,
  "urgency_level": "Low" | "Moderate" | "High" | "Critical",
  "summary_diagnosis": "Clear, concise 2-sentence summary of the condition and why it happened",
  "symptoms": [
    "Observable symptom 1 (e.g. Concentric dark brown rings on lower leaves)",
    "Observable symptom 2 (e.g. Yellow chlorotic halo around leaf margins)"
  ],
  "organic_treatment": {
    "overview": "Summary of natural, organic, and biological management strategy",
    "remedies": [
      {
        "name": "Remedy name (e.g., Cold-Pressed Neem Oil 10,000 PPM or Trichoderma viride)",
        "dosage": "Exact mixture ratio (e.g., 5ml per 1 Litre of water with mild soap)",
        "application_method": "When and how to spray (e.g., Spray on both leaf surfaces early morning)",
        "safety_precautions": "Any organic handling precaution",
        "approx_cost": "Estimated price strictly in Indian Rupees (₹) (e.g., ₹180 / 500g, ₹250 / Litre). NEVER use dollars ($)"
      }
    ]
  },
  "chemical_treatment": {
    "overview": "Summary of chemical fungicide/pesticide management for quick rescue",
    "medicines": [
      {
        "name": "Commercial Chemical Salt & Brand (e.g., Mancozeb 75% WP / Dithane M-45, or Azoxystrobin + Difenoconazole / Amistar Top)",
        "dosage": "Exact measurement (e.g., 2.5g per Litre of water or 500g per Acre)",
        "application_method": "Foliar spray at first sign of disease; repeat after 10-12 days if required",
        "safety_precautions": "Wear gloves and mask; maintain 7-day pre-harvest interval (PHI)",
        "approx_cost": "Estimated price strictly in Indian Rupees (₹) (e.g., ₹340 / 500g, ₹650 / 250ml). NEVER use dollars ($)"
      }
    ]
  },
  "prevention_tips": [
    "Field hygiene & removal of infected debris",
    "Proper spacing and drip irrigation to prevent leaf wetness",
    "Crop rotation with non-host crops"
  ],
  "recommended_fertilizers": [
    "e.g., Potassium phosphite for systemic resistance, balanced NPK 19:19:19"
  ],
  "audio_speech_text": {
    "en": "Conversational, simple spoken text in English that can be read out loud to the farmer. Explain what the crop has, if it is serious, and the single best immediate action to take today.",
    "hi": "सरल और स्पष्ट हिंदी में किसान के लिए बोले जाने वाला संदेश। बताएं कि फसल में क्या रोग है और आज ही क्या दवा या नीम का तेल छिड़कना चाहिए।",
    "native": "Audio speech text in the farmer's selected language (${language}) if different from English/Hindi"
  }
}

CRITICAL RULES:
1. If the image is NOT a plant, leaf, or crop, set "disease_detected" to "Not a Plant / Invalid Image", "is_healthy": false, "confidence_score": 0, and explain in "summary_diagnosis" that a clear leaf image must be uploaded.
2. ALL medicine and remedy prices MUST strictly be in Indian Rupees (₹ INR) (e.g., ₹220, ₹450 / 500g). DO NOT use US Dollars ($).
3. Provide exact, genuine chemical formulation salts commonly available at local Krishi Kendras and agricultural stores in India (e.g., Chlorothalonil, Copper Oxychloride, Mancozeb, Carbendazim, Imidacloprid, Hexaconazole, Validamycin).
4. If the crop is completely healthy, celebrate it, mark "is_healthy": true, set "disease_detected": "Healthy Plant", and provide maintenance/growth booster advice instead of curative treatments.
5. Output STRICTLY valid JSON.
`;

export async function analyzeCropImageWithGemini(
  base64Data: string,
  mimeType: string = 'image/jpeg',
  language: string = 'en',
  customApiKey?: string
): Promise<CropDiagnosis> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('GEMINI_API_KEY is not configured. Please provide an API key in .env.local');
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());

  // Use the verified supported vision models for current Google Gemini API
  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
  ];

  let lastError: any = null;

  // Extract clean base64 data and normalize mimeType
  let cleanBase64 = base64Data;
  let normalizedMime = mimeType || 'image/jpeg';

  const matches = base64Data.match(/^data:([a-zA-Z0-9/+]+);base64,(.+)$/);
  if (matches) {
    normalizedMime = matches[1];
    cleanBase64 = matches[2];
  }

  // If SVG was passed (from presets), normalize mimeType to image/jpeg or image/png for Gemini
  if (normalizedMime.includes('svg')) {
    normalizedMime = 'image/jpeg';
  }

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      });

      const prompt = DIAGNOSIS_PROMPT_TEMPLATE(language);

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: cleanBase64,
            mimeType: normalizedMime.includes('png') ? 'image/png' : normalizedMime.includes('webp') ? 'image/webp' : 'image/jpeg',
          },
        },
      ]);

      const responseText = result.response.text();

      // Extract JSON object safely
      let jsonText = responseText.trim();
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      const parsed: CropDiagnosis = JSON.parse(jsonText);
      parsed.analyzed_at = new Date().toISOString();

      return parsed;
    } catch (err: any) {
      console.warn(`Gemini Model ${modelName} attempt failed:`, err?.message || err);
      lastError = err;
      // try next model in candidate list
    }
  }

  throw new Error(`Crop disease analysis failed: ${lastError?.message || 'Unknown error'}`);
}
