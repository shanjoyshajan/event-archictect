import React from 'react';
import { Calendar, Sparkles, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { EventPlan, EventType } from '../types/event';

interface NavigationProps {
  currentEvent: EventPlan;
  allEvents: EventPlan[];
  onSelectEvent: (event: EventPlan) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAiAssistant: (initialMode?: string) => void;
  onOpenNewEventModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentEvent,
  allEvents,
  onSelectEvent,
  activeTab,
  onTabChange,
  onOpenAiAssistant,
  onOpenNewEventModal,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'budget', label: 'Budget Planner' },
    { id: 'timeline', label: 'Timeline & Run-of-Show' },
    { id: 'vendors', label: 'Vendor Hub' },
    { id: 'ideas', label: 'Personalized Ideas' },
    { id: 'guests', label: 'Guest List & RSVP' },
  ];

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'wedding': return 'Wedding';
      case 'birthday': return 'Birthday';
      case 'community': return 'Community';
      default: return 'Event';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Bar Contract: 3 zones (Brand wordmark, Nav links, 1 primary action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              E
            </div>
            <a href="/" className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
              EventFlow AI
            </a>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`py-2 whitespace-nowrap shrink-0 transition-colors relative font-medium ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action button + AI trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAiAssistant()}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              aria-label="Open AI Event Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Sub-bar: Event selector breadcrumbs & active event switcher */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Event Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-800 font-medium hover:bg-slate-50 transition-colors shadow-2xs"
              aria-expanded={isDropdownOpen}
              aria-label="Select active event"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500 font-normal">{getEventBadge(currentEvent.type)}:</span>
              <span className="font-semibold text-slate-900 max-w-[220px] truncate">{currentEvent.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div 
                className="absolute left-0 mt-1 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1"
                role="menu"
              >
                <div className="px-3 py-1.5 text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                  Active Projects
                </div>
                {allEvents.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => {
                      onSelectEvent(evt);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-slate-900 truncate max-w-[200px]">{evt.title}</div>
                      <div className="text-[11px] text-slate-500">{evt.date} · {evt.location.split(',')[0]}</div>
                    </div>
                    {evt.id === currentEvent.id && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
                
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenNewEventModal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-indigo-600 font-medium hover:bg-indigo-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Event Plan...</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Breadcrumbs metadata */}
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>Date: <strong className="text-slate-700 font-semibold">{currentEvent.date}</strong></span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span>Target: <strong className="text-slate-700 font-semibold">${currentEvent.targetBudget.toLocaleString()}</strong></span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span>Guests: <strong className="text-slate-700 font-semibold">{currentEvent.guestCount}</strong></span>
          </div>

          {/* Quick Mobile nav switcher */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto py-1 max-w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-2.5 py-1 text-xs rounded whitespace-nowrap ${
                  activeTab === item.id ? 'bg-slate-900 text-white font-medium' : 'text-slate-600 bg-white border border-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </header>
  );
};
