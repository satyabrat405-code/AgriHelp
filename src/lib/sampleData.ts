import { CropDiagnosis, LanguageOption } from './types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🍃' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🌾' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🌱' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🚜' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🌿' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🌾' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🍃' },
];

export interface SampleLeafPreset {
  id: string;
  name: string;
  crop: string;
  disease: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Healthy' | 'Critical';
  svgDataUri: string;
  mockDiagnosis: CropDiagnosis;
}

// Generate high quality SVGs as data URIs for instant visual leaf previews
function createLeafSvg(color1: string, color2: string, spotColor: string, spotCount: number, label: string): string {
  const spots = Array.from({ length: spotCount })
    .map((_, i) => {
      const cx = 80 + (i % 3) * 45 + ((i * 17) % 20);
      const cy = 60 + Math.floor(i / 3) * 35 + ((i * 23) % 25);
      const r = 8 + (i % 4) * 4;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${spotColor}" opacity="0.85" />
              <circle cx="${cx}" cy="${cy}" r="${Math.max(2, r - 4)}" fill="#2d1b00" opacity="0.6" />`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240" width="100%" height="100%">
    <defs>
      <linearGradient id="grad-${label.replace(/\s+/g, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
      <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2d5016" />
        <stop offset="100%" stop-color="#4a7c24" />
      </linearGradient>
    </defs>
    <rect width="300" height="240" fill="#0f172a" rx="16"/>
    <!-- Background field grid effect -->
    <path d="M0,40 Q150,20 300,40 M0,120 Q150,100 300,120 M0,200 Q150,180 300,200" stroke="#1e293b" stroke-width="1" fill="none" opacity="0.4"/>
    
    <!-- Main Leaf Body -->
    <path d="M150,25 C230,50 250,150 160,205 C140,215 135,215 120,200 C40,150 60,50 150,25 Z" fill="url(#grad-${label.replace(/\s+/g, '')})" filter="drop-shadow(0 8px 16px rgba(0,0,0,0.5))"/>
    
    <!-- Main Veins -->
    <path d="M150,30 C150,100 145,160 140,215" stroke="#7bb339" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path d="M150,70 Q190,85 220,100" stroke="#7bb339" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M148,110 Q195,130 215,150" stroke="#7bb339" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M147,150 Q185,170 195,185" stroke="#7bb339" stroke-width="1.8" fill="none" opacity="0.6"/>
    
    <path d="M150,70 Q110,85 80,100" stroke="#7bb339" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M148,110 Q105,130 85,150" stroke="#7bb339" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M147,150 Q115,170 105,185" stroke="#7bb339" stroke-width="1.8" fill="none" opacity="0.6"/>

    <!-- Disease Spots -->
    ${spots}

    <!-- Stem -->
    <path d="M140,205 Q135,225 130,235" stroke="url(#stemGrad)" stroke-width="6" stroke-linecap="round" fill="none"/>
    
    <!-- Badge Indicator -->
    <g transform="translate(15, 15)">
      <rect width="110" height="26" rx="13" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <text x="55" y="17" fill="#f8fafc" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle">${label}</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_LEAF_PRESETS: SampleLeafPreset[] = [
  {
    id: 'tomato-early-blight',
    name: 'Tomato - Early Blight',
    crop: 'Tomato (टमाटर)',
    disease: 'Early Blight (Alternaria solani)',
    severity: 'High',
    svgDataUri: createLeafSvg('#4d7c0f', '#84cc16', '#78350f', 8, 'Tomato Blight'),
    mockDiagnosis: {
      crop_name: 'Tomato',
      scientific_crop_name: 'Solanum lycopersicum',
      disease_detected: 'Early Blight (Alternaria solani)',
      is_healthy: false,
      confidence_score: 96,
      urgency_level: 'High',
      summary_diagnosis: 'Early Blight detected. Classic target-like concentric rings with yellow chlorotic halos on lower foliage, caused by fungal pathogen Alternaria solani under warm, humid conditions.',
      symptoms: [
        'Concentric dark brown rings resembling target boards on older leaves',
        'Chlorotic yellowing around leaf lesions leading to premature leaf drop',
        'Stem lesions appearing dark, slightly sunken, and elongated'
      ],
      organic_treatment: {
        overview: 'Biological bio-fungicides and copper-based foliar spray to halt fungal spore dispersion without chemical toxicity.',
        remedies: [
          {
            name: 'Cold-Pressed Neem Oil (10,000 PPM)',
            dosage: '5 ml per Litre of water with 1 ml liquid soap',
            application_method: 'Foliar spray early in the morning every 7 days',
            safety_precautions: 'Avoid spraying under intense mid-day sunlight to prevent leaf scorch',
            approx_cost: '₹220 / 250ml'
          },
          {
            name: 'Trichoderma viride Bio-Fungicide',
            dosage: '5g to 10g per Litre of water',
            application_method: 'Apply as both soil drenching around roots and light foliar mist',
            safety_precautions: 'Do not mix with chemical fungicides simultaneously',
            approx_cost: '₹180 / 500g'
          }
        ]
      },
      chemical_treatment: {
        overview: 'Broad-spectrum contact and systemic fungicides for immediate containment of severe spreading.',
        medicines: [
          {
            name: 'Mancozeb 75% WP (Dithane M-45 / Indofil M-45)',
            dosage: '2.5 grams per 1 Litre of water (500g per 200L water per Acre)',
            application_method: 'Thorough foliar spray covering both upper and undersides of leaves',
            safety_precautions: 'Wear protective mask & rubber gloves. Maintain 7-day pre-harvest interval.',
            approx_cost: '₹340 / 500g'
          },
          {
            name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
            dosage: '1 ml per Litre of water',
            application_method: 'Curative spray for severe spreading outbreaks; repeat after 12 days if needed',
            safety_precautions: 'Keep away from waterways and aquatic life.',
            approx_cost: '₹750 / 100ml'
          }
        ]
      },
      prevention_tips: [
        'Prune lower leaves (bottom 12 inches) to prevent soil splashing during irrigation',
        'Use drip irrigation instead of overhead sprinklers to keep leaf foliage dry',
        'Practice 3-year crop rotation away from Solanaceae family (Potato, Brinjal, Chilli)',
        'Apply organic straw or plastic mulch around the plant base'
      ],
      recommended_fertilizers: [
        'Potassium Schoenite / SOP for cellular wall strength',
        'Calcium Nitrate 10g/L spray to reinforce plant cuticle'
      ],
      audio_speech_text: {
        en: 'Attention farmer friend: Your tomato crop shows severe Early Blight fungal infection. Spray Mancozeb 75% WP at 2.5 grams per liter of water immediately, or spray cold-pressed Neem Oil. Ensure you prune the bottom infected leaves to stop spores from splashing onto healthy shoots.',
        hi: 'किसान भाई ध्यान दें: आपकी टमाटर की फसल में अगेती झुलसा (अर्ली ब्लाइट) फंगस का प्रकोप हुआ है। तुरंत 2.5 ग्राम मैंकोज़ेब 75% WP प्रति लीटर पानी में मिलाकर या 5ml नीम का तेल मिलाकर पत्तियों पर छिड़कें। नीचे की सूखी व बीमार पत्तियां काटकर अलग कर दें।'
      },
      analyzed_at: new Date().toISOString()
    }
  },
  {
    id: 'rice-blast',
    name: 'Rice / Paddy - Blast Disease',
    crop: 'Paddy / Rice (धान)',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    severity: 'High',
    svgDataUri: createLeafSvg('#15803d', '#4ade80', '#991b1b', 6, 'Rice Blast'),
    mockDiagnosis: {
      crop_name: 'Paddy / Rice',
      scientific_crop_name: 'Oryza sativa',
      disease_detected: 'Rice Blast (Magnaporthe oryzae / Pyricularia oryzae)',
      is_healthy: false,
      confidence_score: 94,
      urgency_level: 'High',
      summary_diagnosis: 'Spindle-shaped elliptical lesions with diamond-like greyish centers and brownish borders detected on paddy leaves. Highly destructive fungal blast that can cause severe yield loss if untreated.',
      symptoms: [
        'Diamond or eye-shaped lesions with greyish-white necrotic centers',
        'Dark reddish-brown margin around lesions merging into blight patches',
        'Leaf tip drying and burning appearance under humid cloudy weather'
      ],
      organic_treatment: {
        overview: 'Botanical leaf extracts and beneficial Pseudomonas bacterial bio-agent foliar application.',
        remedies: [
          {
            name: 'Pseudomonas fluorescens 1% WP',
            dosage: '10 grams per Litre of water (or 2.5 kg/ha)',
            application_method: 'Foliar spray in the evening; repeat after 10 days',
            safety_precautions: 'Store bio-agent in cool shade away from direct sunlight',
            approx_cost: '₹160 / 1 kg'
          },
          {
            name: 'Cow Urine + Fermented Neem Leaf Extract (Panchagavya)',
            dosage: '30 ml per Litre of water',
            application_method: 'Spray across the crop canopy as an immunity booster',
            safety_precautions: 'Strain thoroughly through fine cloth before pouring into spray tank',
            approx_cost: '₹50 (Home prepared)'
          }
        ]
      },
      chemical_treatment: {
        overview: 'Systemic triazole and antibiotic fungicides for swift curative containment.',
        medicines: [
          {
            name: 'Tricyclazole 75% WP (Baan / Beam / Sivic)',
            dosage: '0.6 grams per Litre of water (120g per Acre in 200L water)',
            application_method: 'High-volume knapsack sprayer mist on tiller and boot leaf stage',
            safety_precautions: 'Use complete personal protective equipment (PPE kit)',
            approx_cost: '₹420 / 120g'
          },
          {
            name: 'Isoprothiolane 40% EC (Fuji-One)',
            dosage: '1.5 ml per Litre of water',
            application_method: 'Spray when neck blast or severe leaf blast appears',
            safety_precautions: 'Avoid runoff into fish ponds or waterways',
            approx_cost: '₹580 / 250ml'
          }
        ]
      },
      prevention_tips: [
        'Avoid excessive Nitrogen fertilizer splits; balance with Potash (MOP)',
        'Maintain proper 2-3 cm water level and avoid drought stress in field',
        'Treat paddy seeds with Carbendazim 2g/kg seed before sowing next season'
      ],
      recommended_fertilizers: [
        'Muriate of Potash (MOP 0:0:60) at 15kg/acre to boost cell wall silicon content',
        'Zinc Sulphate 33% (5kg/acre)'
      ],
      audio_speech_text: {
        en: 'Your paddy crop has Rice Blast disease. To prevent crop lodging and panicle damage, spray Tricyclazole 75% WP at 0.6 grams per liter of water right away, and reduce excess urea nitrogen.',
        hi: 'आपकी धान की फसल में ब्लास्ट (झोंका रोग) का संक्रमण है। तुरंत ट्राईसाइक्लाज़ोल 75% WP दवा 0.6 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें और यूरिया की मात्रा कम करें ताकि फसल सुरक्षित रहे।'
      },
      analyzed_at: new Date().toISOString()
    }
  },
  {
    id: 'potato-late-blight',
    name: 'Potato - Late Blight',
    crop: 'Potato (आलू)',
    disease: 'Late Blight (Phytophthora infestans)',
    severity: 'Critical',
    svgDataUri: createLeafSvg('#3f6212', '#a3e635', '#451a03', 10, 'Potato Blight'),
    mockDiagnosis: {
      crop_name: 'Potato',
      scientific_crop_name: 'Solanum tuberosum',
      disease_detected: 'Late Blight (Phytophthora infestans)',
      is_healthy: false,
      confidence_score: 98,
      urgency_level: 'Critical',
      summary_diagnosis: 'Water-soaked irregular blackish-brown necrotic lesions spreading rapidly across potato foliage. Critical emergency: Late Blight can destroy entire potato acreage in 48-72 hours under cool foggy conditions.',
      symptoms: [
        'Water-soaked dark lesions near leaf tips and margins',
        'White fungal mildew/downy growth on leaf undersides during morning dew',
        'Foul decaying odor and blackened stems in dense canopy'
      ],
      organic_treatment: {
        overview: 'Preventive copper soaps and biological consortia.',
        remedies: [
          {
            name: 'Copper Hydroxide 53.8% DF (Kocide)',
            dosage: '2 grams per Litre of water',
            application_method: 'Apply proactively before rain or dense fog',
            safety_precautions: 'Do not spray during full bloom pollinator activity',
            approx_cost: '₹480 / 500g'
          }
        ]
      },
      chemical_treatment: {
        overview: 'Potent systemic curative fungicides with translaminar movement.',
        medicines: [
          {
            name: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate M8 / Sectin)',
            dosage: '3 grams per Litre of water (600g per Acre)',
            application_method: 'Curative spray within 24 hours of first symptom appearance',
            safety_precautions: 'Rotate chemical classes to prevent oomycete resistance',
            approx_cost: '₹550 / 600g'
          },
          {
            name: 'Dimethomorph 50% WP (Acrobat / BASF)',
            dosage: '1 gram per Litre of water + spreader adjuvant',
            application_method: 'Systemic curative spray for severe ongoing blight',
            safety_precautions: 'Wash sprayer tank thoroughly after use',
            approx_cost: '₹620 / 100g'
          }
        ]
      },
      prevention_tips: [
        'High earthing-up (hilling) of soil over tubers to shield from washed-down spores',
        'Destroy all infected volunteer potato cull piles outside fields',
        'Monitor regional potato blight weather forecast advisories'
      ],
      recommended_fertilizers: [
        'Potassium Phosphite (0-0-50) foliar spray for systemic acquired resistance'
      ],
      audio_speech_text: {
        en: 'Urgent alert! Late Blight detected on your potato crop. This is a severe threat that spreads fast. Spray Cymoxanil plus Mancozeb at 3 grams per liter immediately to save your tubers.',
        hi: 'अति आवश्यक सूचना! आपके आलू के खेत में पिछेती झुलसा (लेट ब्लाइट) का गंभीर रोग लगा है। यह 48 घंटे में पूरी फसल बर्बाद कर सकता है। आज ही साइमोक्सानिल + मैंकोज़ेब (Curzate M8) 3 ग्राम प्रति लीटर पानी में मिलाकर छिड़काव करें।'
      },
      analyzed_at: new Date().toISOString()
    }
  },
  {
    id: 'healthy-wheat',
    name: 'Wheat - Healthy Crop',
    crop: 'Wheat (गेहूं)',
    disease: 'Healthy Crop (No Disease)',
    severity: 'Healthy',
    svgDataUri: createLeafSvg('#166534', '#22c55e', '#166534', 0, 'Healthy Wheat'),
    mockDiagnosis: {
      crop_name: 'Wheat',
      scientific_crop_name: 'Triticum aestivum',
      disease_detected: 'Healthy Crop (No Disease)',
      is_healthy: true,
      confidence_score: 99,
      urgency_level: 'Low',
      summary_diagnosis: 'Vibrant green, vigorous wheat foliage with intact chlorophyll and zero visible fungal or bacterial lesions. Crop is in excellent physiological condition.',
      symptoms: [
        'Clean uniform green color without yellow rust pustules or powdery spots',
        'Strong upright leaf orientation and sturdy tillers',
        'Optimal leaf cuticle thickness and cell turgidity'
      ],
      organic_treatment: {
        overview: 'Nutrient boosters and plant growth promoters to maximize grain filling.',
        remedies: [
          {
            name: 'Liquid Seaweed Extract (Bio-Stimulant)',
            dosage: '2.5 ml per Litre of water',
            application_method: 'Foliar spray at crown root initiation and flag leaf emergence',
            safety_precautions: '100% organic and non-toxic',
            approx_cost: '₹300 / 500ml'
          }
        ]
      },
      chemical_treatment: {
        overview: 'No chemical pesticides or fungicides are required at this time.',
        medicines: []
      },
      prevention_tips: [
        'Maintain light irrigation during flowering and grain development stages',
        'Regular field scout inspection for Yellow Rust / Stripe Rust during cool mornings',
        'Ensure balanced NPK top-dressing without excess nitrogen'
      ],
      recommended_fertilizers: [
        'Water Soluble NPK 00:52:34 (Mono Potassium Phosphate) at 10g/L during booting stage',
        'Chelated Zinc EDTA 12% at 1g/L'
      ],
      audio_speech_text: {
        en: 'Good news! Your wheat crop is completely healthy with strong green foliage. Keep up the good work and apply balanced nutrients at the flag leaf stage for maximum grain yield.',
        hi: 'बधाई हो किसान भाई! आपकी गेहूं की फसल एकदम स्वस्थ और हरी-भरी है। इसमें कोई रोग नहीं है। अच्छी पैदावार के लिए समय पर सिंचाई और पोटाश व जिंक का उचित पोषण दें।'
      },
      analyzed_at: new Date().toISOString()
    }
  },
  {
    id: 'apple-scab',
    name: 'Apple - Apple Scab',
    crop: 'Apple (सेब)',
    disease: 'Apple Scab (Venturia inaequalis)',
    severity: 'Moderate',
    svgDataUri: createLeafSvg('#365314', '#65a30d', '#1c1917', 7, 'Apple Scab'),
    mockDiagnosis: {
      crop_name: 'Apple',
      scientific_crop_name: 'Malus domestica',
      disease_detected: 'Apple Scab (Venturia inaequalis)',
      is_healthy: false,
      confidence_score: 93,
      urgency_level: 'Moderate',
      summary_diagnosis: 'Olive-green to velvety brown-black corky spots identified on apple foliage. Caused by Venturia inaequalis ascospore release following spring rains.',
      symptoms: [
        'Olive-green to velvety dark brown lesions on leaf upper surface',
        'Leaves puckering, curling, and showing localized chlorosis',
        'Deformation and dark scabby crusting on young fruitlets'
      ],
      organic_treatment: {
        overview: 'Wettable sulfur and lime sulfur sprays to prevent fungal spore germination.',
        remedies: [
          {
            name: 'Wettable Sulphur 80% WDG',
            dosage: '2 grams per Litre of water',
            application_method: 'Spray thoroughly on orchard canopy before rain events',
            safety_precautions: 'Do not spray when orchard temperature exceeds 30°C',
            approx_cost: '₹220 / 1 kg'
          }
        ]
      },
      chemical_treatment: {
        overview: 'Systemic curative sterol inhibitors for orchard protection.',
        medicines: [
          {
            name: 'Difenoconazole 25% EC (Score / Syngenta)',
            dosage: '0.3 ml per Litre of water (30ml per 100L water)',
            application_method: 'Apply as curative treatment within 72 hours of rain infection period',
            safety_precautions: 'Wear protective goggles and respirator during orchard misting',
            approx_cost: '₹460 / 100ml'
          },
          {
            name: 'Captan 50% WP (Captaf)',
            dosage: '2.5 grams per Litre of water',
            application_method: 'Protective broad-spectrum fungicide mist',
            safety_precautions: 'Toxic to bees; spray during evening hours',
            approx_cost: '₹380 / 500g'
          }
        ]
      },
      prevention_tips: [
        'Rake and destroy or compost fallen autumn orchard leaves with urea 5% spray',
        'Orchard tree pruning to allow sunlight penetration and rapid leaf drying',
        'Adopt scab-resistant apple cultivars for replanting'
      ],
      recommended_fertilizers: [
        'Boric Acid / Solubor 1g/L for fruit set strength',
        'Calcium Chloride 0.5% spray for fruit skin firmness'
      ],
      audio_speech_text: {
        en: 'Your apple orchard foliage shows signs of Apple Scab. To protect your fruit quality, spray Difenoconazole at 0.3 ml per liter of water, or spray Wettable Sulphur.',
        hi: 'आपके सेब के बगीचे में सेब का स्केब (फफूंदीय रोग) देखा गया है। फलों को दाग से बचाने के लिए 0.3 ml डाईफेनोकोनाज़ोल (Score) या घुलनशील सल्फर का तुरंत छिड़काव करें।'
      },
      analyzed_at: new Date().toISOString()
    }
  }
];
