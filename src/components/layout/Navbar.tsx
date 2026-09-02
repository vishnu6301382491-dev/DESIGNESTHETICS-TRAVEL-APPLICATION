import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Heart, Sparkles, Calendar, Menu, X } from 'lucide-react';
import { UserLocation, TemperatureUnit } from '../../types/travel';

interface NavbarProps {
  userLocation: UserLocation | null;
  onOpenLocationModal: () => void;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  savedCount: number;
  onOpenWishlist: () => void;
  onOpenAIChat: () => void;
  onOpenItineraryPlanner: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userLocation,
  onOpenLocationModal,
  tempUnit,
  onToggleTempUnit,
  savedCount,
  onOpenWishlist,
  onOpenAIChat,
  onOpenItineraryPlanner
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0D10]/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-luxury'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-champagne/10 border border-champagne/40 flex items-center justify-center text-champagne group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-serif text-2xl tracking-wider text-sand-50 font-normal">
            designesthetics<span className="text-champagne font-bold">.</span>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium tracking-wide text-sand-300">
          <a href="#explorer" className="hover:text-champagne transition-colors duration-200">
            Destinations
          </a>
          <a href="#famous-places" className="hover:text-champagne transition-colors duration-200">
            Famous Places
          </a>
          <button
            onClick={onOpenItineraryPlanner}
            className="flex items-center gap-1.5 hover:text-champagne transition-colors duration-200"
          >
            <Calendar className="w-4 h-4 text-champagne" />
            <span>Itinerary Planner</span>
          </button>
          <button
            onClick={onOpenAIChat}
            className="flex items-center gap-1.5 text-champagne hover:text-champagne-light transition-colors duration-200"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>AI Concierge</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Location Badge */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 transition-all duration-200"
            title="Update Departure / Current Location"
          >
            <MapPin className="w-3.5 h-3.5 text-champagne" />
            <span className="max-w-[130px] truncate">
              {userLocation ? `${userLocation.city}` : 'Set Location'}
            </span>
          </button>

          {/* Temperature Toggle */}
          <button
            onClick={onToggleTempUnit}
            className="px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-sand-200 transition-all duration-200"
            title="Toggle Celsius / Fahrenheit"
          >
            °{tempUnit}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sand-200 hover:text-champagne transition-all duration-200"
            title="Saved Destinations"
          >
            <Heart className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-champagne text-black text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Plan Trip CTA */}
          <button
            onClick={onOpenItineraryPlanner}
            className="px-4 py-1.5 rounded-full bg-champagne text-black text-xs font-semibold tracking-wider uppercase hover:bg-champagne-light transition-all duration-200 shadow-glow-gold"
          >
            Plan Trip
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-sand-200 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0D10]/95 backdrop-blur-xl border-b border-white/10 px-6 py-5 space-y-4">
          <div className="flex flex-col gap-3 text-sm text-sand-200 font-medium">
            <a
              href="#explorer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5"
            >
              Destinations
            </a>
            <a
              href="#famous-places"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5"
            >
              Famous Places
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenItineraryPlanner();
              }}
              className="flex items-center gap-2 py-2 text-left border-b border-white/5 text-champagne"
            >
              <Calendar className="w-4 h-4" />
              Itinerary Planner
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAIChat();
              }}
              className="flex items-center gap-2 py-2 text-left border-b border-white/5 text-champagne"
            >
              <Sparkles className="w-4 h-4" />
              AI Concierge
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLocationModal();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-xs text-sand-200"
            >
              <MapPin className="w-3.5 h-3.5 text-champagne" />
              <span>{userLocation ? userLocation.city : 'Set Location'}</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleTempUnit}
                className="px-3 py-2 rounded-lg bg-white/5 text-xs font-mono text-sand-200"
              >
                Unit: °{tempUnit}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
                className="p-2 rounded-lg bg-white/5 text-sand-200 relative"
              >
                <Heart className="w-4 h-4" />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-champagne text-black text-[10px] font-bold flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
