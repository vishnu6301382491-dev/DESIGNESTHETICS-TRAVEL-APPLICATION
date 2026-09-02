import React, { useState } from 'react';
import { Compass, Sparkles, Clock, ArrowRight, Tag, Bookmark } from 'lucide-react';
import { Destination, FamousPlace } from '../../types/travel';

interface FamousPlacesSectionProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onPlanTrip: (dest: Destination) => void;
}

export const FamousPlacesSection: React.FC<FamousPlacesSectionProps> = ({
  destinations,
  onSelectDestination,
  onPlanTrip,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Flatten all famous places with their parent destination
  const allPlaces = destinations.flatMap((dest) =>
    dest.famousPlaces.map((place) => ({
      ...place,
      parentDestination: dest,
    }))
  );

  const categories = ['All', 'Sacred', 'Nature', 'Historic', 'Architecture', 'Wellness', 'Culinary'];

  const filteredPlaces = allPlaces.filter((p) =>
    selectedCategory === 'All' ? true : p.category === selectedCategory
  );

  return (
    <section id="famous-places" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-champagne text-xs font-mono tracking-widest uppercase mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Landmarks & Sacred Wonders</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-sand-50 font-normal tracking-tight">
            Famous Places Worth Visiting<span className="text-champagne">.</span>
          </h2>
          <p className="text-sand-400 text-sm sm:text-base font-light mt-2 max-w-2xl">
            Notable sanctuaries, natural wonders, and architectural triumphs—documented with insider advice and recommended arrival windows.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-champagne text-black font-semibold shadow-glow-gold'
                  : 'bg-white/5 hover:bg-white/10 text-sand-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Famous Places */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.slice(0, 9).map((place) => (
          <div
            key={place.id}
            onClick={() => onSelectDestination(place.parentDestination)}
            className="group glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-champagne/40 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1 shadow-luxury"
          >
            {/* Photography Header */}
            <div className="relative h-60 w-full overflow-hidden bg-white/5">
              <img
                src={place.backupImage}
                alt={place.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161D24] via-transparent to-black/40" />

              {/* Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-sand-200 uppercase tracking-widest border border-white/15">
                  {place.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-champagne/20 backdrop-blur-md text-[11px] font-mono text-champagne border border-champagne/30">
                  {place.admissionFee}
                </span>
              </div>

              {/* Destination Tag */}
              <div className="absolute bottom-3 left-4">
                <span className="text-xs text-sand-300 font-mono tracking-wider">
                  {place.parentDestination.name}, {place.parentDestination.country}
                </span>
                <h3 className="font-serif text-2xl text-sand-50 font-normal tracking-wide mt-0.5">
                  {place.name}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-sand-400 text-xs sm:text-sm leading-relaxed font-light">
                {place.description}
              </p>

              {/* Insider Tip Box */}
              <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 text-xs text-sand-300">
                <div className="flex items-center gap-1.5 text-champagne text-[11px] font-mono uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Curator's Insider Tip</span>
                </div>
                <p className="leading-relaxed font-light italic">"{place.insiderTip}"</p>
              </div>

              {/* Timing & Action */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-sand-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-sand-500" />
                  <span>{place.bestTimeToVisit}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlanTrip(place.parentDestination);
                  }}
                  className="text-xs text-sand-300 hover:text-champagne font-medium tracking-wide flex items-center gap-1 group/btn"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform text-champagne" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
