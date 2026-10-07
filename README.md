# 🌾 AgriHelp AI — Smart Crop Disease Detection & Local Remedy Finder

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini Vision](https://img.shields.io/badge/Google_Gemini-Vision_AI-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com/)

**AgriHelp AI** is a mobile-first, responsive web application (PWA/Responsive Web) designed for farmers. It provides instant crop disease diagnostics via Google Gemini Multimodal Vision AI, spoken audio advice in native languages (Hindi / English / Odia) via Text-to-Speech (TTS), and connects farmers to nearby certified agricultural and fertilizer stores with 1-click Google Maps navigation.

---

## ✨ Key Features

1. **📷 Mobile-First Camera & Upload**:
   - Direct camera snap (`accept="image/*" capture="environment"`) and local file upload / drag-and-drop.
   - Live image preview with retake and reset controls.
   - **1-Tap Demo Samples**: Preloaded interactive leaf presets (Tomato Early Blight, Rice Blast, Potato Late Blight, Apple Scab, Healthy Wheat) for instant testing.

2. **🧠 Gemini AI Multimodal Vision Diagnostics (`/api/diagnose`)**:
   - Structured JSON analysis providing:
     - Identified crop name & botanical name
     - Detected disease or healthy status
     - Confidence score (%) and Urgency Level (Low, Moderate, High, Critical)
     - Observable symptoms checklist
     - 🌿 **Organic Remedies**: Natural solutions (Neem oil, *Trichoderma*, bio-fungicides) with exact preparation & dosage
     - 🧪 **Chemical Remedies**: Commercial chemical salts & brand names (Mancozeb, Difenoconazole, etc.) with dosage per liter/acre
     - 🛡️ **Prevention & Cultural Care**: Crop rotation, drainage, and field hygiene tips
     - 🌱 **Fertilizer & Micronutrient Boosters**: Potash, Zinc, and foliar immunity boosters

3. **🔊 Multi-Lingual Text-to-Speech (TTS) Voice Advisory**:
   - Interactive audio player with Play, Pause, Resume, and Stop controls.
   - Animated audio equalizer / sound bars.
   - Conversational voice advisory in English and **हिन्दी (Hindi)** with adjustable playback speeds (0.85x, 1.0x, 1.2x).

4. **📍 Nearby Agri-Shop Locator & Google Maps Redirection (`/api/nearby-stores`)**:
   - Uses browser GPS (`navigator.geolocation`) to find verified Krishi Kendras, fertilizer stores, and seed depots.
   - Displays real-time distance in kilometers, open status, and telephone dialers.
   - Direct **"Navigate on Google Maps"** URL scheme buttons for turn-by-turn driving directions.
   - 1-click **"Search Medicine on Maps"** button for the prescribed fungicide.

5. **📋 Farmer Utilities**:
   - **Printable Prescription Slip**: Formatted prescription card to print or show on mobile to local agro-dealers.
   - **Offline Scan History**: Saves recent scans to `localStorage` for offline review.
   - **Emergency Kisan Helpline**: Direct 1-tap dial for Toll-Free Kisan Call Centre (`1800-180-1551`).

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server-side API Routes)
- **Frontend UI**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Vision Engine**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) (Gemini 2.5 Flash / 1.5 Flash)
- **Audio Engine**: Web Speech API (`speechSynthesis`) with multi-lingual voice synthesis
- **Maps & Geolocation**: Browser Geolocation API + Google Places API / Google Maps Universal URL Scheme

---

## 🚀 Getting Started / How to Run

### Prerequisites
Make sure you have **Node.js** (v18 or higher) and **npm** installed on your system:
```bash
node -v
npm -v
```

### 1. Clone or Open the Repository
```bash
cd AgriHelp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory (or edit the existing one):
```env
# Google Gemini API Key (Get a free key from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=[GCP_API_KEY]

# (Optional) Google Places API Key for live store search
GOOGLE_PLACES_API_KEY=
```

> **Note:** Even without an API key, you can immediately test the full app workflow using the preloaded **1-Tap Demo Samples** or configure an API key on-the-fly inside the app's **API Settings** modal.

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser or mobile browser.

### 5. Build for Production (Optional)
To build and run the optimized production bundle:
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
AgriHelp/
├── public/
│   ├── icon.svg               # App icon
│   └── manifest.json          # PWA configuration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── diagnose/      # Gemini Multimodal Vision API Route
│   │   │   │   └── route.ts
│   │   │   └── nearby-stores/ # Agri store locator & Maps API Route
│   │   │       └── route.ts
│   │   ├── globals.css        # Tailwind directives & glassmorphic styles
│   │   ├── layout.tsx         # Root layout with PWA metadata
│   │   └── page.tsx           # Main application page
│   ├── components/
│   │   ├── Header.tsx         # Top bar with language switcher & helpline
│   │   ├── HelplineBanner.tsx # Farmer advisory banner
│   │   ├── CameraUpload.tsx   # Camera capture, upload & sample leaf selector
│   │   ├── DiagnosisResult.tsx# Disease results, remedies tabs & prescription slip
│   │   ├── AudioPlayer.tsx    # Spoken voice advisory TTS player
│   │   ├── StoreLocator.tsx   # Nearby Krishi Kendras & Google Maps redirection
│   │   ├── ScanHistoryModal.tsx # Offline scan history drawer
│   │   └── ApiKeyModal.tsx    # Client API key configuration modal
│   └── lib/
│       ├── gemini.ts          # Server-side Gemini API client & system prompts
│       ├── sampleData.ts      # Demo leaf SVGs and mock diagnosis presets
│       ├── tts.ts             # Web Speech API multi-lingual synthesis
│       └── types.ts           # TypeScript interfaces & types
├── .env.example
├── .env.local
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📞 Farmer Helpline & Support
- **National Kisan Call Centre (Toll-Free)**: `1800-180-1551`
- **Govt. of India Farmers' Portal**: [farmer.gov.in](https://farmer.gov.in)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
