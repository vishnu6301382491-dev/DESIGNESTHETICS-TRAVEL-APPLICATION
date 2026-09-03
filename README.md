# designesthetics. — Curated Global Destinations & AI Travel Atelier

> **Front-End Developer Assignment Submission**  
> An editorial-grade travel web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, powered by **Google Gemini AI**, **OpenWeather**, **Open-Meteo Telemetry**, and **Unsplash**.

### 🔗 Live Production Links
- 🌐 **Live Deployed Application**: [https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/)
- 📦 **Public GitHub Repository**: [https://github.com/vishnu6301382491-dev/DESIGNESTHETICS-TRAVEL-APPLICATION](https://github.com/vishnu6301382491-dev/DESIGNESTHETICS-TRAVEL-APPLICATION)

#### 🧭 Quick Navigation Routes:
- **Home**: [`/#/`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/)
- **Explorer**: [`/#/explore`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/explore)
- **Paris Dossier**: [`/#/destinations/paris`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/destinations/paris)
- **Tokyo Dossier**: [`/#/destinations/tokyo`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/destinations/tokyo)
- **Dubai Dossier**: [`/#/destinations/dubai`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/destinations/dubai)
- **Bali Dossier**: [`/#/destinations/bali`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/destinations/bali)
- **AI Itinerary Planner**: [`/#/planner`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/planner)
- **AI Concierge Salon**: [`/#/assistant`](https://vishnu6301382491-dev.github.io/DESIGNESTHETICS-TRAVEL-APPLICATION/#/assistant)

---

## 🌟 Overview

**designesthetics.** is a luxury travel application designed for the discerning global traveler. Guided by the principles of visual restraint, architectural typography, and purposeful motion, the application enables visitors to:
- Immerse themselves in a cinematic landing experience with a looping high-definition background video.
- Explore curated destinations across all five continents with real-time distance calculations and multi-dimensional filtering (regions, travel vibes, budgets, seasons).
- Inspect notable places and sacred wonders presented through visual cards with curator notes, arrival windows, and insider tips.
- Detect their departure coordinates automatically via the browser Geolocation API, or select from global gateways.
- Monitor live atmospheric weather telemetry (°C / °F) with real-time temperature, wind, humidity, and weather-adaptive packing advisories.
- Converse with a context-aware **Google Gemini AI Travel Concierge** tailored for editorial travel advice.
- Generate and interact with structured, **Day-by-Day travel itineraries** (rendered into morning, afternoon, and evening blocks with interactive checklists and printable PDF export).

---

## 🚀 Key Features Implemented

### 01. Landing Experience
- **Cinematic Looping Video Hero**: High-definition drone aerial footage capturing dramatic coastlines and mountain vistas with audio toggle (mute/unmute) and fallback poster image.
- **Atmospheric Vignette & Contrast**: Editorial gradient overlays with KaTeX-inspired serif typography (`Cormorant Garamond` and `Plus Jakarta Sans`).
- **Integrated Search & Region Chips**: Quick search bar directly in the hero accompanied by live metrics ticker (*12+ Curated Havens*, *Real-Time Weather Radar*, *Gemini 2.0 Assistant*, *Day-by-Day Planning*).
- **Subtle Motion Scroll Cue**: Smooth scroll indicator directing visitors to the explorer.

### 02. Destination Explorer
- **Interactive Multi-Filter Engine**:
  - **Continents**: All, Europe, Asia, Americas, Africa, Oceania.
  - **Vibe & Atmosphere**: Coastal, Alpine, Heritage, Culinary, Wellness, Adventure, Art & Culture, Nature.
  - **Budget Tiers**: $, $$, $$$, $$$$.
- **Dynamic Sorting**:
  - Curator's Choice
  - Nearest to You (calculated dynamically using the Haversine distance formula from user's coordinates)
  - Highest Rated
  - Alphabetical (A–Z)
- **Deep Editorial Dossier (Modal & Route)**: Each destination opens into a dedicated view containing high-resolution photography, cultural etiquette guides, local culinary delicacies, and curator logs.

### 03. Famous Places & Sacred Wonders
- **Rich Visual Cards**: Notable places are presented with photography, category badges (*Architecture, Nature, Historic, Sacred, Culinary, Wellness, Adventure*), admission costs, and required visit duration.
- **Curator's Insider Tips**: Distinctive insider advice for every sight (e.g. secret view spots, optimal arrival windows to avoid crowds, hidden teahouses).
- **Featured Standalone Section**: Global landmarks gallery on the home page with category filtering.

### 04. Location Awareness
- **Browser Geolocation Integration**: Requests coordinates via `navigator.geolocation` with graceful permission handling.
- **Reverse Geocoding**: Resolves coordinates to the visitor's departure city and country.
- **Real-Time Distance Radar**: Displays exact flight distances (e.g. *8,420 km away from London, UK*) on every destination card and detail view.
- **Manual Origin Fallback**: If location is denied or preferred private, visitors can search or choose from 12 global gateway cities (*London, New York, Tokyo, Paris, Dubai, Singapore, Sydney, San Francisco, Berlin, Mumbai, Toronto, São Paulo*).

### 05. Real-Time Weather & Packing Telemetry
- **Dual Meteorological Engine**:
  - **OpenWeather API**: Integrates live weather metrics via `VITE_OPENWEATHER_API_KEY`.
  - **Open-Meteo Live Fallback**: Zero-configuration, real-time public telemetry fallback that works immediately out of the box without requiring manual API keys!
- **Rich Climate Diagnostics**: Temperature, feels-like temperature, condition description, humidity, and wind speed.
- **Interactive Unit Switcher**: Instant global toggle between **Celsius (°C)** and **Fahrenheit (°F)** with persistence in `localStorage`.
- **Climate-Adaptive Wardrobe Advice**: Dynamically analyzes temperature, wind gusts, and precipitation to provide customized packing lists (e.g., thermal base layers for cold alpine climates, breathable linen and polarized eyewear for tropical sun).

### 06. Dynamic Image Sourcing
- **Dynamic Unsplash & Pexels Service**: Dynamically queries image APIs using `VITE_UNSPLASH_ACCESS_KEY` and `VITE_PEXELS_API_KEY`.
- **Progressive CDN Fallback**: High-resolution curated CDN fallbacks with blur-up shimmer skeletons to guarantee zero broken image states.

### 07. AI Travel Concierge (Google Gemini)
- **Conversational Assistant**: Context-aware AI concierge powered by **Google Gemini** (`VITE_GEMINI_API_KEY`).
- **Contextual Intelligence**: Aware of the destination currently in view, local weather, and travel culture.
- **Curated Prompt Chips**: Quick-tap chips for essential questions (*"How long to stay?", "Must-see sights", "Packing tips", "Iconic delicacies"*).
- **Graceful Fallback**: Contains an intelligent local travel synthesis engine ensuring instant, sophisticated responses even when offline or without an API key.

### 08. Structured Day-by-Day Itinerary Planner
- **Interactive Trip Customizer**: Select destination, trip duration (1 to 7 days), travel aesthetic (*Curated Luxury, Cultural Immersion, Slow & Relaxed, Active Adventure, Culinary Journey*), pace (*Leisurely, Balanced, High Energy*), and travel party (*Solo, Couple, Family, Small Group*).
- **Structured Schedule Representation**:
  - Rendered as **distinct Morning, Afternoon, and Evening activity cards** (never as a block of chat text!).
  - Each activity displays time slots, location, cost estimate, and insider advice.
- **Interactive Activity Checklist**: Check off activities with celebratory confetti milestones.
- **Export & Print Ready**:
  - One-click **Print to PDF** with bespoke print CSS hiding navigation and formatting clean editorial paper layout.
  - One-click **Copy Markdown** for travel notes apps (Notion, Obsidian, Apple Notes).

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 19, TypeScript
- **Bundler**: Vite 6 / 8
- **Styling**: Tailwind CSS 3.4 (custom luxury editorial color palette, glassmorphism, responsive grid)
- **Typography**: Cormorant Garamond (Editorial Serif), Plus Jakarta Sans (Interface Sans), JetBrains Mono
- **Motion & Icons**: Framer Motion, Lucide React, Canvas-Confetti
- **APIs**:
  - Weather: OpenWeather + Open-Meteo Live API
  - AI Assistant: Google Gemini API (gemini-1.5-flash / gemini-2.0-flash)
  - Visuals: Unsplash API + Pexels API + Coverr Video CDN
  - Geolocation: Browser Geolocation API + Nominatim Reverse Geocoding

---

## 📁 Project Structure

```
d:/DESIGNESTHETICS TRAVEL APPLICATION-2/
├── index.html                   # HTML entry with Cormorant Garamond & Plus Jakarta Sans fonts
├── package.json                 # Project dependencies and build scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Editorial design tokens, colors & shadows
├── tsconfig.json                # TypeScript project references
├── tsconfig.app.json            # TypeScript compiler configuration
├── .env.example                 # Environment variables blueprint
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root application state, layout & orchestrator
│   ├── index.css                # Base Tailwind layer, scrollbars, glass utilities & print styles
│   ├── types/
│   │   └── travel.ts            # Domain models (Destination, Weather, Itinerary, Places)
│   ├── data/
│   │   └── destinations.ts      # Curated destination & landmark catalog
│   ├── services/
│   │   ├── weatherService.ts    # OpenWeather & Open-Meteo live integration
│   │   ├── geminiService.ts     # Google Gemini chat & structured itinerary generator
│   │   ├── imageService.ts      # Dynamic Unsplash / Pexels image sourcing
│   │   └── locationService.ts   # Geolocation, Haversine distance & gateway catalog
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx       # Header with location, temp toggle, wishlist counter
│       │   └── Footer.tsx       # Editorial footer, technology credits & navigation
│       ├── hero/
│       │   └── HeroSection.tsx  # Looping background video, search & telemetry ticker
│       ├── location/
│       │   ├── LocationBanner.tsx # Awareness prompt banner
│       │   └── LocationModal.tsx  # Gateway selector & GPS detection
│       ├── explorer/
│       │   ├── DestinationExplorer.tsx # Search, region tabs, vibe filters & sort
│       │   └── DestinationCard.tsx     # Card with live weather badge & distance radar
│       ├── detail/
│       │   └── DestinationDetailModal.tsx # Full-bleed dossier with weather & places
│       ├── places/
│       │   └── FamousPlacesSection.tsx # Notable sights showcase with category filters
│       ├── ai/
│       │   └── AIChatDrawer.tsx # Gemini conversational travel concierge
│       ├── itinerary/
│       │   └── ItineraryPlannerModal.tsx # Day-by-Day schedule builder & PDF exporter
│       ├── wishlist/
│       │   └── WishlistModal.tsx # Saved destinations collection
│       └── common/
│           └── LoadingSkeleton.tsx # Shimmer skeletons, empty & error states
```

---

## ⚡ Quick Start: Running Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/designesthetics-travel-application.git
cd designesthetics-travel-application
npm install
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your API keys if you have them:
```env
# Google Gemini API key (AI Concierge & Itinerary Generator)
VITE_GEMINI_API_KEY=your_gemini_api_key

# OpenWeather API key (Optional: Open-Meteo live telemetry works automatically if omitted!)
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# Unsplash Access Key (Optional: dynamic high-res photography)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```
> **Note**: The application is designed to be 100% functional out of the box even without API keys thanks to integrated fallback telemetry engines!

### 3. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
Creates an optimized production build in the `/dist` directory.

---

## 🚢 Deployment Guide

This application is ready to deploy to **Vercel**, **Netlify**, or **GitHub Pages**:

### Deploy to Vercel:
1. Push your code to a public GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework Preset: **Vite**.
4. (Optional) Add your environment variables in the Vercel project settings:
   - `VITE_GEMINI_API_KEY`
   - `VITE_OPENWEATHER_API_KEY`
   - `VITE_UNSPLASH_ACCESS_KEY`
5. Click **Deploy**.

### Deploy to Netlify:
1. Connect the repository in Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables if desired and deploy.

---

## 🎨 Visual Design Philosophy

- **Alignment & Typography**: Strict baseline grid with `Cormorant Garamond` for expressive, editorial titles and `Plus Jakarta Sans` for functional UI data.
- **Restraint & Palette**: Ink black (`#0A0D10`), warm stone paper (`#EAE2D8`), champagne gold (`#D4AF37`), and subtle glassmorphic translucency.
- **Handling Edge Cases**: Every loading state, denied location permission, empty search result, and API hiccup has a dedicated designed state with actionable recovery.
- **Accessibility**: Keyboard navigable, high-contrast text ratios, clear focus indicators, and semantic HTML elements.
