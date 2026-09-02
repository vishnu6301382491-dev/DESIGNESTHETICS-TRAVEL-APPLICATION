import React, { useState, useEffect } from 'react';
import { Heart, Sun, Cloud, CloudRain, Snowflake, CloudLightning, MapPin, Star, ArrowUpRight } from 'lucide-react';
import { Destination, WeatherData, UserLocation, TemperatureUnit } from '../../types/travel';
import { fetchLiveWeather, convertTemp } from '../../services/weatherService';
import { fetchDynamicImage } from '../../services/imageService';
import { calculateDistanceKm, formatDistance } from '../../services/locationService';

interface DestinationCardProps {
  destination: Destination;
  userLocation: UserLocation | null;
  tempUnit: TemperatureUnit;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onSelect: (dest: Destination) => void;
  onPlanTrip: (dest: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  userLocation,
  tempUnit,
  isSaved,
  onToggleSave,
  onSelect,
  onPlanTrip,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(destination.backupHeroImage);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Dynamically fetch high-res image
    fetchDynamicImage(destination.heroImageQuery, destination.backupHeroImage).then((url) => {
      if (isMounted) setImageUrl(url);
    });

    // Fetch live weather
    fetchLiveWeather(
      destination.coordinates.lat,
      destination.coordinates.lng,
      destination.name
    ).then((w) => {
      if (isMounted) setWeather(w);
    });

    return () => {
      isMounted = false;
    };
  }, [destination]);

  // Calculate distance if user location is available
  const distanceKm = userLocation
    ? calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        destination.coordinates.lat,
        destination.coordinates.lng
      )
    : null;

  const renderWeatherIcon = (iconName?: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-3.5 h-3.5 text-amber-300" />;
      case 'cloud-sun':
      case 'cloud':
        return <Cloud className="w-3.5 h-3.5 text-sky-200" />;
      case 'cloud-rain':
      case 'cloud-drizzle':
        return <CloudRain className="w-3.5 h-3.5 text-blue-300" />;
      case 'snowflake':
        return <Snowflake className="w-3.5 h-3.5 text-cyan-200" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-3.5 h-3.5 text-yellow-300" />;
      default:
        return <Sun className="w-3.5 h-3.5 text-amber-300" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(destination)}
      className="group glass-card rounded-3xl overflow-hidden border border-white/10 hover:border-champagne/40 transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5 shadow-luxury"
    >
      {/* Image Container with Editorial Zoom */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-white/5">
        {/* Shimmer loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
            <span className="text-xs text-sand-500 font-mono">Curating visuals...</span>
          </div>
        )}

        <img
          src={imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Ambient Dark Gradient for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D10] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          {/* Live Weather Pill */}
          {weather ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs text-sand-100 font-medium">
              {renderWeatherIcon(weather.icon)}
              <span>
                {convertTemp(weather.temp, tempUnit)}°{tempUnit}
              </span>
              <span className="text-[10px] text-sand-400 font-light hidden sm:inline">
                · {weather.condition}
              </span>
            </div>
          ) : (
            <div className="h-7 w-20 rounded-full bg-black/40 backdrop-blur-md animate-pulse" />
          )}

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(destination.id);
            }}
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-200 ${
              isSaved
                ? 'bg-champagne border-champagne text-black shadow-glow-gold'
                : 'bg-black/50 border-white/20 text-sand-200 hover:text-champagne hover:scale-110'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
          </button>
        </div>

        {/* Distance Badge & Region at bottom of image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[11px] font-mono uppercase tracking-widest text-sand-300">
              {destination.continent}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal tracking-wide mt-1 drop-shadow-md">
              {destination.name}
            </h3>
            <p className="text-xs text-sand-300 font-light flex items-center gap-1 mt-0.5">
              <span>{destination.country}</span>
              {distanceKm !== null && (
                <>
                  <span className="text-sand-500">·</span>
                  <span className="text-champagne font-mono text-[11px] flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 inline" />
                    {formatDistance(distanceKm)} away
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span className="font-semibold">{destination.rating}</span>
          </div>
        </div>
      </div>

      {/* Editorial Content Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-sand-400 text-xs sm:text-sm line-clamp-2 leading-relaxed font-light">
          {destination.description}
        </p>

        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {destination.vibe.map((v) => (
            <span
              key={v}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-sand-300"
            >
              {v}
            </span>
          ))}
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne font-mono">
            {destination.budgetLevel}
          </span>
        </div>

        {/* Famous Places preview strip */}
        <div className="pt-2 border-t border-white/10">
          <div className="text-[10px] font-mono text-sand-500 uppercase tracking-wider mb-1.5">
            Key Places to Discover:
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden text-xs text-sand-300">
            {destination.famousPlaces.slice(0, 3).map((p, idx) => (
              <span key={p.id} className="truncate max-w-[140px]">
                {p.name}
                {idx < 2 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(destination);
            }}
            className="text-xs text-sand-200 hover:text-champagne font-medium tracking-wide flex items-center gap-1 group/link"
          >
            <span>Read Editorial Dossier</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlanTrip(destination);
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-champagne hover:text-black transition-all text-xs font-medium tracking-wider uppercase"
          >
            Plan Trip
          </button>
        </div>
      </div>
    </div>
  );
};
