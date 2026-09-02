import React, { useState } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Download,
  Copy,
  Printer,
  Compass,
  ArrowRight,
  Luggage,
  ShieldAlert,
  ChevronDown,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Destination, Itinerary, ItineraryDay, ItineraryActivity } from '../../types/travel';
import { generateStructuredItinerary, ItineraryRequest } from '../../services/geminiService';

interface ItineraryPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  initialDestination?: Destination | null;
}

export const ItineraryPlannerModal: React.FC<ItineraryPlannerModalProps> = ({
  isOpen,
  onClose,
  destinations,
  initialDestination,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(
    initialDestination?.id || destinations[0]?.id || 'kyoto'
  );
  const [daysCount, setDaysCount] = useState<number>(3);
  const [travelStyle, setTravelStyle] = useState<ItineraryRequest['travelStyle']>('Curated Luxury');
  const [pace, setPace] = useState<ItineraryRequest['pace']>('Balanced');
  const [companion, setCompanion] = useState<ItineraryRequest['companion']>('Couple');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDayTab, setSelectedDayTab] = useState<number>(1);
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});
  const [copiedMarkdown, setCopiedMarkdown] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentDestination = destinations.find((d) => d.id === selectedDestId) || destinations[0];

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
      // Trigger subtle celebratory confetti
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div
        className="w-full max-w-5xl bg-[#0D1117] rounded-3xl border border-white/15 overflow-hidden shadow-luxury relative my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111720] no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne shadow-glow-gold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl text-sand-50 font-normal">
                  Day-by-Day Itinerary Architect
                </h3>
                <span className="text-[10px] font-mono text-champagne bg-champagne/10 px-2 py-0.5 rounded-full border border-champagne/20 uppercase tracking-wider">
                  AI Generated
                </span>
              </div>
              <p className="text-xs text-sand-400">
                Rendered as a structured schedule: morning, afternoon, and evening blocks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close itinerary planner"
            className="p-2.5 rounded-full hover:bg-white/10 text-sand-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Modes (Form or Generated Day-by-Day Schedule) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {!itinerary ? (
            /* CONFIGURATION FORM */
            <div className="max-w-2xl mx-auto space-y-8 py-4">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-champagne">
                  Step 1 of 2 · Journey Parameters
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
                  Design Your Bespoke Voyage
                </h2>
                <p className="text-xs sm:text-sm text-sand-400 font-light">
                  Tailor the destination, duration, rhythm, and travel aesthetic for our AI planner.
                </p>
              </div>

              {/* Destination Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
                  Select Destination:
                </label>
                <div className="relative">
                  <select
                    value={selectedDestId}
                    onChange={(e) => setSelectedDestId(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white/5 border border-white/15 text-sand-100 text-sm focus:outline-none focus:border-champagne/50 cursor-pointer appearance-none tracking-wide"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#111720] text-sand-100">
                        {d.name}, {d.country} ({d.continent})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-sand-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Duration Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono uppercase tracking-wider text-sand-300">
                    Duration: <strong className="text-champagne font-bold">{daysCount} Days</strong>
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

              {/* Travel Style */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
                  Travel Aesthetic & Style:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                      className={`p-3 rounded-xl text-xs text-left transition-all border ${
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

              {/* Rhythm & Pace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
                    Daily Pace:
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

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-sand-300 block">
                    Travel Party:
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
            /* STRUCTURED DAY-BY-DAY ITINERARY DISPLAY */
            <div className="space-y-8 animate-fadeIn">
              {/* Top Banner & Export Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-champagne uppercase tracking-widest mb-1">
                    <span>{itinerary.destinationName}, {itinerary.country}</span>
                    <span>·</span>
                    <span>{itinerary.totalDays} Days ({itinerary.travelStyle})</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-sand-50 font-normal">
                    {itinerary.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-sand-300 font-light mt-1.5 max-w-2xl leading-relaxed">
                    {itinerary.summary}
                  </p>
                </div>

                {/* Print & Copy Markdown Controls */}
                <div className="flex items-center gap-2.5 shrink-0 no-print">
                  <button
                    onClick={handleCopyMarkdown}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 flex items-center gap-1.5 transition-all"
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
                    onClick={handlePrint}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-sand-200 flex items-center gap-1.5 transition-all"
                    title="Print clean travel itinerary"
                  >
                    <Printer className="w-3.5 h-3.5 text-champagne" />
                    <span>Print PDF</span>
                  </button>

                  <button
                    onClick={() => setItinerary(null)}
                    className="px-3.5 py-2 rounded-xl bg-champagne/10 hover:bg-champagne/20 border border-champagne/30 text-xs text-champagne flex items-center gap-1.5 transition-all font-medium"
                  >
                    <span>Edit Plan</span>
                  </button>
                </div>
              </div>

              {/* Wardrobe & Packing Highlights */}
              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 bg-white/5 flex flex-col sm:flex-row sm:items-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-champagne font-mono uppercase tracking-widest shrink-0">
                  <Luggage className="w-4 h-4" />
                  <span>Curator Packing Notes:</span>
                </div>
                <div className="flex flex-wrap gap-2 text-sand-300">
                  {itinerary.packingRecommendations.map((tip, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10"
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
                    className={`px-5 py-2.5 rounded-xl text-xs font-medium tracking-wide uppercase transition-all shrink-0 ${
                      selectedDayTab === day.dayNumber
                        ? 'bg-champagne text-black font-bold shadow-glow-gold'
                        : 'bg-white/5 hover:bg-white/10 text-sand-300 border border-white/10'
                    }`}
                  >
                    Day {day.dayNumber}
                  </button>
                ))}
              </div>

              {/* Selected Day View (or all days when printing) */}
              <div className="space-y-6">
                {itinerary.days
                  .filter((day) => day.dayNumber === selectedDayTab)
                  .map((day: ItineraryDay) => (
                    <div key={day.dayNumber} className="space-y-6">
                      {/* Day Header */}
                      <div className="p-5 rounded-2xl bg-[#131920] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-widest text-champagne">
                            Day {day.dayNumber} · {day.theme}
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl text-sand-50 font-normal mt-1">
                            {day.title}
                          </h3>
                        </div>
                        <div className="text-xs text-sand-300 bg-white/5 p-3 rounded-xl border border-white/5 max-w-sm">
                          <span className="text-champagne font-mono font-bold block text-[10px] uppercase">
                            Day Tip:
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
      </div>
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
      className={`glass-card rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
        isCompleted
          ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
          : 'border-white/10 hover:border-champagne/30'
      }`}
    >
      <div className="space-y-3">
        {/* Header slot */}
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-champagne">
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
            className={`font-serif text-lg leading-snug font-normal ${
              isCompleted ? 'line-through text-sand-400' : 'text-sand-100'
            }`}
          >
            {activity.title}
          </h4>
          <p className="text-[11px] text-sand-400 font-mono flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-champagne" />
            {activity.location}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-sand-300 leading-relaxed font-light">
          {activity.description}
        </p>

        {/* Insider Tip Box */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-[11px] text-sand-300">
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
