import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="glass-card max-w-lg w-full p-10 rounded-3xl border border-white/10 shadow-luxury space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne shadow-glow-gold">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne">
            Error 404 · Uncharted Horizon
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-sand-50 font-normal">
            Destination Unknown<span className="text-champagne font-serif">.</span>
          </h1>
          <p className="text-sm text-sand-400 font-light leading-relaxed max-w-sm mx-auto">
            The coordinate or dossier you requested lies beyond our charted portfolio. Let us guide you back to our curated sanctuaries.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-champagne hover:bg-champagne-light text-black text-xs font-semibold tracking-wider uppercase transition-all shadow-glow-gold flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sand-200 text-xs font-medium tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
            <span>Browse Explorer</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
