import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { DESTINATIONS_DATA } from './data/destinations';
import { Destination, UserLocation, TemperatureUnit, Continent } from './types/travel';
import { requestBrowserLocation } from './services/locationService';

// Layout & Global Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LocationModal } from './components/location/LocationModal';
import { WishlistModal } from './components/wishlist/WishlistModal';
import { AIChatDrawer } from './components/ai/AIChatDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { PlannerPage } from './pages/PlannerPage';
import { AssistantPage } from './pages/AssistantPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
    return saved ? JSON.parse(saved) : ['kyoto', 'amalfi-coast', 'paris'];
  });
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);

  // State: Search & Filters on Homepage
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<Continent | 'All'>('All');

  // State: Global AI Concierge Drawer
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

  const savedDestinations = destinations.filter((d) => savedIds.includes(d.id));

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0A0D10] text-[#EAE2D8] flex flex-col selection:bg-champagne selection:text-black">
        {/* Editorial Navigation Header */}
        <Navbar
          userLocation={userLocation}
          onOpenLocationModal={() => setLocationModalOpen(true)}
          tempUnit={tempUnit}
          onToggleTempUnit={() => setTempUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
          savedCount={savedIds.length}
          onOpenWishlist={() => setWishlistModalOpen(true)}
          onOpenAIChatDrawer={() => {
            setAiChatDestination(null);
            setAiChatOpen(true);
          }}
        />

        {/* Main Application Router */}
        <main className="flex-1">
          <Routes>
            {/* 01. Homepage */}
            <Route
              path="/"
              element={
                <HomePage
                  userLocation={userLocation}
                  onOpenLocationModal={() => setLocationModalOpen(true)}
                  onAutoDetectLocation={handleAutoDetectLocation}
                  isDetectingLocation={isDetectingLocation}
                  tempUnit={tempUnit}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedContinent={selectedContinent}
                  onSelectContinent={setSelectedContinent}
                />
              }
            />

            {/* 02. Explore Havens Route */}
            <Route
              path="/explore"
              element={
                <ExplorePage
                  userLocation={userLocation}
                  tempUnit={tempUnit}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />

            {/* 07. Dedicated Destination Detail Page Route */}
            <Route
              path="/destinations/:id"
              element={
                <DestinationDetailPage
                  userLocation={userLocation}
                  tempUnit={tempUnit}
                  savedIds={savedIds}
                  onToggleSave={handleToggleSave}
                />
              }
            />

            {/* 08. Dedicated AI Trip Planner Page Route */}
            <Route path="/planner" element={<PlannerPage />} />

            {/* 07. Dedicated AI Concierge Salon Route */}
            <Route path="/assistant" element={<AssistantPage />} />

            {/* 404 Catch-All Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Editorial Footer */}
        <Footer />

        {/* GLOBAL MODALS & DRAWERS */}

        {/* Location Origin Modal */}
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
          onSelectDestination={() => {}}
          onPlanTrip={() => {}}
        />

        {/* Global AI Concierge Drawer */}
        <AIChatDrawer
          isOpen={aiChatOpen}
          onClose={() => setAiChatOpen(false)}
          activeDestination={aiChatDestination}
          onPlanTrip={() => {}}
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
    </HashRouter>
  );
};

export default App;
