import React from 'react';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { UserLocation } from '../../types/travel';

interface LocationBannerProps {
  userLocation: UserLocation | null;
  onOpenModal: () => void;
  onAutoDetect: () => void;
  isDetecting: boolean;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({
  userLocation,
  onOpenModal,
  onAutoDetect,
  isDetecting,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-champagne/5 via-transparent to-azure/5">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono tracking-widest text-champagne uppercase">
              {userLocation ? 'Location Active' : 'Departure Awareness'}
            </div>
            <p className="text-sm text-sand-200 mt-0.5">
              {userLocation ? (
                <>
                  Calculating travel distances from{' '}
                  <span className="text-sand-50 font-semibold underline decoration-champagne/40 underline-offset-4">
                    {userLocation.city}, {userLocation.country}
                  </span>
                </>
              ) : (
                'Enable location to discover exact flight distances, nearby havens, and local weather radar.'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {!userLocation && (
            <button
              onClick={onAutoDetect}
              disabled={isDetecting}
              className="px-4 py-2 rounded-xl bg-champagne hover:bg-champagne-light text-black text-xs font-semibold tracking-wider uppercase transition-all shadow-glow-gold flex items-center gap-1.5 disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Locating...' : 'Enable Location'}</span>
            </button>
          )}

          <button
            onClick={onOpenModal}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sand-200 hover:text-white text-xs font-medium tracking-wide transition-all flex items-center gap-1.5"
          >
            <span>{userLocation ? 'Change Origin' : 'Pick City Manually'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-sand-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
