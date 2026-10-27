import React, { useState } from 'react';
import { Sparkles, Calendar, DollarSign, Users, MapPin, Heart, Cake, PartyPopper } from 'lucide-react';
import { EventPlan, EventType } from '../types/event';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventPlan, generateAiBlueprint: boolean) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-20');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [targetBudget, setTargetBudget] = useState<number>(25000);
  const [styleTheme, setStyleTheme] = useState('Modern Romantic & Warm Candlelight');
  const [culturalNotes, setCulturalNotes] = useState('');
  const [generateWithAi, setGenerateWithAi] = useState(true);

  if (!isOpen) return null;

  const eventTemplates = [
    {
      type: 'wedding' as EventType,
      label: 'Wedding',
      icon: Heart,
      defaultTitle: 'Sarah & David’s Wedding Celebration',
      defaultLocation: 'Valley Estate & Conservatory, Napa, CA',
      defaultBudget: 35000,
      defaultGuests: 120,
      defaultTheme: 'Warm Botanical & Ambient Candlelight (Sage, Terracotta, Ivory)',
      image: '/src/assets/images/wedding_botanical_inspiration_1792753505134.jpg'
    },
    {
      type: 'birthday' as EventType,
      label: 'Milestone Birthday',
      icon: Cake,
      defaultTitle: 'Alex’s 40th Modern Milestone Soirée',
      defaultLocation: 'Skyline Terrace Lounge, Chicago, IL',
      defaultBudget: 7500,
      defaultGuests: 50,
      defaultTheme: 'Contemporary Noir & Champagne Gold',
      image: '/src/assets/images/birthday_milestone_celebration_1792753505351.jpg'
    },
    {
      type: 'community' as EventType,
      label: 'Community Festival',
      icon: PartyPopper,
      defaultTitle: 'Riverside Community Harvest & Music Festival',
      defaultLocation: 'Civic Commons Plaza, Austin, TX',
      defaultBudget: 18000,
      defaultGuests: 600,
      defaultTheme: 'Vibrant Neighborhood Market & Live Acoustic Bands',
      image: '/src/assets/images/community_street_festival_1792753505504.jpg'
    },
  ];

  const handleSelectType = (t: EventType) => {
    setEventType(t);
    const tmpl = eventTemplates.find(tpl => tpl.type === t);
    if (tmpl) {
      setTitle(tmpl.defaultTitle);
      setLocation(tmpl.defaultLocation);
      setTargetBudget(tmpl.defaultBudget);
      setGuestCount(tmpl.defaultGuests);
      setStyleTheme(tmpl.defaultTheme);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedTmpl = eventTemplates.find(t => t.type === eventType);

    const newPlan: EventPlan = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      type: eventType,
      date,
      location: location.trim() || 'TBD Venue',
      guestCount: Number(guestCount) || 50,
      targetBudget: Number(targetBudget) || 10000,
      currency: 'USD',
      styleTheme: styleTheme.trim() || 'Classic Celebratory',
      culturalNotes: culturalNotes.trim() || undefined,
      description: `A thoughtfully customized ${eventType} gathering celebrating shared moments and seamless memories.`,
      coverImage: selectedTmpl?.image || '/src/assets/images/event_planning_moodboard_1792753503440.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      budgetItems: [
        {
          id: `b-init-1`,
          category: 'Venue & Rentals',
          name: 'Primary Venue Space Reservation',
          estimatedCost: Math.round(targetBudget * 0.3),
          actualCost: 0,
          paidAmount: 0,
          status: 'planned',
        },
        {
          id: `b-init-2`,
          category: 'Catering & Bar',
          name: 'Catering & Beverage Service',
          estimatedCost: Math.round(targetBudget * 0.35),
          actualCost: 0,
          paidAmount: 0,
          status: 'planned',
        },
        {
          id: `b-init-3`,
          category: 'Photography & Video',
          name: 'Media & Event Photography',
          estimatedCost: Math.round(targetBudget * 0.12),
          actualCost: 0,
          paidAmount: 0,
          status: 'planned',
        },
        {
          id: `b-init-4`,
          category: 'Music & Entertainment',
          name: 'DJ, Band or Sound Rig',
          estimatedCost: Math.round(targetBudget * 0.10),
          actualCost: 0,
          paidAmount: 0,
          status: 'planned',
        },
        {
          id: `b-init-5`,
          category: 'Contingency & Buffer',
          name: 'Day-of Contingency Buffer',
          estimatedCost: Math.round(targetBudget * 0.13),
          actualCost: 0,
          paidAmount: 0,
          status: 'planned',
        }
      ],
      milestones: [
        {
          id: `m-init-1`,
          title: 'Secure and finalize venue agreement',
          targetDate: date,
          phase: '12_months',
          category: 'Venue',
          isCompleted: false,
        },
        {
          id: `m-init-2`,
          title: 'Review catering menu options and tasting',
          targetDate: date,
          phase: '6_months',
          category: 'Catering',
          isCompleted: false,
        },
        {
          id: `m-init-3`,
          title: 'Send out formal invitations & open RSVP list',
          targetDate: date,
          phase: '3_months',
          category: 'Invitations',
          isCompleted: false,
        }
      ],
      dayOfSchedule: [
        {
          id: `d-init-1`,
          time: '12:00 PM',
          title: 'Vendor Load-In & Site Check',
          durationMinutes: 90,
          leadPerson: 'Coordinator',
          location: 'Main Venue',
          isCompleted: false,
        },
        {
          id: `d-init-2`,
          time: '02:00 PM',
          title: 'Guest Arrival & Welcome Refreshments',
          durationMinutes: 45,
          leadPerson: 'Host Greeters',
          location: 'Entrance',
          isCompleted: false,
        },
        {
          id: `d-init-3`,
          time: '03:00 PM',
          title: 'Main Celebration Program',
          durationMinutes: 90,
          leadPerson: 'Lead Host',
          location: 'Main Area',
          isCompleted: false,
        }
      ],
      vendors: [],
      creativeIdeas: [],
      guests: [],
      emergencyContacts: [],
    };

    onCreateEvent(newPlan, generateWithAi);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Create New Event Blueprint</h3>
            <p className="text-xs text-slate-500">Plan a wedding, birthday, or community gathering from scratch or with GenAI.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs font-semibold">✕</button>
        </div>

        {/* Archetype Quick Select */}
        <div className="grid grid-cols-3 gap-2.5">
          {eventTemplates.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = eventType === tpl.type;
            return (
              <button
                key={tpl.type}
                type="button"
                onClick={() => handleSelectType(tpl.type)}
                className={`p-3 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all ${
                  isSelected 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xs' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-300' : 'text-slate-500'}`} />
                <span className="text-xs font-semibold">{tpl.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Event Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maya &amp; Liam's Coastal Wedding"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Budget ($)</label>
              <input
                type="number"
                min="500"
                step="500"
                value={targetBudget}
                onChange={(e) => setTargetBudget(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Venue / City Location</label>
              <input
                type="text"
                placeholder="e.g. Hilltop Vineyard, Sonoma, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Estimated Guest Count</label>
              <input
                type="number"
                min="5"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Aesthetic Theme &amp; Color Palette</label>
            <input
              type="text"
              placeholder="e.g. Modern Terracotta &amp; Olive Green with Amber Glow"
              value={styleTheme}
              onChange={(e) => setStyleTheme(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Cultural Traditions or Dietary Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Tea ceremony, gluten-free dessert bar, mariachi band"
              value={culturalNotes}
              onChange={(e) => setCulturalNotes(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
            />
          </div>

          {/* AI Blueprint Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
            <input
              type="checkbox"
              id="ai-generate-checkbox"
              checked={generateWithAi}
              onChange={(e) => setGenerateWithAi(e.target.checked)}
              className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900"
            />
            <label htmlFor="ai-generate-checkbox" className="text-slate-700 cursor-pointer">
              <span className="font-semibold block text-slate-900">Auto-Generate Full AI Blueprint with Gemini</span>
              <span className="text-[11px] text-slate-500">Automatically creates tailored budget items, schedule, vendor categories, and unique theme ideas.</span>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-slate-600 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-2xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Event Plan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
