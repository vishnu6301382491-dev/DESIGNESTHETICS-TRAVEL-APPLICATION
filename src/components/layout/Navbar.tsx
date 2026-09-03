import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Compass, MapPin, Heart, Sparkles, Calendar, Menu, X, Globe } from 'lucide-react';
import { UserLocation, TemperatureUnit } from '../../types/travel';

interface NavbarProps {
  userLocation: UserLocation | null;
  onOpenLocationModal: () => void;
  tempUnit: TemperatureUnit;
  onToggleTempUnit: () => void;
  savedCount: number;
  onOpenWishlist: () => void;
  onOpenAIChatDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userLocation,
  onOpenLocationModal,
  tempUnit,
  onToggleTempUnit,
  savedCount,
  onOpenWishlist,
  onOpenAIChatDrawer,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 tracking-wide flex items-center gap-1.5 py-1 ${
      isActive
        ? 'text-champagne font-semibold border-b border-champagne'
        : 'text-sand-300 hover:text-sand-50'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0D10]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-luxury'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne group-hover:scale-105 transition-transform duration-300 shadow-glow-gold">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-serif text-2xl tracking-wider text-sand-50 font-normal">
            designesthetics<span className="text-champagne font-bold">.</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-sand-300">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/explore" className={navLinkClass}>
            Explore Havens
          </NavLink>
          <NavLink to="/planner" className={navLinkClass}>
            <Calendar className="w-3.5 h-3.5 text-champagne" />
            <span>Trip Planner</span>
          </NavLink>
          <NavLink to="/assistant" className={navLinkClass}>
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span>AI Concierge</span>
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Location Badge */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 transition-all duration-200"
            title="Departure Point: View or Change Origin City"
          >
            <MapPin className="w-3.5 h-3.5 text-champagne" />
            <span className="max-w-[120px] truncate">
              {userLocation ? `${userLocation.city}` : 'Set Origin'}
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

          {/* Plan Trip CTA Button */}
          <button
            onClick={() => navigate('/planner')}
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

      {/* Accessible Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0D10]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-5 animate-fadeIn">
          <div className="flex flex-col gap-4 text-xs font-mono uppercase tracking-widest text-sand-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5 hover:text-champagne"
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5 hover:text-champagne"
            >
              Explore Havens
            </Link>
            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 border-b border-white/5 text-champagne"
            >
              <Calendar className="w-4 h-4" />
              Trip Planner
            </Link>
            <Link
              to="/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 border-b border-white/5 text-champagne"
            >
              <Sparkles className="w-4 h-4" />
              AI Concierge Salon
            </Link>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLocationModal();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-xs text-sand-200"
            >
              <MapPin className="w-3.5 h-3.5 text-champagne" />
              <span>{userLocation ? userLocation.city : 'Set Origin'}</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleTempUnit}
                className="px-3 py-2 rounded-lg bg-white/5 text-xs font-mono text-sand-200"
              >
                °{tempUnit}
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
