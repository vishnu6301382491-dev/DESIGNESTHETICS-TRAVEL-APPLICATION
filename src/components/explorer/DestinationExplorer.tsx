import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { Destination, Continent, TravelVibe, BudgetTier, UserLocation, TemperatureUnit } from '../../types/travel';
import { DestinationCard } from './DestinationCard';
import { EmptyState } from '../common/LoadingSkeleton';
import { calculateDistanceKm } from '../../services/locationService';

interface DestinationExplorerProps {
  destinations: Destination[];
  userLocation: UserLocation | null;
  tempUnit: TemperatureUnit;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectDestination: (dest: Destination) => void;
  onPlanTrip: (dest: Destination) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedContinent: Continent | 'All';
  onSelectContinent: (c: Continent | 'All') => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  destinations,
  userLocation,
  tempUnit,
  savedIds,
  onToggleSave,
  onSelectDestination,
  onPlanTrip,
  searchQuery,
  onSearchChange,
  selectedContinent,
  onSelectContinent,
}) => {
  const [selectedVibe, setSelectedVibe] = useState<TravelVibe | 'All'>('All');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier | 'All'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'distance' | 'rating' | 'name'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const continents: (Continent | 'All')[] = ['All', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
  const vibes: (TravelVibe | 'All')[] = ['All', 'Coastal', 'Alpine', 'Heritage', 'Culinary', 'Wellness', 'Adventure'];
  const budgets: (BudgetTier | 'All')[] = ['All', '$', '$$', '$$$', '$$$$'];

  // Filter & Sort Logic
  const filteredDestinations = useMemo(() => {
    return destinations
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
        // Default: featured first, then rating
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.rating - a.rating;
      });
  }, [destinations, searchQuery, selectedContinent, selectedVibe, selectedBudget, sortBy, userLocation]);

  const resetAllFilters = () => {
    onSearchChange('');
    onSelectContinent('All');
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
    <section id="explorer" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-champagne text-xs font-mono tracking-widest uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Sanctuary Portfolio</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-sand-50 font-normal tracking-tight">
            Destination Explorer<span className="text-champagne">.</span>
          </h2>
          <p className="text-sand-400 text-sm sm:text-base font-light mt-2 max-w-xl">
            Search, filter by travel vibe, or sort by distance from your current departure coordinates.
          </p>
        </div>

        {/* Action Toggles: Filter Button & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium tracking-wide border transition-all ${
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
              className="pl-8 pr-8 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 focus:outline-none focus:border-champagne/40 appearance-none cursor-pointer tracking-wide"
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

      {/* Primary Continent Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-white/5 mb-6">
        {continents.map((c) => (
          <button
            key={c}
            onClick={() => onSelectContinent(c)}
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

      {/* Expanded Filter Panel (Vibes & Budget) */}
      {showFilters && (
        <div className="glass-card rounded-2xl p-6 border border-white/10 mb-8 space-y-5 animate-fadeIn">
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

      {/* Active Filter Pills Bar & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs text-sand-400">
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

        {searchQuery && (
          <div className="text-xs font-mono text-sand-300">
            Search term: "<span className="text-champagne">{searchQuery}</span>"
          </div>
        )}
      </div>

      {/* Grid of Destination Cards */}
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
              onSelect={onSelectDestination}
              onPlanTrip={onPlanTrip}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Matching Havens Found"
          message={`No destinations matched your criteria (${[
            searchQuery ? `"${searchQuery}"` : null,
            selectedContinent !== 'All' ? selectedContinent : null,
            selectedVibe !== 'All' ? selectedVibe : null,
          ]
            .filter(Boolean)
            .join(', ')}). Try clearing filters or searching for another term.`}
          onReset={resetAllFilters}
        />
      )}
    </section>
  );
};
