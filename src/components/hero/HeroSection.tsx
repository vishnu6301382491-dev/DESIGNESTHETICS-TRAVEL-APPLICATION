import React, { useState, useRef } from 'react';
import { Search, ChevronDown, Volume2, VolumeX, Sparkles, Compass } from 'lucide-react';
import { Continent } from '../../types/travel';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedContinent: Continent | 'All';
  onSelectContinent: (c: Continent | 'All') => void;
  onExploreClick: () => void;
  onOpenItineraryPlanner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedContinent,
  onSelectContinent,
  onExploreClick,
  onOpenItineraryPlanner,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const continents: (Continent | 'All')[] = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];

  return (
    <section className="relative min-h-[96vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Looping Background Video */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        >
          {/* High quality CDN looping drone footage of cinematic coastline & mountains */}
          <source
            src="https://cdn.coverr.co/videos/coverr-drone-shot-of-the-coastline-5401/1080p.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-rocky-beach-1407-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic Vignette and Dark Editorial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D10]/80 via-[#0A0D10]/45 to-[#0A0D10]" />
        <div className="absolute inset-0 bg-radial-vignette opacity-70" />
      </div>

      {/* Audio Mute/Unmute Toggle */}
      <button
        onClick={toggleAudio}
        aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        className="absolute bottom-8 right-8 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-sand-300 hover:text-sand-50 transition-all duration-200"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-champagne" />}
      </button>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 flex flex-col items-center">
        {/* Curated Monogram Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sand-200 text-xs font-mono tracking-widest uppercase mb-8 shadow-glass animate-pulseSubtle">
          <Sparkles className="w-3.5 h-3.5 text-champagne" />
          <span>The 2026 Global Portfolio · Issue IX</span>
        </div>

        {/* Editorial Heading */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight text-sand-50 font-normal leading-[1.05] max-w-4xl mx-auto mb-6 drop-shadow-2xl">
          The Art of <br className="hidden sm:inline" />
          <span className="italic font-light text-sand-100 font-serif">Considered</span> Wandering<span className="text-champagne font-serif">.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sand-300 text-base sm:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow">
          Immerse in curated global destinations, real-time atmospheric telemetry,
          and bespoke day-by-day itineraries tailored with our intelligent AI concierge.
        </p>

        {/* Hero Integrated Search & Quick Filter */}
        <div className="w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-white/15 rounded-2xl p-2.5 shadow-luxury mb-8">
          <div className="flex items-center gap-3 px-3 py-1.5">
            <Search className="w-5 h-5 text-champagne shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Kyoto, Banff, Alpine hikes, or culinary escapes..."
              className="w-full bg-transparent text-sand-100 placeholder-sand-500 text-sm sm:text-base focus:outline-none tracking-wide"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-sand-400 hover:text-sand-100 px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onExploreClick}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-champagne text-black text-xs font-semibold tracking-wider uppercase hover:bg-champagne-light transition-colors shadow-glow-gold"
            >
              <Compass className="w-3.5 h-3.5" />
              Explore
            </button>
          </div>

          {/* Quick Continent Chips */}
          <div className="flex items-center gap-1.5 pt-2.5 px-2 border-t border-white/10 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-sand-500 uppercase tracking-wider font-mono mr-1 shrink-0">
              Region:
            </span>
            {continents.map((continent) => (
              <button
                key={continent}
                onClick={() => onSelectContinent(continent)}
                className={`px-3 py-1 rounded-lg text-xs tracking-wide transition-all shrink-0 ${
                  selectedContinent === continent
                    ? 'bg-white/20 text-champagne border border-champagne/40'
                    : 'text-sand-400 hover:text-sand-200 hover:bg-white/5'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>

        {/* Action Callouts */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <button
            onClick={onExploreClick}
            className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-sand-100 font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-2 hover:border-champagne/40"
          >
            <span>Discover Havens</span>
            <ChevronDown className="w-4 h-4 text-champagne" />
          </button>
          <button
            onClick={onOpenItineraryPlanner}
            className="px-6 py-3 rounded-full bg-champagne hover:bg-champagne-light text-black font-semibold tracking-wider uppercase transition-all duration-200 shadow-glow-gold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Itinerary</span>
          </button>
        </div>

        {/* Metric Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 mt-16 pt-8 border-t border-white/10 text-center max-w-3xl w-full">
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-sand-100 font-normal">12+</div>
            <div className="text-[11px] text-sand-400 font-mono uppercase tracking-widest mt-0.5">
              Curated Havens
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-champagne font-normal">Real-Time</div>
            <div className="text-[11px] text-sand-400 font-mono uppercase tracking-widest mt-0.5">
              Weather Radar
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-sand-100 font-normal">Gemini 2.0</div>
            <div className="text-[11px] text-sand-400 font-mono uppercase tracking-widest mt-0.5">
              AI Concierge
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-sand-100 font-normal">Day-by-Day</div>
            <div className="text-[11px] text-sand-400 font-mono uppercase tracking-widest mt-0.5">
              Smart Planning
            </div>
          </div>
        </div>

        {/* Scroll down prompt */}
        <button
          onClick={onExploreClick}
          aria-label="Scroll to Destination Explorer"
          className="mt-10 inline-flex flex-col items-center gap-2 text-sand-400 hover:text-champagne transition-colors animate-float"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Explore Below</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
