import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Sun,
  Shield,
  Bot,
  MapPin,
  Calendar,
  Layers,
  Globe
} from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Destination, UserLocation, TemperatureUnit, Continent, TravelVibe } from '../types/travel';
import { HeroSection } from '../components/hero/HeroSection';
import { LocationBanner } from '../components/location/LocationBanner';
import { DestinationCard } from '../components/explorer/DestinationCard';
import { FamousPlacesSection } from '../components/places/FamousPlacesSection';

interface HomePageProps {
  userLocation: UserLocation | null;
  onOpenLocationModal: () => void;
  onAutoDetectLocation: () => void;
  isDetectingLocation: boolean;
  tempUnit: TemperatureUnit;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedContinent: Continent | 'All';
  onSelectContinent: (c: Continent | 'All') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  userLocation,
  onOpenLocationModal,
  onAutoDetectLocation,
  isDetectingLocation,
  tempUnit,
  savedIds,
  onToggleSave,
  searchQuery,
  onSearchChange,
  selectedContinent,
  onSelectContinent,
}) => {
  const navigate = useNavigate();

  const featuredDestinations = DESTINATIONS_DATA.filter((d) => d.featured).slice(0, 6);

  const travelVibes: { label: TravelVibe; count: number; desc: string }[] = [
    { label: 'Coastal', count: 4, desc: 'Sun-drenched cliffs, cobalt fjords & marine glamor' },
    { label: 'Heritage', count: 5, desc: 'Centuries of preserved architecture & imperial shrines' },
    { label: 'Alpine', count: 3, desc: 'Pristine glacial summits & tranquil mountain air' },
    { label: 'Culinary', count: 6, desc: 'Living gastronomic traditions & Michelin craft' },
    { label: 'Wellness', count: 4, desc: 'Mineral hot springs, moss gardens & Zen rituals' },
    { label: 'Adventure', count: 5, desc: 'Canyon hiking, wild fjords & desert expeditions' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 01. Hero with Looping Background Video */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedContinent={selectedContinent}
        onSelectContinent={onSelectContinent}
        onExploreClick={() => navigate('/explore')}
        onOpenItineraryPlanner={() => navigate('/planner')}
      />

      {/* 04. Location Awareness Banner */}
      <LocationBanner
        userLocation={userLocation}
        onOpenModal={onOpenLocationModal}
        onAutoDetect={onAutoDetectLocation}
        isDetecting={isDetectingLocation}
      />

      {/* FEATURED DESTINATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-champagne text-xs font-mono tracking-widest uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curator's Highlights</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-sand-50 font-normal">
              Featured Sanctuaries<span className="text-champagne font-serif">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-sand-400 font-light mt-1.5 max-w-lg">
              Hand-selected global destinations offering singular atmosphere, rich cultural heritage, and sublime topography.
            </p>
          </div>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sand-300 hover:text-champagne transition-colors group"
          >
            <span>View All 12 Destinations</span>
            <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              userLocation={userLocation}
              tempUnit={tempUnit}
              isSaved={savedIds.includes(dest.id)}
              onToggleSave={onToggleSave}
              onSelect={() => navigate(`/destinations/${dest.id}`)}
              onPlanTrip={() => navigate(`/planner?dest=${dest.id}`)}
            />
          ))}
        </div>
      </section>

      {/* EXPLORE BY TRAVEL VIBE & ATMOSPHERE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne">
            Curated Moods
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            Explore by Travel Vibe
          </h2>
          <p className="text-xs sm:text-sm text-sand-400 font-light">
            Whether seeking meditative stillness or dramatic natural thrills, filter our portfolio by landscape character.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelVibes.map((vibe) => (
            <div
              key={vibe.label}
              onClick={() => navigate(`/explore`)}
              className="glass-card rounded-3xl p-6 border border-white/10 hover:border-champagne/40 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-4 hover:-translate-y-1 shadow-glass"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-champagne uppercase tracking-wider">
                    {vibe.count} Destinations
                  </span>
                  <ArrowRight className="w-4 h-4 text-sand-500 group-hover:text-champagne group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-serif text-2xl text-sand-100 font-normal group-hover:text-champagne transition-colors">
                  {vibe.label} Escapes
                </h3>
                <p className="text-xs text-sand-400 font-light leading-relaxed">
                  {vibe.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 03. Famous Places & Landmarks Gallery */}
      <FamousPlacesSection
        destinations={DESTINATIONS_DATA}
        onSelectDestination={(dest) => navigate(`/destinations/${dest.id}`)}
        onPlanTrip={(dest) => navigate(`/planner?dest=${dest.id}`)}
      />

      {/* AI TRIP PLANNING & CONCIERGE LAUNCHPAD BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#141A22] via-[#10141A] to-[#181F28] border border-white/15 p-8 sm:p-14 shadow-luxury relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/15 border border-champagne/30 text-champagne text-xs font-mono uppercase tracking-widest">
              <Bot className="w-3.5 h-3.5" />
              <span>Google Gemini 2.0 Integration</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-sand-50 font-normal tracking-tight">
              An AI Concierge Tailored for Discerning Travelers<span className="text-champagne font-serif">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-sand-300 font-light leading-relaxed">
              Ask about the optimal season to avoid crowds, what to pack for current weather, or generate a structured Day-by-Day itinerary complete with morning, afternoon, and evening schedules.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/planner')}
                className="px-6 py-3 rounded-full bg-champagne hover:bg-champagne-light text-black text-xs font-semibold uppercase tracking-wider transition-all shadow-glow-gold flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Build Itinerary</span>
              </button>
              <button
                onClick={() => navigate('/assistant')}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-sand-100 text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-champagne" />
                <span>Consult Concierge</span>
              </button>
            </div>
          </div>

          {/* Decorative Preview Card */}
          <div className="w-full lg:w-96 glass-card rounded-3xl p-6 border border-white/10 shadow-glass space-y-4 shrink-0">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <span className="font-mono text-champagne uppercase tracking-widest">
                Sample Output · Kyoto
              </span>
              <span className="text-sand-500 font-mono">Day 1 of 4</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-champagne block uppercase">08:30 · Morning</span>
                <span className="font-serif text-sand-100 text-sm block">Torii Corridor at Fushimi Inari</span>
                <span className="text-[11px] text-sand-400 font-light">Arrive at dawn for golden light through the vermilion gates.</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] font-mono text-champagne block uppercase">12:30 · Afternoon</span>
                <span className="font-serif text-sand-100 text-sm block">Kaiseki Tasting in Gion</span>
                <span className="text-[11px] text-sand-400 font-light">Seasonal multi-course dishes served in a cedar machiya.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DESIGNESTHETICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 p-6 rounded-3xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-champagne/15 border border-champagne/30 flex items-center justify-center text-champagne">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-sand-100 font-normal">Considered Curation</h3>
            <p className="text-xs text-sand-400 font-light leading-relaxed">
              We reject tourist-trap overload. Every sanctuary and place is vetted for aesthetic dignity, cultural authenticity, and tranquility.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-3xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-azure/15 border border-azure/30 flex items-center justify-center text-azure">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-sand-100 font-normal">Real-Time Telemetry</h3>
            <p className="text-xs text-sand-400 font-light leading-relaxed">
              Live atmospheric readings and dynamic packing guides guarantee you are prepared for whatever weather the climate holds.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-3xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-sand-100 font-normal">Day-by-Day Structure</h3>
            <p className="text-xs text-sand-400 font-light leading-relaxed">
              No wall-of-text AI outputs. Enjoy clean morning, afternoon, and evening timelines with printable PDF exports and checklist milestones.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
