import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgriHelp AI - Smart Crop Disease Detection & Local Remedy Finder',
  description:
    'AI-Powered crop leaf disease diagnosis, organic & chemical remedies, multi-lingual voice speech advisory, and instant nearby Krishi Kendra / Fertilizer store navigation for farmers.',
  keywords: [
    'Crop disease detection',
    'Plant disease AI',
    'Gemini Vision Agriculture',
    'Krishi Kendra Locator',
    'Pesticide dosage finder',
    'Organic farming remedies',
    'Agri Help India',
  ],
  authors: [{ name: 'AgriHelp AI Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#062817',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
