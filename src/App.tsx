import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Calendar, Heart, MapPin } from 'lucide-react';
import { DESTINATIONS_DATA } from './data/destinations';
import { Destination, UserLocation, TemperatureUnit, Continent } from './types/travel';
import { requestBrowserLocation } from './services/locationService';

// Components
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { LocationBanner } from './components/location/LocationBanner';
import { LocationModal } from './components/location/LocationModal';
import { DestinationExplorer } from './components/explorer/DestinationExplorer';
import { DestinationDetailModal } from './components/detail/DestinationDetailModal';
import { FamousPlacesSection } from './components/places/FamousPlacesSection';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { ItineraryPlannerModal } from './components/itinerary/ItineraryPlannerModal';
import { WishlistModal } from './components/wishlist/WishlistModal';
import { Footer } from './components/layout/Footer';

export const App: React.FC = () => {
  // State: Destinations
  const [destinations] = useState<Destination[]>(DESTINATIONS_DATA);

  // State: User Location
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem('designesthetics_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // State: Temperature Unit
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(() => {
    return (localStorage.getItem('designesthetics_tempUnit') as TemperatureUnit) || 'C';
  });

  // State: Saved Wishlist
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('designesthetics_wishlist');
    return saved ? JSON.parse(saved) : ['kyoto', 'amalfi-coast'];
  });
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);

  // State: Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'All'>('All');

  // State: Modals & Drawers
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [itineraryModalOpen, setItineraryModalOpen] = useState(false);
  const [itineraryTargetDest, setItineraryTargetDest] = useState<Destination | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatDestination, setAiChatDestination] = useState<Destination | null>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    if (userLocation) {
      localStorage.setItem('designesthetics_location', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem('designesthetics_tempUnit', tempUnit);
  }, [tempUnit]);

  useEffect(() => {
    localStorage.setItem('designesthetics_wishlist', JSON.stringify(savedIds));
  }, [savedIds]);

  // Handle location auto-detection
  const handleAutoDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const loc = await requestBrowserLocation();
      setUserLocation(loc);
    } catch (err) {
      console.warn('Auto location detection skipped or denied:', err);
      setLocationModalOpen(true);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Toggle wishlist item
  const handleToggleSave = (destId: string) => {
    setSavedIds((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  // Open Itinerary Planner for a specific destination
  const handleOpenItineraryForDest = (dest: Destination) => {
    setItineraryTargetDest(dest);
    setItineraryModalOpen(true);
  };

  // Open AI Chat for a specific destination
  const handleOpenAIChatForDest = (dest: Destination) => {
    setAiChatDestination(dest);
    setAiChatOpen(true);
  };

  // Scroll smoothly to explorer section
  const handleScrollToExplorer = () => {
    const el = document.getElementById('explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const savedDestinations = destinations.filter((d) => savedIds.includes(d.id));

  return (
    <div className="min-h-screen bg-[#0A0D10] text-[#EAE2D8] flex flex-col selection:bg-champagne selection:text-black">
      {/* Editorial Navigation Header */}
      <Navbar
        userLocation={userLocation}
        onOpenLocationModal={() => setLocationModalOpen(true)}
        tempUnit={tempUnit}
        onToggleTempUnit={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
        savedCount={savedIds.length}
        onOpenWishlist={() => setWishlistModalOpen(true)}
        onOpenAIChat={() => {
          setAiChatDestination(null);
          setAiChatOpen(true);
        }}
        onOpenItineraryPlanner={() => {
          setItineraryTargetDest(null);
          setItineraryModalOpen(true);
        }}
      />

      <main className="flex-1">
        {/* 01. Cinematic Looping Background Video Hero */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedContinent={selectedContinent}
          onSelectContinent={setSelectedContinent}
          onExploreClick={handleScrollToExplorer}
          onOpenItineraryPlanner={() => {
            setItineraryTargetDest(null);
            setItineraryModalOpen(true);
          }}
        />

        {/* 04. Location Awareness Banner */}
        <LocationBanner
          userLocation={userLocation}
          onOpenModal={() => setLocationModalOpen(true)}
          onAutoDetect={handleAutoDetectLocation}
          isDetecting={isDetectingLocation}
        />

        {/* 02. Destination Explorer with Search, Filters & Sorting */}
        <DestinationExplorer
          destinations={destinations}
          userLocation={userLocation}
          tempUnit={tempUnit}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
          onPlanTrip={handleOpenItineraryForDest}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedContinent={selectedContinent}
          onSelectContinent={setSelectedContinent}
        />

        {/* 03. Famous Places Showcase */}
        <FamousPlacesSection
          destinations={destinations}
          onSelectDestination={(dest) => setSelectedDestination(dest)}
          onPlanTrip={handleOpenItineraryForDest}
        />
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* MODALS & DRAWERS */}

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        userLocation={userLocation}
        tempUnit={tempUnit}
        isSaved={selectedDestination ? savedIds.includes(selectedDestination.id) : false}
        onToggleSave={handleToggleSave}
        onPlanTrip={(dest) => {
          setSelectedDestination(null);
          handleOpenItineraryForDest(dest);
        }}
        onOpenAIChat={(dest) => {
          setSelectedDestination(null);
          handleOpenAIChatForDest(dest);
        }}
      />

      {/* 08. Structured Itinerary Planner Modal */}
      <ItineraryPlannerModal
        isOpen={itineraryModalOpen}
        onClose={() => setItineraryModalOpen(false)}
        destinations={destinations}
        initialDestination={itineraryTargetDest}
      />

      {/* 07. AI Concierge Chat Drawer */}
      <AIChatDrawer
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        activeDestination={aiChatDestination}
        onPlanTrip={(dest) => {
          setAiChatOpen(false);
          handleOpenItineraryForDest(dest);
        }}
      />

      {/* Location Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={setUserLocation}
      />

      {/* Saved Wishlist Modal */}
      <WishlistModal
        isOpen={wishlistModalOpen}
        onClose={() => setWishlistModalOpen(false)}
        savedDestinations={savedDestinations}
        onRemove={handleToggleSave}
        onSelectDestination={(dest) => setSelectedDestination(dest)}
        onPlanTrip={handleOpenItineraryForDest}
      />

      {/* FLOATING ACTION BEACON (AI Concierge Quick Launch) */}
      {!aiChatOpen && (
        <button
          onClick={() => {
            setAiChatDestination(null);
            setAiChatOpen(true);
          }}
          aria-label="Open AI Travel Concierge"
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-champagne text-black hover:bg-champagne-light transition-all shadow-luxury hover:scale-105 group flex items-center gap-2.5 font-semibold text-xs tracking-wider uppercase border border-champagne-light/30 shadow-glow-gold"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">AI Concierge</span>
          <span className="w-2 h-2 rounded-full bg-black/60 group-hover:scale-125 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default App;
