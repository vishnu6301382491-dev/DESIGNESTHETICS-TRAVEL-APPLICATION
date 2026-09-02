import React from 'react';
import { Compass, RefreshCw, AlertCircle } from 'lucide-react';

export const DestinationSkeleton: React.FC = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/5 animate-pulse">
      <div className="h-64 bg-white/5 relative">
        <div className="absolute top-4 right-4 h-6 w-20 bg-white/10 rounded-full" />
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-white/10 rounded-md" />
            <div className="h-4 w-24 bg-white/5 rounded-md" />
          </div>
          <div className="h-6 w-14 bg-white/10 rounded-full" />
        </div>
        <div className="h-4 w-full bg-white/5 rounded" />
        <div className="h-4 w-4/5 bg-white/5 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 bg-white/5 rounded-full" />
          <div className="h-6 w-20 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  actionText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Destinations Found',
  message = 'We could not find any destinations matching your current filters or search criteria.',
  onReset,
  actionText = 'Clear All Filters'
}) => {
  return (
    <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto my-12 border border-white/10">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-champagne/10 border border-champagne/20 flex items-center justify-center text-champagne">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>
      <h3 className="font-serif text-2xl text-sand-100 mb-3 tracking-wide">{title}</h3>
      <p className="text-sand-400 text-sm leading-relaxed mb-6">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-champagne hover:text-black transition-all duration-200 text-sm font-medium tracking-wide"
        >
          <RefreshCw className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went astray',
  message,
  onRetry
}) => {
  return (
    <div className="glass-card rounded-2xl p-8 text-center max-w-md mx-auto my-8 border border-red-500/20 bg-red-950/10">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="font-serif text-xl text-red-200 mb-2">{title}</h4>
      <p className="text-red-300/80 text-sm mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs uppercase tracking-wider font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
