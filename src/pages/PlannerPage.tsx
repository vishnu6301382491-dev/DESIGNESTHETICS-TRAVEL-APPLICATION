import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Copy,
  Printer,
  ChevronDown,
  Check,
  Luggage,
  RefreshCw,
  Compass,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Destination, Itinerary, ItineraryDay, ItineraryActivity } from '../types/travel';
import { generateStructuredItinerary, ItineraryRequest } from '../services/geminiService';

export const PlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const destQuery = searchParams.get('dest');

  const initialDest =
    DESTINATIONS_DATA.find((d) => d.id.toLowerCase() === destQuery?.toLowerCase()) ||
    DESTINATIONS_DATA[0];

  const [selectedDestId, setSelectedDestId] = useState<string>(initialDest.id);
  const [daysCount, setDaysCount] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<ItineraryRequest['travelStyle']>('Curated Luxury');
  const [pace, setPace] = useState<ItineraryRequest['pace']>('Balanced');
  const [companion, setCompanion] = useState<ItineraryRequest['companion']>('Couple');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Culinary Traditions',
    'Historic Architecture',
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDayTab, setSelectedDayTab] = useState<number>(1);
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const currentDestination =
    DESTINATIONS_DATA.find((d) => d.id === selectedDestId) || DESTINATIONS_DATA[0];

  const interestOptions = [
    'Culinary Traditions',
    'Historic Architecture',
    'Nature & Landscapes',
    'Sacred Shrines & Sanctuaries',
    'Contemporary Art & Design',
    'Hidden Scenic Viewpoints',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateStructuredItinerary({
        destination: currentDestination,
        days: daysCount,
        travelStyle,
        pace,
        companion,
      });
      setItinerary(result);
      setSelectedDayTab(1);
      setCompletedActivities({});
    } catch (err) {
      console.error('Itinerary generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleActivityComplete = (actId: string) => {
    const nextState = !completedActivities[actId];
    setCompletedActivities((prev) => ({ ...prev, [actId]: nextState }));

    if (nextState) {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#EAE2D8', '#38BDF8'],
      });
    }
  };

  const handleCopyMarkdown = () => {
    if (!itinerary) return;

    let md = `# ${itinerary.title}\n\n`;
    md += `**Destination**: ${itinerary.destinationName}, ${itinerary.country}\n`;
    md += `**Duration**: ${itinerary.totalDays} Days | **Style**: ${itinerary.travelStyle} | **Pace**: ${itinerary.pace}\n\n`;
    md += `## Summary\n${itinerary.summary}\n\n`;

    itinerary.days.forEach((day) => {
      md += `### Day ${day.dayNumber}: ${day.title}\n*Theme: ${day.theme}*\n*Insider Tip: ${day.dailyTip}*\n\n`;
      md += `- **Morning (${day.morning.timeSlot})**: ${day.morning.title} @ ${day.morning.location}\n  ${day.morning.description}\n  *Tip: ${day.morning.insiderTip}*\n\n`;
      md += `- **Afternoon (${day.afternoon.timeSlot})**: ${day.afternoon.title} @ ${day.afternoon.location}\n  ${day.afternoon.description}\n  *Tip: ${day.afternoon.insiderTip}*\n\n`;
      md += `- **Evening (${day.evening.timeSlot})**: ${day.evening.title} @ ${day.evening.location}\n  ${day.evening.description}\n  *Tip: ${day.evening.insiderTip}*\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2500);
  };

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/10 no-print">
        <div>
          <div className="flex items-center gap-2 text-champagne text-xs font-mono tracking-widest uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Itinerary Architect</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-sand-50 font-normal">
            Design a Bespoke Journey<span className="text-champagne font-serif">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-sand-400 font-light mt-1.5 max-w-xl">
            Configure destination, pace, and interests. Generates a structured day-by-day plan with morning, afternoon, and evening blocks.
          </p>
        </div>

        {itinerary && (
          <button
            onClick={() => setItinerary(null)}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-champagne" />
            <span>Adjust Parameters</span>
          </button>
        )}
      </div>

      {/* Main Content: Form or Generated Day-by-Day Schedule */}
      {!itinerary ? (
        /* CUSTOMIZATION FORM */
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 shadow-luxury max-w-3xl mx-auto">
          {/* Destination Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
              1. Choose Destination:
            </label>
            <div className="relative">
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/15 text-sand-100 text-sm focus:outline-none focus:border-champagne/50 cursor-pointer appearance-none tracking-wide"
              >
                {DESTINATIONS_DATA.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#111720] text-sand-100">
                    {d.name}, {d.country} ({d.continent})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-sand-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono uppercase tracking-wider text-sand-300">
                2. Duration:{' '}
                <strong className="text-champagne font-bold">{daysCount} Days</strong>
              </span>
              <span className="text-sand-500 font-mono">1 to 7 Days</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDaysCount(num)}
                  className={`py-3 rounded-xl text-xs font-mono font-medium transition-all ${
                    daysCount === num
                      ? 'bg-champagne text-black font-bold shadow-glow-gold'
                      : 'bg-white/5 hover:bg-white/10 text-sand-300 border border-white/10'
                  }`}
                >
                  {num} {num === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Aesthetic & Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
              3. Travel Aesthetic & Style:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  'Curated Luxury',
                  'Cultural Immersion',
                  'Slow & Relaxed',
                  'Active Adventure',
                  'Culinary Journey',
                ] as const
              ).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`p-3.5 rounded-xl text-xs text-left transition-all border ${
                    travelStyle === style
                      ? 'bg-champagne/15 border-champagne text-champagne font-medium'
                      : 'bg-white/5 hover:bg-white/10 text-sand-300 border-white/10'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Rhythm Pace & Travel Party */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
                4. Daily Pace:
              </label>
              <div className="flex gap-2">
                {(['Leisurely', 'Balanced', 'High Energy'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`flex-1 py-2.5 rounded-xl text-xs transition-all border ${
                      pace === p
                        ? 'bg-champagne/15 border-champagne text-champagne font-medium'
                        : 'bg-white/5 hover:bg-white/10 text-sand-300 border-white/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
                5. Travel Party:
              </label>
              <div className="flex gap-2">
                {(['Solo', 'Couple', 'Family', 'Small Group'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCompanion(c)}
                    className={`flex-1 py-2.5 rounded-xl text-xs transition-all border ${
                      companion === c
                        ? 'bg-champagne/15 border-champagne text-champagne font-medium'
                        : 'bg-white/5 hover:bg-white/10 text-sand-300 border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Specific Interests */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
              6. Curated Interests & Focus:
            </label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-2 rounded-xl text-xs transition-all border ${
                    selectedInterests.includes(interest)
                      ? 'bg-white/20 text-champagne border-champagne/40'
                      : 'bg-white/5 hover:bg-white/10 text-sand-400 border-white/5'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Generate CTA Button */}
          <div className="pt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 rounded-2xl bg-champagne hover:bg-champagne-light text-black font-semibold text-xs uppercase tracking-widest transition-all shadow-glow-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? `Synthesizing ${daysCount}-Day Itinerary with Gemini...`
                  : `Generate Structured Day-by-Day Plan (${currentDestination.name})`}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* STRUCTURED DAY-BY-DAY ITINERARY PRESENTATION (NOT A BLOCK OF CHAT TEXT) */
        <div className="space-y-8 animate-fadeIn">
          {/* Top Itinerary Banner */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-luxury flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-champagne uppercase tracking-widest mb-1.5">
                <span>{itinerary.destinationName}, {itinerary.country}</span>
                <span>·</span>
                <span>{itinerary.totalDays} Days ({itinerary.travelStyle})</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl text-sand-50 font-normal">
                {itinerary.title}
              </h2>
              <p className="text-xs sm:text-sm text-sand-300 font-light mt-2 max-w-2xl leading-relaxed">
                {itinerary.summary}
              </p>
            </div>

            {/* Print & Copy Markdown Controls */}
            <div className="flex items-center gap-2.5 shrink-0 no-print">
              <button
                onClick={handleCopyMarkdown}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 flex items-center gap-2 transition-all"
                title="Copy Markdown to Clipboard"
              >
                {copiedMarkdown ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-champagne" />
                )}
                <span>{copiedMarkdown ? 'Copied' : 'Copy MD'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 flex items-center gap-2 transition-all"
                title="Print clean travel itinerary"
              >
                <Printer className="w-3.5 h-3.5 text-champagne" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={() => setItinerary(null)}
                className="px-4 py-2.5 rounded-xl bg-champagne/10 hover:bg-champagne/20 border border-champagne/30 text-xs text-champagne flex items-center gap-2 transition-all font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Edit Plan</span>
              </button>
            </div>
          </div>

          {/* Packing Advice Strip */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 bg-white/5 flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-champagne font-mono uppercase tracking-widest shrink-0">
              <Luggage className="w-4 h-4" />
              <span>Curator Packing Notes:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sand-300">
              {itinerary.packingRecommendations.map((tip, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md bg-black/40 border border-white/10"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>

          {/* Day Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar no-print">
            {itinerary.days.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayTab(day.dayNumber)}
                className={`px-6 py-3 rounded-xl text-xs font-medium tracking-wide uppercase transition-all shrink-0 ${
                  selectedDayTab === day.dayNumber
                    ? 'bg-champagne text-black font-bold shadow-glow-gold'
                    : 'bg-white/5 hover:bg-white/10 text-sand-300 border border-white/10'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Rendered Selected Day Schedule */}
          <div className="space-y-6">
            {itinerary.days
              .filter((day) => day.dayNumber === selectedDayTab)
              .map((day: ItineraryDay) => (
                <div key={day.dayNumber} className="space-y-6">
                  {/* Day Header */}
                  <div className="p-6 rounded-3xl bg-[#131920] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glass">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-widest text-champagne">
                        Day {day.dayNumber} · {day.theme}
                      </div>
                      <h3 className="font-serif text-3xl text-sand-50 font-normal mt-1">
                        {day.title}
                      </h3>
                    </div>
                    <div className="text-xs text-sand-300 bg-white/5 p-3.5 rounded-xl border border-white/5 max-w-md">
                      <span className="text-champagne font-mono font-bold block text-[10px] uppercase mb-0.5">
                        Day Recommendation:
                      </span>
                      {day.dailyTip}
                    </div>
                  </div>

                  {/* 3 Structured Time Slots: Morning, Afternoon, Evening */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Morning Block */}
                    <ActivityBlock
                      slotName="Morning"
                      timeSlot={day.morning.timeSlot}
                      activity={day.morning}
                      isCompleted={!!completedActivities[day.morning.id]}
                      onToggleComplete={() => toggleActivityComplete(day.morning.id)}
                    />

                    {/* Afternoon Block */}
                    <ActivityBlock
                      slotName="Afternoon"
                      timeSlot={day.afternoon.timeSlot}
                      activity={day.afternoon}
                      isCompleted={!!completedActivities[day.afternoon.id]}
                      onToggleComplete={() => toggleActivityComplete(day.afternoon.id)}
                    />

                    {/* Evening Block */}
                    <ActivityBlock
                      slotName="Evening"
                      timeSlot={day.evening.timeSlot}
                      activity={day.evening}
                      isCompleted={!!completedActivities[day.evening.id]}
                      onToggleComplete={() => toggleActivityComplete(day.evening.id)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ActivityBlockProps {
  slotName: string;
  timeSlot: string;
  activity: ItineraryActivity;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({
  slotName,
  timeSlot,
  activity,
  isCompleted,
  onToggleComplete,
}) => {
  return (
    <div
      className={`glass-card rounded-3xl p-6 border flex flex-col justify-between transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
          : 'border-white/10 hover:border-champagne/30 shadow-luxury'
      }`}
    >
      <div className="space-y-3.5">
        {/* Header slot */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-champagne">
            {slotName}
          </span>
          <span className="text-[11px] font-mono text-sand-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-sand-500" />
            {timeSlot}
          </span>
        </div>

        {/* Title & Location */}
        <div>
          <h4
            className={`font-serif text-xl leading-snug font-normal ${
              isCompleted ? 'line-through text-sand-400' : 'text-sand-100'
            }`}
          >
            {activity.title}
          </h4>
          <p className="text-xs text-sand-400 font-mono flex items-center gap-1 mt-1.5">
            <MapPin className="w-3 h-3 text-champagne" />
            {activity.location}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-sand-300 leading-relaxed font-light">
          {activity.description}
        </p>

        {/* Insider Tip Box */}
        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 text-xs text-sand-300">
          <span className="text-champagne font-mono block text-[10px] uppercase tracking-wider mb-0.5">
            Insider Tip:
          </span>
          {activity.insiderTip}
        </div>
      </div>

      {/* Footer & Interactive Checkbox */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-sand-500">
          Cost: <strong className="text-sand-300">{activity.costEstimate}</strong>
        </span>

        <button
          type="button"
          onClick={onToggleComplete}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/5 hover:bg-white/10 text-sand-400 hover:text-sand-100 border border-white/10'
          }`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-sand-400" />
          )}
          <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
        </button>
      </div>
    </div>
  );
};
