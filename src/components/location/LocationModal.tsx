import React, { useState } from 'react';
import { X, MapPin, Navigation, Search, Check, Globe } from 'lucide-react';
import { UserLocation } from '../../types/travel';
import { GLOBAL_GATEWAYS, requestBrowserLocation } from '../../services/locationService';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation | null;
  onSelectLocation: (loc: UserLocation) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetect = async () => {
    setIsDetecting(true);
    setDetectError(null);
    try {
      const loc = await requestBrowserLocation();
      onSelectLocation(loc);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to access browser location';
      setDetectError(
        msg.includes('denied')
          ? 'Location permission was declined. Please choose a global city below instead.'
          : 'Could not detect position. Please select a city below.'
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const filteredGateways = GLOBAL_GATEWAYS.filter(
    (g) =>
      g.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="glass-card w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/15 shadow-luxury relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-champagne/10 border border-champagne/30 flex items-center justify-center text-champagne">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-sand-50 font-normal">Departure Point</h3>
              <p className="text-xs text-sand-400">Set origin for flight distances & local weather</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close location modal"
            className="p-2 rounded-full hover:bg-white/10 text-sand-400 hover:text-sand-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Selected Location */}
        {currentLocation && (
          <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-sand-400">Current Origin: </span>
                <span className="text-sand-100 font-medium">
                  {currentLocation.city}, {currentLocation.country}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-sand-500 uppercase">
              {currentLocation.isCustom ? 'Manual' : 'GPS Detected'}
            </span>
          </div>
        )}

        {/* Browser Geolocation Button */}
        <div className="mt-5">
          <button
            onClick={handleDetect}
            disabled={isDetecting}
            className="w-full py-3.5 px-4 rounded-xl bg-champagne text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-champagne-light transition-all shadow-glow-gold disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting Coordinates...' : 'Use My Current Location'}</span>
          </button>

          {detectError && (
            <p className="mt-2 text-xs text-red-300/90 text-center bg-red-950/30 p-2 rounded-lg border border-red-500/20">
              {detectError}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#13181E] text-[11px] font-mono text-sand-500 uppercase tracking-widest">
            Or select a global gateway
          </span>
        </div>

        {/* Search Gateways */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-sand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gateway (e.g. Tokyo, London, Paris)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-sand-100 placeholder-sand-500 focus:outline-none focus:border-champagne/50"
          />
        </div>

        {/* Gateways Grid */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {filteredGateways.map((g) => {
            const isSelected =
              currentLocation?.city.toLowerCase() === g.city.toLowerCase() &&
              currentLocation?.country.toLowerCase() === g.country.toLowerCase();

            return (
              <button
                key={`${g.city}-${g.country}`}
                onClick={() => {
                  onSelectLocation(g);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-champagne/15 border border-champagne/40 text-champagne'
                    : 'bg-white/5 hover:bg-white/10 text-sand-300 hover:text-sand-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-sand-400" />
                  <div>
                    <span className="text-sm font-medium">{g.city}</span>
                    <span className="text-xs text-sand-400 ml-2 font-light">{g.country}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-champagne" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
