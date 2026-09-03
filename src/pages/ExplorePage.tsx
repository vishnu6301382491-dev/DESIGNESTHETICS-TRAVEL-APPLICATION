import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, Compass } from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Destination, Continent, TravelVibe, BudgetTier, UserLocation, TemperatureUnit } from '../types/travel';
import { DestinationCard } from '../components/explorer/DestinationCard';
import { EmptyState } from '../components/common/LoadingSkeleton';
import { calculateDistanceKm } from '../services/locationService';

interface ExplorePageProps {
  userLocation: UserLocation | null;
  tempUnit: TemperatureUnit;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  userLocation,
  tempUnit,
  savedIds,
  onToggleSave,
}) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'All'>('All');
  const [selectedVibe, setSelectedVibe] = useState<TravelVibe | 'All'>('All');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier | 'All'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'distance' | 'rating' | 'name'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const continents: (Continent | 'All')[] = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
  const vibes: (TravelVibe | 'All')[] = [
    'All',
    'Coastal',
    'Alpine',
    'Heritage',
    'Culinary',
    'Wellness',
    'Adventure',
    'Art & Culture',
    'Architecture',
    'Nature',
  ];
  const budgets: (BudgetTier | 'All')[] = ['All', '$', '$$', '$$$', '$$$$'];

  // Filter & Sort Logic
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS_DATA
      .filter((dest) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = dest.name.toLowerCase().includes(q);
          const matchCountry = dest.country.toLowerCase().includes(q);
          const matchTagline = dest.tagline.toLowerCase().includes(q);
          const matchVibes = dest.vibe.some((v) => v.toLowerCase().includes(q));
          const matchPlaces = dest.famousPlaces.some((p) => p.name.toLowerCase().includes(q));
          if (!matchName && !matchCountry && !matchTagline && !matchVibes && !matchPlaces) {
            return false;
          }
        }

        // Continent filter
        if (selectedContinent !== 'All' && dest.continent !== selectedContinent) {
          return false;
        }

        // Vibe filter
        if (selectedVibe !== 'All' && !dest.vibe.includes(selectedVibe)) {
          return false;
        }

        // Budget filter
        if (selectedBudget !== 'All' && dest.budgetLevel !== selectedBudget) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && userLocation) {
          const distA = calculateDistanceKm(userLocation.lat, userLocation.lng, a.coordinates.lat, a.coordinates.lng);
          const distB = calculateDistanceKm(userLocation.lat, userLocation.lng, b.coordinates.lat, b.coordinates.lng);
          return distA - distB;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }, [searchQuery, selectedContinent, selectedVibe, selectedBudget, sortBy, userLocation]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedContinent('All');
    setSelectedVibe('All');
    setSelectedBudget('All');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedContinent !== 'All' ||
    selectedVibe !== 'All' ||
    selectedBudget !== 'All' ||
    sortBy !== 'featured';

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-champagne text-xs font-mono tracking-widest uppercase mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Global Sanctuaries Portfolio</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl text-sand-50 font-normal tracking-tight">
            Destination Explorer<span className="text-champagne font-serif">.</span>
          </h1>
          <p className="text-sand-400 text-sm sm:text-base font-light mt-2 max-w-xl">
            Browse our curated destinations, filter by landscape vibe or season, and inspect each location's dedicated editorial dossier.
          </p>
        </div>

        {/* Action Toggles: Filter Button & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium tracking-wide border transition-all ${
              showFilters || selectedVibe !== 'All' || selectedBudget !== 'All'
                ? 'bg-champagne/15 border-champagne text-champagne'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-sand-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine Filters</span>
            {(selectedVibe !== 'All' || selectedBudget !== 'All') && (
              <span className="w-2 h-2 rounded-full bg-champagne" />
            )}
          </button>

          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-sand-400 absolute left-3 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-8 pr-8 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 focus:outline-none focus:border-champagne/40 appearance-none cursor-pointer tracking-wide"
            >
              <option value="featured" className="bg-[#11161C] text-sand-100">
                Curator's Choice
              </option>
              {userLocation && (
                <option value="distance" className="bg-[#11161C] text-sand-100">
                  Nearest to You
                </option>
              )}
              <option value="rating" className="bg-[#11161C] text-sand-100">
                Highest Rated
              </option>
              <option value="name" className="bg-[#11161C] text-sand-100">
                Alphabetical (A–Z)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="glass-card rounded-2xl p-2.5 border border-white/10 flex items-center gap-3">
        <Search className="w-5 h-5 text-champagne ml-2 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destination, city, country (e.g. Paris, Tokyo, Kyoto, Amalfi, Bali, Switzerland)..."
          className="w-full bg-transparent text-sm text-sand-100 placeholder-sand-500 focus:outline-none tracking-wide py-1.5"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-sand-400 hover:text-sand-100 px-3 py-1 font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* Primary Continent Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
        {continents.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedContinent(c)}
            className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide uppercase transition-all shrink-0 ${
              selectedContinent === c
                ? 'bg-champagne text-black font-semibold shadow-glow-gold'
                : 'bg-white/5 hover:bg-white/10 text-sand-300 hover:text-white border border-white/5'
            }`}
          >
            {c === 'All' ? 'All Continents' : c}
          </button>
        ))}
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5 animate-fadeIn">
          {/* Vibe Selection */}
          <div>
            <div className="text-xs font-mono text-sand-400 uppercase tracking-widest mb-2.5">
              Travel Vibe & Atmosphere:
            </div>
            <div className="flex flex-wrap gap-2">
              {vibes.map((v) => (
                <button
                  key={v}
                  onClick={() => setSelectedVibe(v)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs tracking-wide transition-all ${
                    selectedVibe === v
                      ? 'bg-white/20 text-champagne border border-champagne/40'
                      : 'bg-white/5 hover:bg-white/10 text-sand-400 border border-white/5'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Selection */}
          <div className="pt-2 border-t border-white/5">
            <div className="text-xs font-mono text-sand-400 uppercase tracking-widest mb-2.5">
              Budget Tier:
            </div>
            <div className="flex flex-wrap gap-2">
              {budgets.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBudget(b)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
                    selectedBudget === b
                      ? 'bg-champagne text-black font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-sand-400 border border-white/5'
                  }`}
                >
                  {b === 'All' ? 'Any Budget' : `${b} Tier`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Counter & Active Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-sand-400">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-sand-100">{filteredDestinations.length}</strong> curated havens
          </span>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 text-champagne hover:underline ml-3"
            >
              <X className="w-3.5 h-3.5" />
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Grid of Destination Cards (Clicking opens /destinations/:id) */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
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
      ) : (
        <EmptyState
          title="No Matching Havens Found"
          message={`No destinations matched your criteria. Try adjusting filters or searching for another term.`}
          onReset={resetAllFilters}
        />
      )}
    </div>
  );
};
