import { Destination, Itinerary, ItineraryDay } from '../types/travel';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export interface ItineraryRequest {
  destination: Destination;
  days: number;
  travelStyle: 'Curated Luxury' | 'Cultural Immersion' | 'Slow & Relaxed' | 'Active Adventure' | 'Culinary Journey';
  pace: 'Leisurely' | 'Balanced' | 'High Energy';
  companion: 'Solo' | 'Couple' | 'Family' | 'Small Group';
}

const SYSTEM_CONCIERGE_PROMPT = `You are the lead travel curator and AI concierge at "designesthetics." — a world-renowned luxury travel publication and atelier.
Your aesthetic is refined, poetic yet precise, culturally literate, and understated.
You specialize in recommending authentic hidden gems, culinary traditions, optimal arrival hours to avoid crowds, architecture, and mindful packing.
Keep responses engaging, visually structured with clean bullet points where appropriate, and elegant.`;

/**
 * Chat with Gemini Travel Concierge
 */
export async function sendChatMessage(
  message: string,
  destinationContext?: Destination,
  chatHistory: { role: 'user' | 'model'; text: string }[] = []
): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_KEY') {
    return generateFallbackChatResponse(message, destinationContext);
  }

  try {
    const contextPrompt = destinationContext
      ? `CURRENT DESTINATION CONTEXT: The user is currently exploring ${destinationContext.name}, ${destinationContext.country}.
Tagline: "${destinationContext.tagline}".
Known places: ${destinationContext.famousPlaces.map(p => p.name).join(', ')}.
Local delicacies: ${destinationContext.localDelicacies.join(', ')}.
Best season: ${destinationContext.bestSeason}.`
      : 'The user is exploring the global destination collection.';

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_CONCIERGE_PROMPT}\n\n${contextPrompt}` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am your designesthetics concierge. How may I elevate your travel voyage today?' }]
      },
      ...chatHistory.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    }
  } catch (err) {
    console.warn('Gemini chat error, falling back to local assistant:', err);
  }

  return generateFallbackChatResponse(message, destinationContext);
}

/**
 * Generate Structured Day-by-Day Itinerary via Gemini
 */
export async function generateStructuredItinerary(req: ItineraryRequest): Promise<Itinerary> {
  const { destination, days, travelStyle, pace, companion } = req;

  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_KEY') {
    try {
      const prompt = `Create a bespoke, structured ${days}-day travel itinerary for ${destination.name}, ${destination.country}.
Travel Style: ${travelStyle}
Pace: ${pace}
Traveling as: ${companion}
Key places in destination: ${destination.famousPlaces.map(p => p.name).join(', ')}.
Cultural tips: ${destination.culturalTips.join('; ')}.

You MUST return strictly valid JSON with no markdown backticks, matching this exact JSON schema:
{
  "title": "Poetic, evocative title for this journey",
  "summary": "2-3 sentence editorial summary of what this voyage entails",
  "estimatedBudget": "$ / $$ / $$$ / $$$$ and currency range",
  "packingRecommendations": ["3 to 4 specific wardrobe and gear items"],
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "theme": "Core theme of the day",
      "dailyTip": "One insider tip for the day",
      "morning": {
        "title": "Activity Name",
        "location": "Specific place name",
        "timeSlot": "09:00 - 12:00",
        "duration": "3 Hours",
        "costEstimate": "Cost or Free",
        "description": "Engaging description of morning activity",
        "insiderTip": "Specific insider recommendation"
      },
      "afternoon": {
        "title": "Activity Name",
        "location": "Specific place name",
        "timeSlot": "13:30 - 17:00",
        "duration": "3.5 Hours",
        "costEstimate": "Cost or Free",
        "description": "Engaging description of afternoon activity",
        "insiderTip": "Specific insider recommendation"
      },
      "evening": {
        "title": "Activity Name",
        "location": "Specific place name",
        "timeSlot": "18:30 - 22:00",
        "duration": "3.5 Hours",
        "costEstimate": "Cost or Free",
        "description": "Engaging description of evening activity",
        "insiderTip": "Specific insider recommendation"
      }
    }
  ]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.5,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const cleaned = jsonText.replace(/^```json/i, '').replace(/```$/, '').trim();
          const parsed = JSON.parse(cleaned);

          return {
            id: `itin-${Date.now()}`,
            destinationId: destination.id,
            destinationName: destination.name,
            country: destination.country,
            title: parsed.title || `${days} Days of ${travelStyle} in ${destination.name}`,
            summary: parsed.summary || `A bespoke ${days}-day editorial journey through ${destination.name}.`,
            totalDays: days,
            travelStyle,
            pace,
            estimatedBudget: parsed.estimatedBudget || `${destination.budgetLevel} Level`,
            days: parsed.days || [],
            packingRecommendations: parsed.packingRecommendations || [
              'Comfortable walking shoes',
              'Layered outerwear',
              'Daypack with water bottle'
            ],
            createdAt: new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn('Gemini structured itinerary parsing error, falling back to synthesis engine:', err);
    }
  }

  // Fallback high-fidelity itinerary synthesis
  return generateLocalItinerarySynthesis(req);
}

/**
 * Intelligent Local Fallback Chat Concierge
 */
function generateFallbackChatResponse(query: string, dest?: Destination): string {
  const q = query.toLowerCase();

  if (dest) {
    if (q.includes('how long') || q.includes('days') || q.includes('duration')) {
      return `For **${dest.name}**, we recommend an ideal duration of **${dest.idealDuration}**. This provides ample time to experience its iconic highlights—such as ${dest.famousPlaces.slice(0, 2).map(p => p.name).join(' and ')}—while retaining leisure time to immerse yourself in local culture and culinary traditions without rushing.`;
    }

    if (q.includes('when to go') || q.includes('best time') || q.includes('season')) {
      return `The quintessential season to visit **${dest.name}** is **${dest.bestSeason}**. During this window, meteorological conditions are optimal for outdoor wanderings, and the natural landscape reveals its most evocative character.`;
    }

    if (q.includes('what to see') || q.includes('places') || q.includes('famous') || q.includes('sights')) {
      const placesList = dest.famousPlaces
        .map(p => `• **${p.name}** (${p.category}): ${p.description}\n  *Insider Tip:* ${p.insiderTip}`)
        .join('\n\n');
      return `Here are the essential, curator-selected places to experience in **${dest.name}**:\n\n${placesList}\n\nYou can also click **"Plan Itinerary"** above to have our AI generate an organized day-by-day journey for you!`;
    }

    if (q.includes('eat') || q.includes('food') || q.includes('cuisine') || q.includes('restaurant')) {
      return `In **${dest.name}**, culinary heritage is an art form. Do not leave without savoring:\n\n${dest.localDelicacies.map(d => `• **${d}**`).join('\n')}\n\n*Curator Note:* ${dest.curatorNote}`;
    }

    if (q.includes('pack') || q.includes('wear') || q.includes('clothing')) {
      return `For your voyage to **${dest.name}**, prioritize elegance and function:\n\n• High-traction footwear for cobblestones and natural trails\n• Breathable, tailored layers\n• Modest attire respecting local cultural customs (${dest.culturalTips[0]})\n• Check our live weather badge on the page for real-time packing tips!`;
    }

    return `Welcome to **${dest.name}**, ${dest.country}. ${dest.tagline}\n\n${dest.description}\n\nYou can ask me about the best time to visit, recommended duration, what to eat, or click **"Plan Itinerary"** to generate a bespoke day-by-day itinerary for your stay.`;
  }

  // Global query fallback
  if (q.includes('recommend') || q.includes('where') || q.includes('best')) {
    return `Looking for inspiration? Here are three distinct travel moods we love right now:\n\n• **For Zen & Heritage**: *Kyoto, Japan* — Imperial gardens, golden pavilions, and tranquil teahouses.\n• **For Coastal Elegance**: *Amalfi Coast, Italy* — Pastel villages clinging to cobalt sea cliffs.\n• **For Wild Adventure**: *Reykjavík & South Coast, Iceland* — Glaciers, black sand beaches, and geothermal lagoons.\n\nWhich landscape calls to you?`;
  }

  return `Greetings from the **designesthetics** AI Concierge. I am at your service to craft refined itineraries, unpack cultural customs, explore live weather conditions, and recommend hidden gems across our global portfolio. Where are you dreaming of going?`;
}

/**
 * Intelligent Local Itinerary Synthesis Engine
 * Guarantees a rich, realistic, structured day-by-day plan even without an external API key.
 */
function generateLocalItinerarySynthesis(req: ItineraryRequest): Itinerary {
  const { destination, days, travelStyle, pace } = req;
  const places = destination.famousPlaces;

  const itineraryDays: ItineraryDay[] = [];

  for (let i = 1; i <= days; i++) {
    const p1 = places[(i - 1) % places.length];
    const p2 = places[i % places.length];
    const delicacy = destination.localDelicacies[(i - 1) % destination.localDelicacies.length];

    let dayTitle = `Day ${i}: Arrival & Architectural Discovery`;
    let theme = 'Arrival, Orientation & Architectural Wonders';

    if (i === 2) {
      dayTitle = `Day 2: Nature & Sacred Horizons`;
      theme = 'Immersion in Serene Natural Landscapes';
    } else if (i === 3) {
      dayTitle = `Day 3: Gastronomy & Living Heritage`;
      theme = 'Artisanal Markets, Local Flavors & Craft';
    } else if (i === 4) {
      dayTitle = `Day 4: Panoramic Vistas & Quiet Coves`;
      theme = 'Off-the-Beaten-Path Exploration';
    } else if (i >= 5) {
      dayTitle = `Day ${i}: Hidden Sanctuaries & Sunset Reflections`;
      theme = 'Slow Travel & Mindful Indulgence';
    }

    itineraryDays.push({
      dayNumber: i,
      title: dayTitle,
      theme,
      dailyTip: `Start early around ${p1.bestTimeToVisit.split(' ')[0] || '08:00'} to enjoy ${p1.name} in its most peaceful atmosphere.`,
      morning: {
        id: `act-${i}-m`,
        title: `Morning Exploration at ${p1.name}`,
        location: p1.name,
        timeSlot: '08:30 – 11:30',
        duration: p1.timeRequired,
        costEstimate: p1.admissionFee,
        description: p1.description,
        insiderTip: p1.insiderTip,
        completed: false
      },
      afternoon: {
        id: `act-${i}-a`,
        title: `Artisanal Tasting: Savoring ${delicacy}`,
        location: `Historic Quarter & Promenade`,
        timeSlot: '12:30 – 15:30',
        duration: '3 Hours',
        costEstimate: `${destination.budgetLevel} Tier ($30–$75)`,
        description: `Indulge in a curated midday lunch highlighting authentic local flavors. Relax over ${delicacy} paired with regional beverages in a sunlit courtyard or traditional dining room.`,
        insiderTip: destination.culturalTips[0] || 'Ask your server for the day\'s seasonal catch or harvest recommendation.',
        completed: false
      },
      evening: {
        id: `act-${i}-e`,
        title: `Golden Hour Walk & Dinner near ${p2.name}`,
        location: p2.name,
        timeSlot: '17:00 – 21:00',
        duration: '4 Hours',
        costEstimate: p2.admissionFee,
        description: `Conclude the day watching the golden hour bathe ${p2.name}. Followed by a slow-paced dinner at a family-run heritage restaurant.`,
        insiderTip: p2.insiderTip,
        completed: false
      }
    });
  }

  return {
    id: `itin-${Date.now()}`,
    destinationId: destination.id,
    destinationName: destination.name,
    country: destination.country,
    title: `${days}-Day ${travelStyle} Voyage through ${destination.name}`,
    summary: `A carefully paced, design-centric journey across ${destination.name}. Balances celebrated landmarks like ${places[0].name} with intimate culinary tastings and quiet evening wanderings.`,
    totalDays: days,
    travelStyle,
    pace,
    estimatedBudget: `${destination.budgetLevel} Luxury Range`,
    days: itineraryDays,
    packingRecommendations: [
      'Tailored walking shoes for cobblestones & natural trails',
      'Breathable lightweight layers & evening jacket',
      'Compact polarized camera or smartphone with wide-angle lens',
      'Refillable thermal flask & mineral sunscreen'
    ],
    createdAt: new Date().toISOString()
  };
}
