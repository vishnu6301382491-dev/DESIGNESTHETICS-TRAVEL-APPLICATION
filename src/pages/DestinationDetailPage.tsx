import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Share2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  Check,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  ShieldCheck,
  Luggage,
  ArrowLeft,
  ArrowRight,
  Compass
} from 'lucide-react';
import { Destination, WeatherData, UserLocation, TemperatureUnit, FamousPlace } from '../types/travel';
import { DESTINATIONS_DATA } from '../data/destinations';
import { fetchLiveWeather, convertTemp } from '../services/weatherService';
import { fetchDynamicImage } from '../services/imageService';
import { calculateDistanceKm, formatDistance } from '../services/locationService';

interface DestinationDetailPageProps {
  userLocation: UserLocation | null;
  tempUnit: TemperatureUnit;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  userLocation,
  tempUnit,
  savedIds,
  onToggleSave,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const destination = DESTINATIONS_DATA.find(
    (d) => d.id.toLowerCase() === id?.toLowerCase()
  );

  const [heroImage, setHeroImage] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [placeImages, setPlaceImages] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (!destination) return;

    let isMounted = true;
    setHeroImage(destination.backupHeroImage);

    // Dynamic hero image
    fetchDynamicImage(destination.heroImageQuery, destination.backupHeroImage).then((url) => {
      if (isMounted) setHeroImage(url);
    });

    // Dynamic images for each famous place
    destination.famousPlaces.forEach((place) => {
      fetchDynamicImage(place.imageQuery, place.backupImage).then((url) => {
        if (isMounted) {
          setPlaceImages((prev) => ({ ...prev, [place.id]: url }));
        }
      });
    });

    // Real-time live weather
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

  if (!destination) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 text-center">
        <div className="glass-card p-10 rounded-3xl max-w-md border border-white/10 space-y-5">
          <Compass className="w-10 h-10 text-champagne mx-auto animate-spin-slow" />
          <h2 className="font-serif text-3xl text-sand-50">Dossier Unavailable</h2>
          <p className="text-xs text-sand-400">
            We could not find the destination dossier for "{id}".
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-champagne text-black text-xs font-semibold uppercase tracking-wider shadow-glow-gold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Explorer</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = savedIds.includes(destination.id);

  const distanceKm = userLocation
    ? calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        destination.coordinates.lat,
        destination.coordinates.lng
      )
    : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const renderWeatherIcon = (iconName?: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-5 h-5 text-amber-300" />;
      case 'cloud-sun':
      case 'cloud':
        return <Cloud className="w-5 h-5 text-sky-200" />;
      case 'cloud-rain':
      case 'cloud-drizzle':
        return <CloudRain className="w-5 h-5 text-blue-300" />;
      case 'snowflake':
        return <Snowflake className="w-5 h-5 text-cyan-200" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-5 h-5 text-yellow-300" />;
      default:
        return <Sun className="w-5 h-5 text-amber-300" />;
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 animate-fadeIn">
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sand-400 hover:text-champagne transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-sand-500 font-mono">
          <Link to="/" className="hover:text-sand-300">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-sand-300">Destinations</Link>
          <span>/</span>
          <span className="text-sand-200">{destination.name}</span>
        </div>
      </div>

      {/* Hero Banner with Full Bleed High-Res Imagery */}
      <div className="relative h-[420px] sm:h-[540px] w-full rounded-3xl overflow-hidden border border-white/15 shadow-luxury">
        <img
          src={heroImage || destination.backupHeroImage}
          alt={destination.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D10] via-[#0A0D10]/40 to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
          <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-widest text-champagne">
            {destination.continent}
          </span>
          {distanceKm !== null && (
            <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs text-sand-200 flex items-center gap-1 font-mono">
              <MapPin className="w-3 h-3 text-champagne" />
              {formatDistance(distanceKm)} from {userLocation?.city}
            </span>
          )}
        </div>

        {/* Destination Header Title */}
        <div className="absolute bottom-8 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-champagne mb-1.5">
              Curated Dossier · {destination.country}
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl text-sand-50 font-normal tracking-tight leading-none">
              {destination.name}
            </h1>
            <p className="text-sand-300 text-sm sm:text-base font-light max-w-2xl mt-3 italic font-serif">
              "{destination.tagline}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onToggleSave(destination.id)}
              className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                isSaved
                  ? 'bg-champagne border-champagne text-black shadow-glow-gold'
                  : 'bg-black/60 border-white/20 text-sand-200 hover:text-champagne hover:scale-105'
              }`}
              title={isSaved ? 'Saved to wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-sand-200 hover:text-white transition-all relative"
              title="Share link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {copiedLink && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black text-[10px] text-emerald-400 whitespace-nowrap shadow-lg">
                  Copied!
                </span>
              )}
            </button>

            <button
              onClick={() => navigate(`/planner?dest=${destination.id}`)}
              className="px-6 py-3 rounded-full bg-champagne hover:bg-champagne-light text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-glow-gold flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Plan Trip with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Facts Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-white/5 border border-white/10 text-xs shadow-glass">
        <div>
          <span className="text-sand-500 font-mono uppercase tracking-wider block">Best Season</span>
          <span className="text-sand-100 font-medium mt-1.5 block text-sm">{destination.bestSeason}</span>
        </div>
        <div>
          <span className="text-sand-500 font-mono uppercase tracking-wider block">Ideal Stay</span>
          <span className="text-sand-100 font-medium mt-1.5 block text-sm">{destination.idealDuration}</span>
        </div>
        <div>
          <span className="text-sand-500 font-mono uppercase tracking-wider block">Local Currency</span>
          <span className="text-sand-100 font-medium mt-1.5 block font-mono text-sm">{destination.currency}</span>
        </div>
        <div>
          <span className="text-sand-500 font-mono uppercase tracking-wider block">Languages</span>
          <span className="text-sand-100 font-medium mt-1.5 block text-sm">{destination.languages.join(', ')}</span>
        </div>
      </div>

      {/* REAL-TIME WEATHER RADAR & PACKING ADVICE */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-azure/5 via-transparent to-champagne/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-glass">
              {weather ? renderWeatherIcon(weather.icon) : <Sun className="w-6 h-6 text-amber-300" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-azure">
                  Atmospheric Telemetry
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {weather?.source || 'Live Feed'}
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-serif text-4xl sm:text-5xl text-sand-50 font-normal">
                  {weather ? convertTemp(weather.temp, tempUnit) : '--'}°{tempUnit}
                </span>
                <span className="text-sm text-sand-300 font-light">
                  {weather?.condition || 'Analyzing climate...'} ({weather?.description})
                </span>
              </div>
            </div>
          </div>

          {/* Weather Metrics */}
          {weather && (
            <div className="flex items-center gap-6 text-xs text-sand-300">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-azure" />
                <div>
                  <span className="text-sand-500 block text-[10px] uppercase">Humidity</span>
                  <span className="font-medium text-sand-100">{weather.humidity}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sand-400" />
                <div>
                  <span className="text-sand-500 block text-[10px] uppercase">Wind</span>
                  <span className="font-medium text-sand-100">{weather.windSpeed} km/h</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-champagne" />
                <div>
                  <span className="text-sand-500 block text-[10px] uppercase">Feels Like</span>
                  <span className="font-medium text-sand-100">
                    {convertTemp(weather.feelsLike, tempUnit)}°{tempUnit}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Smart Weather-Adaptive Packing Advice */}
        {weather && (
          <div className="mt-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sand-300 mb-3">
              <Luggage className="w-4 h-4 text-champagne" />
              <span>Climate-Adaptive Wardrobe & Gear:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {weather.packingAdvice.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-sand-200 bg-white/5 p-3 rounded-xl border border-white/5"
                >
                  <Check className="w-3.5 h-3.5 text-champagne shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editorial Story & Curator Note */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-champagne block">
            Editorial Exploration
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
            The Character of {destination.name}
          </h2>
          <p className="text-sand-300 text-sm sm:text-base leading-relaxed font-light">
            {destination.description}
          </p>
        </div>
        <div className="glass-card rounded-3xl p-6 sm:p-7 border border-champagne/20 bg-champagne/5 space-y-3 shadow-glass flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-champagne block mb-2">
              Curator's Field Note
            </span>
            <p className="text-xs sm:text-sm text-sand-200 italic leading-relaxed font-serif">
              "{destination.curatorNote}"
            </p>
          </div>
          <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-sand-400">
            Rating: {destination.rating} / 5.0 ({destination.reviewCount.toLocaleString()} reviews)
          </div>
        </div>
      </div>

      {/* FAMOUS PLACES SHOWCASE (Presented Properly, Not a Bare List!) */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-champagne block">
              Curated Landmarks & Monuments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal mt-1">
              Famous Places Worth Visiting in {destination.name}
            </h2>
          </div>
          <span className="text-xs text-sand-400 font-mono">
            {destination.famousPlaces.length} Essential Sights
          </span>
        </div>

        {/* Places Grid: Rich Cards with Photography, Category, Tips, Duration, Cost */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destination.famousPlaces.map((place: FamousPlace) => (
            <div
              key={place.id}
              className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group shadow-luxury hover:border-champagne/40 transition-all duration-300"
            >
              <div className="relative h-56 w-full overflow-hidden bg-white/5">
                <img
                  src={placeImages[place.id] || place.backupImage}
                  alt={place.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161D24] via-transparent to-black/30" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-sand-200 uppercase tracking-wider border border-white/15">
                  {place.category}
                </span>
                <span className="absolute bottom-4 right-4 text-xs font-mono text-champagne bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  {place.admissionFee}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl text-sand-100 font-normal">
                    {place.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-sand-300 leading-relaxed font-light mt-2">
                    {place.description}
                  </p>
                </div>

                {/* Insider Tip Box */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-xs text-sand-300">
                  <span className="font-semibold text-champagne block text-[11px] font-mono uppercase tracking-wider mb-1">
                    Curator's Insider Tip:
                  </span>
                  <p className="font-light italic">"{place.insiderTip}"</p>
                </div>

                {/* Meta info strip */}
                <div className="pt-3 flex items-center justify-between text-xs text-sand-400 font-mono border-t border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sand-500" />
                    {place.timeRequired}
                  </span>
                  <span>Best: {place.bestTimeToVisit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Culture & Culinary Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/10">
        {/* Cultural Etiquette */}
        <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-4 shadow-glass">
          <h3 className="font-serif text-2xl text-sand-100">Cultural Customs & Etiquette</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-sand-300">
            {destination.culturalTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-champagne font-mono font-bold">•</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Local Delicacies */}
        <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-4 shadow-glass">
          <h3 className="font-serif text-2xl text-sand-100">Iconic Gastronomy to Savor</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-sand-300">
            {destination.localDelicacies.map((food, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-champagne font-mono font-bold">•</span>
                <span className="leading-relaxed">{food}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Call to Action Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-champagne/15 via-[#161D24] to-azure/10 border border-champagne/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-luxury">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-champagne block">
            Bespoke Voyage Architecture
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal mt-1.5">
            Plan your stay in {destination.name} with AI
          </h2>
          <p className="text-xs sm:text-sm text-sand-400 mt-1 max-w-lg font-light">
            Generate an organized day-by-day itinerary with morning, afternoon, and evening blocks tailored to your style and pace.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate(`/assistant?dest=${destination.id}`)}
            className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-sand-100 text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-champagne" />
            <span>Consult Concierge</span>
          </button>
          <button
            onClick={() => navigate(`/planner?dest=${destination.id}`)}
            className="flex-1 sm:flex-none px-7 py-3 rounded-full bg-champagne hover:bg-champagne-light text-black text-xs font-semibold tracking-wider uppercase transition-all shadow-glow-gold flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Build Itinerary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
