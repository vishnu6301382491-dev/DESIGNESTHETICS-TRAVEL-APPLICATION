export type Continent = 'Europe' | 'Asia' | 'Americas' | 'Africa' | 'Oceania';

export type TravelVibe = 
  | 'Coastal' 
  | 'Alpine' 
  | 'Heritage' 
  | 'Culinary' 
  | 'Wellness' 
  | 'Urban' 
  | 'Adventure'
  | 'Art & Culture'
  | 'Nature';

export type BudgetTier = '$' | '$$' | '$$$' | '$$$$';

export interface FamousPlace {
  id: string;
  name: string;
  category: 'Architecture' | 'Nature' | 'Historic' | 'Culinary' | 'Art & Culture' | 'Sacred' | 'Wellness' | 'Adventure';
  description: string;
  insiderTip: string;
  bestTimeToVisit: string;
  timeRequired: string;
  admissionFee: string;
  imageQuery: string;
  backupImage: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: Continent;
  tagline: string;
  description: string;
  curatorNote: string;
  vibe: TravelVibe[];
  coordinates: {
    lat: number;
    lng: number;
  };
  bestSeason: string;
  idealDuration: string;
  budgetLevel: BudgetTier;
  rating: number;
  reviewCount: number;
  featured: boolean;
  heroImageQuery: string;
  backupHeroImage: string;
  famousPlaces: FamousPlace[];
  culturalTips: string[];
  localDelicacies: string[];
  languages: string[];
  currency: string;
}

export interface WeatherData {
  temp: number; // in Celsius
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number; // km/h
  uvIndex: number;
  packingAdvice: string[];
  isLive: boolean;
  source: 'OpenWeather' | 'Open-Meteo Live' | 'Telemetry Engine';
  lastUpdated: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  country: string;
  isCustom: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
  itineraryPreview?: Itinerary;
}

export interface ItineraryActivity {
  id: string;
  title: string;
  location: string;
  timeSlot: string;
  duration: string;
  costEstimate: string;
  description: string;
  insiderTip: string;
  completed?: boolean;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  theme: string;
  morning: ItineraryActivity;
  afternoon: ItineraryActivity;
  evening: ItineraryActivity;
  dailyTip: string;
}

export interface Itinerary {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  title: string;
  summary: string;
  totalDays: number;
  travelStyle: string;
  pace: string;
  estimatedBudget: string;
  days: ItineraryDay[];
  packingRecommendations: string[];
  createdAt: string;
}

export type TemperatureUnit = 'C' | 'F';
