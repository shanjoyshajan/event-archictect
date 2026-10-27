import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function withTimeout<T>(promise: Promise<T>, ms: number = 4000): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI generation timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey) });
  });

  // 1. Generate Full Event Blueprint
  app.post('/api/gemini/generate-blueprint', async (req: Request, res: Response) => {
    try {
      const {
        eventType = 'wedding',
        title,
        location,
        date,
        guestCount = 100,
        targetBudget = 25000,
        styleTheme = 'Classic Elegance',
        culturalNotes = '',
      } = req.body;

      if (!ai) {
        return res.json(generateFallbackBlueprint(req.body));
      }

      const prompt = `You are a master event producer. Create an exhaustive event blueprint for:
Type: ${eventType}, Title: ${title}, Location: ${location}, Date: ${date}, Guests: ${guestCount}, Budget: $${targetBudget}, Style: ${styleTheme}, Notes: ${culturalNotes}.
Output raw JSON with: styleTheme, description, budgetItems, milestones, dayOfSchedule, vendors, creativeIdeas.`;

      const aiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const response = await withTimeout(aiCall, 4500);
      const cleanJson = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      return res.json(JSON.parse(cleanJson));
    } catch (error) {
      console.warn('Using fallback blueprint due to:', (error as any).message);
      return res.json(generateFallbackBlueprint(req.body));
    }
  });

  // 2. Generate Personalized Ideas
  app.post('/api/gemini/ideas', async (req: Request, res: Response) => {
    try {
      const { eventType, theme, guestCount, location, focusArea } = req.body;

      if (!ai) {
        return res.json({ ideas: getFallbackIdeas(eventType, theme) });
      }

      const prompt = `Generate 5 creative ideas for ${eventType} with theme ${theme}, guest count ${guestCount}, focus: ${focusArea}.
Output JSON: { "ideas": [{ "category": "decor"|"experience"|"food_drink"|"entertainment"|"photo_op", "title": string, "description": string, "estimatedImpact": "High"|"Medium", "tags": string[] }] }`;

      const aiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });

      const response = await withTimeout(aiCall, 4500);
      const cleanJson = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      return res.json(JSON.parse(cleanJson));
    } catch (error) {
      console.warn('Using fallback ideas due to:', (error as any).message);
      return res.json({ ideas: getFallbackIdeas(req.body.eventType, req.body.theme) });
    }
  });

  // 3. Draft Vendor Inquiry Email (RFP)
  app.post('/api/gemini/vendor-inquiry', async (req: Request, res: Response) => {
    try {
      const {
        vendorCategory,
        businessName,
        eventType,
        date,
        guestCount,
        location,
        budgetAllocation,
        specialRequests,
      } = req.body;

      if (!ai) {
        return res.json(getFallbackRfp(req.body));
      }

      const prompt = `Draft a professional vendor RFP inquiry email for ${vendorCategory} (${businessName || 'Team'}) for a ${eventType} on ${date} at ${location} for ${guestCount} guests with budget $${budgetAllocation}. Notes: ${specialRequests}.
Output JSON: { "subject": string, "body": string }`;

      const aiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const response = await withTimeout(aiCall, 4500);
      const cleanJson = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      return res.json(JSON.parse(cleanJson));
    } catch (error) {
      console.warn('Using fallback RFP due to:', (error as any).message);
      return res.json(getFallbackRfp(req.body));
    }
  });

  // 4. Speech, Invitation & Toast Copywriter
  app.post('/api/gemini/copywriter', async (req: Request, res: Response) => {
    try {
      const { type, tone, eventDetails, speakerRole, keyMemories } = req.body;

      if (!ai) {
        return res.json(getFallbackCopy(req.body));
      }

      const prompt = `Write a ${tone} ${type} by ${speakerRole} for ${eventDetails?.title || 'the event'}. Key notes: ${keyMemories}.
Output JSON: { "title": string, "content": string, "deliveryTips": string[] }`;

      const aiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const response = await withTimeout(aiCall, 4500);
      const cleanJson = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      return res.json(JSON.parse(cleanJson));
    } catch (error) {
      console.warn('Using fallback copywriter due to:', (error as any).message);
      return res.json(getFallbackCopy(req.body));
    }
  });

  // 5. Day-of Emergency Troubleshooter
  app.post('/api/gemini/troubleshoot', async (req: Request, res: Response) => {
    try {
      const { issue, eventType, currentTimelinePhase } = req.body;

      if (!ai) {
        return res.json(getFallbackTriage(issue, eventType));
      }

      const prompt = `Solve day-of emergency: "${issue}" for ${eventType} during ${currentTimelinePhase}.
Output JSON: { "triageSummary": string, "immediateSteps": string[], "guestFacingScript": string, "alternativeWorkaround": string }`;

      const aiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const response = await withTimeout(aiCall, 4500);
      const cleanJson = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      return res.json(JSON.parse(cleanJson));
    } catch (error) {
      console.warn('Using fallback troubleshoot due to:', (error as any).message);
      return res.json(getFallbackTriage(req.body.issue, req.body.eventType));
    }
  });

  // Dev vs Prod Vite Mounting
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`EventFlow AI server listening on http://0.0.0.0:${port}`);
  });
}

function getFallbackRfp(data: any) {
  const business = data.businessName || 'Team';
  const category = data.vendorCategory || 'Event Services';
  const event = data.eventType || 'celebration';
  const date = data.date || 'upcoming date';
  const location = data.location || 'our selected venue';
  const guests = data.guestCount || 100;
  const budget = data.budgetAllocation ? `$${Number(data.budgetAllocation).toLocaleString()}` : 'standard package rate';

  return {
    subject: `Inquiry: ${category} for ${event} on ${date}`,
    body: `Hello ${business},\n\nWe are currently planning our ${event} on ${date} at ${location} with approximately ${guests} guests. We have admired your work and would love to check your availability and package options.\n\nOur allocated budget for ${category} is approximately ${budget}.\n\nSpecial notes / requirements: ${data.specialRequests || 'Standard professional setup and service.'}\n\nCould you please share your current package options, pricing sheets, and confirm your availability for this date?\n\nWarm regards,\nEvent Planning Team`,
  };
}

function getFallbackCopy(data: any) {
  const type = data.type || 'toast';
  const tone = data.tone || 'Warm & Heartfelt';
  const title = data.eventDetails?.title || 'Our Celebration';

  if (type === 'vows') {
    return {
      title: 'Heartfelt Modern Wedding Vows',
      content: `From the very moment we met, you brought warmth, laughter, and an unshakable peace into my life.\n\nToday, surrounded by the people who love us most, I promise to stand by your side through every season — to celebrate your victories, comfort you in quiet moments, and choose you every single day.\n\nI promise to always listen, to laugh with you, and to build a home grounded in kindness, adventure, and unwavering love. You are my greatest partner and my favorite story.`,
      deliveryTips: ['Take a deep breath before speaking', 'Look into their eyes rather than reading straight down', 'Pause briefly between promises for emotional resonance']
    };
  }

  return {
    title: `${tone} ${type === 'toast' ? 'Celebratory Toast' : 'Event Address'}`,
    content: `Good evening everyone,\n\nStanding in this room tonight looking at all of your smiling faces, it is impossible not to feel overwhelmed with joy for ${title}.\n\nWhen you think of genuine love, boundless energy, and true hospitality, you think of the incredible hosts standing before us.\n\n${data.keyMemories ? `Reflecting on ${data.keyMemories}, it reminds all of us what makes today so deeply special.\n\n` : ''}Let us raise our glasses high: to unforgettable memories, to lifelong adventures, and to the wonderful journey ahead. Cheers!`,
    deliveryTips: ['Hold your glass at chest height until the final cheers', 'Speak at an unhurried conversational pace', 'Smile and scan the room during the opening remarks']
  };
}

function getFallbackTriage(issue: string, eventType: string) {
  return {
    triageSummary: `Rapid Response Protocol for: ${issue || 'Day-of Event Obstacle'}`,
    immediateSteps: [
      'Designate one calm coordinator to privately handle this away from the guest sightline.',
      'Notify the venue manager and key leads immediately on private radio or cell.',
      'Deploy the designated contingency buffer or initiate secondary vendor backup protocol.',
    ],
    guestFacingScript: 'Dear guests, we are pausing for a brief 10-minute interlude while we prepare our next highlight. Please enjoy another beverage at the bar and mingling!',
    alternativeWorkaround: 'Pivot timeline order: move cocktail social hour forward by 20 minutes to buy setup runway without guests ever noticing a delay.',
  };
}

function generateFallbackBlueprint(data: any) {
  const budget = data.targetBudget || 25000;
  const isWedding = data.eventType === 'wedding';
  const isBirthday = data.eventType === 'birthday';
  const isCommunity = data.eventType === 'community';

  return {
    styleTheme: data.styleTheme || (isWedding ? 'Botanical Candlelight' : isBirthday ? 'Modern Chic' : 'Vibrant Gathering'),
    description: `A thoughtfully curated ${data.eventType || 'celebration'} blending memorable experiences, smooth timelines, and balanced budget allocations.`,
    budgetItems: [
      {
        category: 'Venue & Rentals',
        name: isWedding ? 'Main Ceremony & Reception Venue' : isBirthday ? 'Lounge Space Buyout' : 'Park & Commons Rental',
        estimatedCost: Math.round(budget * 0.28),
        notes: 'Primary venue reservation and standard facility access.'
      },
      {
        category: 'Catering & Bar',
        name: isCommunity ? 'Local Food Trucks & Refreshments' : 'Plated / Buffet Dining & Beverage Bar',
        estimatedCost: Math.round(budget * 0.35),
        notes: 'Food courses, passed bites, beverages, and service staff.'
      },
      {
        category: 'Music & Entertainment',
        name: isCommunity ? 'Stage Rigging, Sound PA & Live Bands' : 'DJ, MC & Sound Equipment',
        estimatedCost: Math.round(budget * 0.12),
        notes: 'Live audio setup, wireless microphones, and curated playlist.'
      },
      {
        category: 'Photography & Video',
        name: 'Professional Photographer & Highlights',
        estimatedCost: Math.round(budget * 0.10),
        notes: 'Documenting arrival, program highlights, and group portraits.'
      },
      {
        category: 'Floral & Decor',
        name: 'Themed Decor, Table Linens & Centerpieces',
        estimatedCost: Math.round(budget * 0.08),
        notes: 'Atmospheric decor, signage, and focal backdrops.'
      },
      {
        category: isCommunity ? 'Permits, Safety & Logistics' : 'Invitations & Collateral',
        name: isCommunity ? 'Permits, Portable Sanitation & Security' : 'Printed/Digital Invitations & Day-of Paper',
        estimatedCost: Math.round(budget * 0.04),
        notes: 'Essential administrative, safety, or stationery costs.'
      },
      {
        category: 'Contingency & Buffer',
        name: 'Contingency Cushion & Vendor Gratuities',
        estimatedCost: Math.round(budget * 0.03),
        notes: 'Buffer for unforeseen last-minute additions.'
      }
    ],
    milestones: [
      { title: 'Confirm date & secure venue contract', phase: '12_months', category: 'Venue', notes: 'Review cancellation and deposit policies.' },
      { title: 'Book primary catering and select tasting menu', phase: '6_months', category: 'Catering', notes: 'Account for allergies and dietary requirements.' },
      { title: 'Contract entertainment and photographer', phase: '6_months', category: 'Entertainment', notes: 'Verify setup electrical requirements.' },
      { title: 'Send formal invitations with RSVP deadline', phase: '3_months', category: 'Invitations', notes: 'Set cutoff 4 weeks before event.' },
      { title: 'Finalize day-of run-of-show schedule with leads', phase: '1_month', category: 'Logistics', notes: 'Share timing breakdown with key vendors.' },
      { title: 'Final walkthrough and emergency contacts check', phase: 'final_weeks', category: 'Coordination', notes: 'Ensure printed run-of-show is distributed.' }
    ],
    dayOfSchedule: [
      { time: '11:00 AM', title: 'Vendor Load-In & Technical Setup', durationMinutes: 120, leadPerson: 'Lead Coordinator', location: 'Main Venue', notes: 'Rigging, power checks, and delivery sign-offs.' },
      { time: '01:30 PM', title: 'VIP / Host Arrival & Attire Check', durationMinutes: 60, leadPerson: 'Host Team', location: 'Green Room / Suite', notes: 'Refreshments, sound check, quiet prep.' },
      { time: '02:45 PM', title: 'Guest Arrival & Welcome Music', durationMinutes: 45, leadPerson: 'Greeters & Staff', location: 'Welcome Foyer', notes: 'Welcome beverage station open.' },
      { time: '03:30 PM', title: 'Main Program / Official Opening', durationMinutes: 60, leadPerson: 'Emcee / Host', location: 'Main Area', notes: 'Key addresses, ceremony, or ribbon cutting.' },
      { time: '04:45 PM', title: 'Cocktail & Social Mingling Session', durationMinutes: 75, leadPerson: 'Catering & Bar', location: 'Lounge / Terrace', notes: 'Passed appetizers and photo opportunities.' },
      { time: '06:00 PM', title: 'Dinner Service or Food Festival Opening', durationMinutes: 90, leadPerson: 'Catering Lead', location: 'Dining Area', notes: 'Meal service with ambient music.' },
      { time: '07:30 PM', title: 'Key Speeches, Toasts & Highlights', durationMinutes: 30, leadPerson: 'Host & Speakers', location: 'Main Stage', notes: 'Champagne or beverage toast moment.' },
      { time: '08:00 PM', title: 'Celebration, Dance Floor & Dessert', durationMinutes: 120, leadPerson: 'DJ / Entertainment', location: 'Dance Floor', notes: 'High-energy celebration.' },
      { time: '10:00 PM', title: 'Send-Off & Breakdown', durationMinutes: 60, leadPerson: 'Coordinator & Clean Crew', location: 'Full Venue', notes: 'Safe departures and vendor load-out.' }
    ],
    vendors: [
      { category: 'Venue & Rentals', businessName: 'Premier Venue Space', contactName: 'Site Coordinator', email: 'events@venue.com', phone: '(555) 123-4567', quotedAmount: Math.round(budget * 0.28), status: 'researching', contractNotes: 'Ask about load-in time windows and sound curfews.' },
      { category: 'Catering & Bar', businessName: 'Bespoke Culinary Co.', contactName: 'Executive Chef', email: 'taste@culinary.com', phone: '(555) 234-5678', quotedAmount: Math.round(budget * 0.35), status: 'researching', contractNotes: 'Request bar package options and linen inclusions.' },
      { category: 'Music & Entertainment', businessName: 'SoundArt Collective', contactName: 'Audio Director', email: 'booking@soundart.com', phone: '(555) 345-6789', quotedAmount: Math.round(budget * 0.12), status: 'researching', contractNotes: 'Verify microphone requirements and ceremony coverage.' },
      { category: 'Photography & Video', businessName: 'Lumin Studio', contactName: 'Lead Photographer', email: 'hello@lumin.com', phone: '(555) 456-7890', quotedAmount: Math.round(budget * 0.10), status: 'researching', contractNotes: 'Ask about online gallery delivery timeframes.' }
    ],
    creativeIdeas: [
      {
        category: 'decor',
        title: 'Architectural Lighting & Warm Candle Clusters',
        description: 'Layering varying heights of amber pillar candles in hurricane glass with warm uplighting on architectural features to create an intimate atmosphere.',
        estimatedImpact: 'High',
        tags: ['Lighting', 'Atmosphere', 'Cost-Effective']
      },
      {
        category: 'experience',
        title: 'Interactive Audio Guestbook Station',
        description: 'A charming vintage phone where guests record spontaneous memories and advice throughout the celebration.',
        estimatedImpact: 'High',
        tags: ['Interactive', 'Keepsake', 'Guest Fun']
      },
      {
        category: 'food_drink',
        title: 'Signature Dual Cocktail & Mocktail Pairing',
        description: 'Two themed craft cocktails paired with equal-caliber botanical zero-proof mocktails so every guest enjoys the craft beverage experience.',
        estimatedImpact: 'Medium',
        tags: ['Inclusive', 'Bar Experience', 'Signature']
      },
      {
        category: 'entertainment',
        title: 'Late Night Surprise Food Delivery',
        description: 'Pass mini gourmet grilled cheeses or warm cookies with espresso shooters at the peak of the dance party.',
        estimatedImpact: 'High',
        tags: ['Crowd Pleaser', 'Late Night', 'Memorable']
      }
    ]
  };
}

function getFallbackIdeas(eventType: string, theme: string) {
  return [
    {
      category: 'experience',
      title: 'Interactive Memory Wall & Polaroid Hub',
      description: 'Guests snap instant camera photos, write a heartfelt piece of advice or memory, and peg them onto a backlit brass wire grid.',
      estimatedImpact: 'High',
      tags: ['Photo Op', 'Guest Activity', 'Keepsake']
    },
    {
      category: 'food_drink',
      title: 'Artisanal Grazing Station with Local Flavor Accents',
      description: 'A continuous 12-foot display of artisanal cheeses, cured fruits, honeycomb, warm rosemary focaccia, and olive tapenade.',
      estimatedImpact: 'High',
      tags: ['Catering', 'Visual Feast', 'Social']
    },
    {
      category: 'decor',
      title: 'Suspended Botanical & Fabric Cloud Canopy',
      description: 'Lightweight draped natural linen interwoven with preserved greenery suspended above the main gathering table to draw the eye upward.',
      estimatedImpact: 'High',
      tags: ['Decor', 'Statement Piece', 'Aesthetic']
    },
    {
      category: 'entertainment',
      title: 'Acoustic Golden Hour Jam Session',
      description: 'A duo performing acoustic interpretations of beloved modern classics during the transition from afternoon into evening.',
      estimatedImpact: 'Medium',
      tags: ['Music', 'Atmosphere', 'Smooth Transition']
    },
    {
      category: 'photo_op',
      title: 'Minimalist Monogram Archway Photo Station',
      description: 'A clean geometric arch adorned with asymmetrical seasonal florals and subtle typography marking the event date and hosts.',
      estimatedImpact: 'Medium',
      tags: ['Social Media', 'Photo Op', 'Branding']
    }
  ];
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
