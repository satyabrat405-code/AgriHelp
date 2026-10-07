import { NextRequest, NextResponse } from 'next/server';
import { analyzeCropImageWithGemini } from '@/lib/gemini';
import { SAMPLE_LEAF_PRESETS } from '@/lib/sampleData';

export const maxDuration = 60; // Allow sufficient time for AI Vision inference

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = 'image/jpeg', language = 'en', presetId } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, error: 'No image data provided. Please capture or upload a leaf photo.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // If API key is present, always use live Google Gemini Vision API
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const diagnosis = await analyzeCropImageWithGemini(
          imageBase64,
          mimeType,
          language
        );

        return NextResponse.json({
          success: true,
          data: diagnosis,
          source: 'gemini-live',
        });
      } catch (geminiErr: any) {
        console.error('Live Gemini inference error:', geminiErr);
        
        // If preset fallback is available on error
        if (presetId) {
          const preset = SAMPLE_LEAF_PRESETS.find(p => p.id === presetId);
          if (preset) {
            return NextResponse.json({
              success: true,
              data: {
                ...preset.mockDiagnosis,
                analyzed_at: new Date().toISOString(),
              },
              source: 'preset-fallback',
            });
          }
        }

        return NextResponse.json(
          {
            success: false,
            error: geminiErr?.message || 'Gemini API failed to diagnose leaf image. Please check API Key & image quality.',
          },
          { status: 500 }
        );
      }
    }

    // Fallback if no GEMINI_API_KEY is configured yet in .env.local
    if (presetId) {
      const preset = SAMPLE_LEAF_PRESETS.find(p => p.id === presetId);
      if (preset) {
        return NextResponse.json({
          success: true,
          data: {
            ...preset.mockDiagnosis,
            analyzed_at: new Date().toISOString(),
          },
          source: 'preset',
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'GEMINI_API_KEY is not configured in .env.local. Please add your GEMINI_API_KEY to enable live AI diagnosis.',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Diagnosis API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to analyze crop leaf. Please verify image clarity or try another photo.',
      },
      { status: 500 }
    );
  }
}
