import React from 'react';
import { Compass, Sparkles, Heart, Globe, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#070A0C] text-sand-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl tracking-wider text-sand-50 font-normal">
                designesthetics<span className="text-champagne font-bold">.</span>
              </span>
            </div>
            <p className="text-sand-400 text-sm leading-relaxed max-w-md font-light">
              A bespoke digital publication and travel atelier. Dedicated to the art of considered exploration, timeless architecture, living cultural traditions, and intelligent travel synthesis.
            </p>
            <div className="text-[11px] font-mono text-sand-500 flex items-center gap-2 pt-2">
              <span>EST. 2026</span>
              <span>·</span>
              <span>GLOBAL EXPEDITIONS</span>
              <span>·</span>
              <span>PARIS / TOKYO / NEW YORK</span>
            </div>
          </div>

          {/* Col 2: Telemetry & Technology */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-sand-200">
              Integrations & Telemetry
            </h4>
            <ul className="space-y-2 text-xs text-sand-400">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                <span>Google Gemini AI (Concierge & Plans)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-azure" />
                <span>OpenWeather & Open-Meteo Telemetry</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sand-300" />
                <span>Unsplash Dynamic Imagery Engine</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Browser Geolocation Distance Engine</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation & Back to Top */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-sand-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#explorer" className="hover:text-champagne transition-colors">
                  Destination Explorer
                </a>
              </li>
              <li>
                <a href="#famous-places" className="hover:text-champagne transition-colors">
                  Famous Places & Landmarks
                </a>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-champagne transition-colors flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Return to Top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-sand-500 font-mono">
          <div>
            © {new Date().getFullYear()} designesthetics. All rights reserved. Crafted for the Front-End Developer Assignment.
          </div>
          <div className="flex items-center gap-4">
            <span>React + Vite</span>
            <span>·</span>
            <span>TypeScript</span>
            <span>·</span>
            <span>Tailwind CSS</span>
            <span>·</span>
            <span>Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
