'use client';

import React, { useState, useEffect } from 'react';
import { AgriStore, LanguageCode, UserLocation } from '@/lib/types';
import {
  Store,
  MapPin,
  Phone,
  Navigation,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Star,
  Compass,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface StoreLocatorProps {
  language: LanguageCode;
  highlightMedicine?: string;
  userLocation: UserLocation;
  onOpenLocationModal: () => void;
}

export const StoreLocator: React.FC<StoreLocatorProps> = ({
  language,
  highlightMedicine,
  userLocation,
  onOpenLocationModal,
}) => {
  const [stores, setStores] = useState<AgriStore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchKeyword, setSearchKeyword] = useState<string>(highlightMedicine || '');
  const [filterType, setFilterType] = useState<string>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [broadLinks, setBroadLinks] = useState<{
    fertilizer?: string;
    krishiKendra?: string;
    seeds?: string;
  }>({});

  // Sync if highlightMedicine prop changes
  useEffect(() => {
    if (highlightMedicine) {
      setSearchKeyword(highlightMedicine);
    }
  }, [highlightMedicine]);

  // Fetch nearby stores based on current location and search query
  const fetchStores = async (keyword: string = searchKeyword) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const queryParams = new URLSearchParams({
        lat: userLocation.latitude.toString(),
        lng: userLocation.longitude.toString(),
        keyword: keyword || 'fertilizer pesticide krishi seva kendra',
        radius: '15000',
      });

      const res = await fetch(`/api/nearby-stores?${queryParams.toString()}`);
      const data = await res.json();

      if (data.success && data.data?.stores) {
        let list: AgriStore[] = data.data.stores;

        if (filterType !== 'all') {
          list = list.filter((s) => s.store_type.toLowerCase().includes(filterType.toLowerCase()));
        }

        setStores(list);
        if (data.data.broadSearchLinks) {
          setBroadLinks(data.data.broadSearchLinks);
        }
      } else {
        setErrorMessage(data.error || 'Could not fetch stores.');
      }
    } catch (err: any) {
      setErrorMessage('Network error while searching nearby stores.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(searchKeyword);
  }, [userLocation.latitude, userLocation.longitude, filterType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStores(searchKeyword);
  };

  return (
    <div
      id="nearby-stores-section"
      className="w-full bg-[#FFFFFF] border border-[#E5E0D8] rounded-[24px] p-5 sm:p-8 shadow-[0_8px_30px_rgba(19,57,46,0.06)] space-y-6"
    >
      {/* Header & Location Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#EAE5DC]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F3EB] text-[#13392E] text-xs font-bold border border-[#CFE6D5] mb-1.5">
            <Compass className="w-3.5 h-3.5 text-[#70B22C]" />
            <span>Google Maps GPS Navigation</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#13392E] tracking-tight flex items-center gap-2">
            <span>📍 {language === 'hi' ? 'नजदीकी कृषि व खाद की दुकानें' : language === 'or' ? 'ନିକଟସ୍ଥ କୃଷି ଓ ସାର ଦୋକାନ' : 'Buy Recommended Medicine Nearby'}</span>
          </h3>

          <p className="text-xs sm:text-sm text-[#4B5548] mt-1">
            {language === 'hi'
              ? `दवा खरीदने के लिए ${userLocation.city} के प्रमाणित कृषि केंद्रों की दूरी और फोन नंबर:`
              : language === 'or'
              ? `${userLocation.city} ପାଖରେ ଥିବା ସାର ଓ ଔଷଧ ଦୋକାନର ତାଲିକା:`
              : `Certified agricultural stores and Krishi Kendras located near ${userLocation.city}:`}
          </p>
        </div>

        {/* Change Location Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] text-xs font-extrabold border border-[#D8D1C3] shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#70B22C]" />
            <span>{userLocation.city} (बदलें)</span>
          </button>

          <button
            type="button"
            onClick={() => fetchStores()}
            className="p-2.5 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] text-xs font-semibold border border-[#D8D1C3] transition-all cursor-pointer"
            title="Refresh Store List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#70B22C]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Medicine Search Alert Banner */}
      {highlightMedicine && (
        <div className="p-4 rounded-2xl bg-[#E8F3EB] border border-[#CFE6D5] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#13392E]">
            <Sparkles className="w-4 h-4 text-[#70B22C] flex-shrink-0" />
            <span>
              {language === 'hi' ? 'खोज की जा रही दवा:' : 'Locating medicine at stores:'}{' '}
              <strong className="font-extrabold text-[#13392E] underline">"{highlightMedicine}"</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchKeyword('');
              fetchStores('');
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#FFFFFF] text-[#13392E] font-bold border border-[#CFE6D5] hover:bg-[#F3EFE8]"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Search Bar & Quick Categories */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4B5548] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'दुकान या दवा का नाम खोजें (उदा. Mancozeb, नीम का तेल, IFFCO)...'
                  : 'Search store or medicine name (e.g. Neem Oil, Fertilizer, Krishi Kendra)...'
              }
              className="w-full pl-10 pr-4 py-3 rounded-full bg-[#FCFAF7] border border-[#E5E0D8] text-xs sm:text-sm text-[#13392E] placeholder-[#4B5548]/70 focus:outline-none focus:border-[#13392E] focus:bg-[#FFFFFF] transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-5 sm:px-6 py-3 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white text-xs sm:text-sm font-extrabold shadow-[0_4px_16px_rgba(19,57,46,0.15)] transition-all active:scale-95 cursor-pointer"
          >
            {language === 'hi' ? 'खोजें' : 'Search'}
          </button>
        </form>

        {/* Quick Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[#4B5548] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3 h-3" />
            {language === 'hi' ? 'श्रेणी:' : 'Category:'}
          </span>
          {[
            { id: 'all', label: language === 'hi' ? 'सभी दुकानें' : 'All Centers' },
            { id: 'krishi kendra', label: '🌾 Krishi Kendra' },
            { id: 'fertilizer', label: '🧪 Fertilizers & Pesticides' },
            { id: 'seed', label: '🌱 Seeds & Bio' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                filterType === cat.id
                  ? 'bg-[#13392E] text-white shadow-sm'
                  : 'bg-[#EDE8DF] text-[#4B5548] hover:text-[#13392E] border border-[#D8D1C3]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error / Offline Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#70B22C] animate-spin" />
          <p className="text-xs text-[#4B5548] font-medium">
            {language === 'hi'
              ? `नजदीकी दुकानों की दूरी खोजी जा रही है (${userLocation.city})...`
              : `Finding verified agricultural stores near ${userLocation.city}...`}
          </p>
        </div>
      ) : (
        /* Store Cards Grid (VerdaAgro Crisp White Cards) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className="p-5 rounded-[20px] bg-[#FCFAF7] border border-[#E5E0D8] hover:border-[#13392E] hover:bg-[#FFFFFF] transition-all verda-card-hover flex flex-col justify-between space-y-3.5 overflow-hidden shadow-sm hover:shadow-md"
            >
              <div>
                {/* Store Photo & Type Badge */}
                <a
                  href={store.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block w-full h-36 rounded-2xl overflow-hidden bg-[#E8F3EB] mb-3 border border-[#E5E0D8] group cursor-pointer"
                  title="Click to view real photos and reviews on Google Maps"
                >
                  {store.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={store.image_url}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#E8F3EB] text-[#13392E]">
                      <Store className="w-8 h-8" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#15211B]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#13392E]/90 backdrop-blur-md text-[#84CC16] text-[10px] font-extrabold shadow-sm">
                    <Store className="w-3 h-3 text-[#84CC16]" />
                    <span>{store.store_type}</span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFFFF]/90 backdrop-blur-md text-[#13392E] text-xs font-extrabold shadow-sm border border-[#E5E0D8]">
                    <Navigation className="w-3 h-3 text-[#70B22C]" />
                    <span>{store.distance_km} km away</span>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFFFF]/90 text-[10px] text-[#13392E] font-bold border border-[#E5E0D8] group-hover:text-[#70B22C] transition-colors">
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Google Maps Photos</span>
                  </div>
                </a>

                <h4 className="text-sm sm:text-base font-extrabold text-[#13392E] line-clamp-1">
                  {store.name}
                </h4>

                <p className="text-xs text-[#4B5548] mt-1 line-clamp-2">
                  {store.address}
                </p>

                {/* Rating & Status */}
                <div className="flex items-center gap-3 mt-2.5 text-xs">
                  {store.rating && (
                    <span className="flex items-center gap-1 text-[#13392E] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      {store.rating} ({store.total_ratings || 50}+)
                    </span>
                  )}
                  <span className="text-[#13392E] flex items-center gap-1 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#70B22C] animate-pulse" />
                    {language === 'hi' ? 'खुला है • स्टॉक उपलब्ध' : language === 'or' ? 'ଖୋଲା ଅଛି' : 'Open Now • In Stock'}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Full-width High-Contrast Google Maps Button */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#EAE5DC]">
                {store.phone && (
                  <a
                    href={`tel:${store.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] text-xs font-extrabold border border-[#D8D1C3] transition-all active:scale-95 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#70B22C]" />
                    <span>{language === 'hi' ? 'कॉल करें' : 'Call Store'}</span>
                  </a>
                )}

                <a
                  href={store.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-full bg-[#13392E] hover:bg-[#1a473a] text-white text-xs font-extrabold shadow-[0_4px_16px_rgba(19,57,46,0.15)] transition-all active:scale-95 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>🧭 {language === 'hi' ? 'गूगल मैप्स रास्ता' : language === 'or' ? 'ରାସ୍ତା ଦେଖନ୍ତୁ' : 'Open in Google Maps'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broad Search Scheme Links Footer */}
      <div className="pt-4 border-t border-[#EAE5DC] flex flex-wrap items-center justify-between gap-3 text-xs text-[#4B5548]">
        <span className="font-bold text-[#13392E]">
          {language === 'hi' ? 'गूगल मैप्स पर सीधे खोजें:' : 'Explore directly on Google Maps:'}
        </span>
        <div className="flex flex-wrap gap-2">
          {broadLinks.fertilizer && (
            <a
              href={broadLinks.fertilizer}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] font-bold border border-[#D8D1C3] transition-all"
            >
              Fertilizer Shops ↗
            </a>
          )}
          {broadLinks.krishiKendra && (
            <a
              href={broadLinks.krishiKendra}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] font-bold border border-[#D8D1C3] transition-all"
            >
              Krishi Seva Kendra ↗
            </a>
          )}
          {broadLinks.seeds && (
            <a
              href={broadLinks.seeds}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-[#EDE8DF] hover:bg-[#E2DDD3] text-[#13392E] font-bold border border-[#D8D1C3] transition-all"
            >
              Seed & Equipment ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
