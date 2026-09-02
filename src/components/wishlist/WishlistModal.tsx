import React from 'react';
import { X, Heart, Trash2, ArrowRight, Compass } from 'lucide-react';
import { Destination } from '../../types/travel';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDestinations: Destination[];
  onRemove: (id: string) => void;
  onSelectDestination: (dest: Destination) => void;
  onPlanTrip: (dest: Destination) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  savedDestinations,
  onRemove,
  onSelectDestination,
  onPlanTrip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="glass-card w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-white/15 shadow-luxury relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne">
              <Heart className="w-5 h-5 fill-champagne" />
            </div>
            <div>
              <h3 className="font-serif text-2xl text-sand-50 font-normal">
                Saved Sanctuaries
              </h3>
              <p className="text-xs text-sand-400">
                {savedDestinations.length} destination{savedDestinations.length !== 1 ? 's' : ''} saved to your wishlist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close saved destinations"
            className="p-2 rounded-full hover:bg-white/10 text-sand-400 hover:text-sand-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedDestinations.length > 0 ? (
            savedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-4 hover:border-champagne/30 transition-all group"
              >
                <div
                  onClick={() => {
                    onSelectDestination(dest);
                    onClose();
                  }}
                  className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
                >
                  <img
                    src={dest.backupHeroImage}
                    alt={dest.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-champagne block">
                      {dest.continent}
                    </span>
                    <h4 className="font-serif text-lg text-sand-100 truncate group-hover:text-champagne transition-colors">
                      {dest.name}, {dest.country}
                    </h4>
                    <span className="text-xs text-sand-400 font-light truncate block">
                      {dest.idealDuration} · {dest.bestSeason}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onPlanTrip(dest);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-champagne hover:text-black text-xs text-sand-200 transition-all font-medium uppercase tracking-wider"
                  >
                    Plan
                  </button>
                  <button
                    onClick={() => onRemove(dest.id)}
                    aria-label={`Remove ${dest.name} from saved`}
                    className="p-2 rounded-lg text-sand-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <Compass className="w-10 h-10 text-sand-500 mx-auto" />
              <p className="text-sm text-sand-300 font-serif text-lg">No saved sanctuaries yet</p>
              <p className="text-xs text-sand-500 max-w-xs mx-auto">
                Click the heart icon on any destination card to curate your personal collection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
