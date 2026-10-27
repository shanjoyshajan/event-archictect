/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_EVENTS } from './data/initialEvents';
import { EventPlan, BudgetItem, MilestoneItem, DayOfItem, VendorItem, CreativeIdea, GuestItem } from './types/event';
import { Navigation } from './components/Navigation';
import { OverviewView } from './components/OverviewView';
import { BudgetView } from './components/BudgetView';
import { TimelineView } from './components/TimelineView';
import { VendorsView } from './components/VendorsView';
import { IdeasView } from './components/IdeasView';
import { GuestsView } from './components/GuestsView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NewEventModal } from './components/NewEventModal';
import { ExportSummaryModal } from './components/ExportSummaryModal';

const STORAGE_KEY = 'eventflow_ai_events_v2';

export default function App() {
  const [events, setEvents] = useState<EventPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved events, using defaults', e);
    }
    return INITIAL_EVENTS;
  });

  const [activeEventId, setActiveEventId] = useState<string>(() => {
    return events[0]?.id || INITIAL_EVENTS[0].id;
  });

  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<string>('blueprint');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('Failed to save events to local storage', e);
    }
  }, [events]);

  const currentEvent = events.find(e => e.id === activeEventId) || events[0] || INITIAL_EVENTS[0];

  const updateCurrentEvent = (updater: (prev: EventPlan) => EventPlan) => {
    setEvents(prevEvents =>
      prevEvents.map(e => (e.id === currentEvent.id ? updater(e) : e))
    );
  };

  const handleUpdateBudgetItems = (items: BudgetItem[]) => {
    updateCurrentEvent(prev => ({ ...prev, budgetItems: items, updatedAt: new Date().toISOString() }));
  };

  const handleUpdateMilestones = (milestones: MilestoneItem[]) => {
    updateCurrentEvent(prev => ({ ...prev, milestones, updatedAt: new Date().toISOString() }));
  };

  const handleUpdateDayOfSchedule = (schedule: DayOfItem[]) => {
    updateCurrentEvent(prev => ({ ...prev, dayOfSchedule: schedule, updatedAt: new Date().toISOString() }));
  };

  const handleUpdateVendors = (vendors: VendorItem[]) => {
    updateCurrentEvent(prev => ({ ...prev, vendors, updatedAt: new Date().toISOString() }));
  };

  const handleUpdateIdeas = (ideas: CreativeIdea[]) => {
    updateCurrentEvent(prev => ({ ...prev, creativeIdeas: ideas, updatedAt: new Date().toISOString() }));
  };

  const handleUpdateGuests = (guests: GuestItem[]) => {
    updateCurrentEvent(prev => ({ ...prev, guests, updatedAt: new Date().toISOString() }));
  };

  const handleApplyBlueprint = (blueprint: Partial<EventPlan>) => {
    updateCurrentEvent(prev => ({
      ...prev,
      ...blueprint,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddCreativeIdea = (idea: CreativeIdea) => {
    updateCurrentEvent(prev => ({
      ...prev,
      creativeIdeas: [idea, ...prev.creativeIdeas],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleCreateNewEvent = (newEvent: EventPlan, generateAiBlueprint: boolean) => {
    setEvents(prev => [newEvent, ...prev]);
    setActiveEventId(newEvent.id);
    setActiveTab('overview');

    if (generateAiBlueprint) {
      setAiModalMode('blueprint');
      setIsAiModalOpen(true);
    }
  };

  const handleOpenAiAssistant = (mode: string = 'blueprint') => {
    setAiModalMode(mode);
    setIsAiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation Top Bar Contract */}
      <Navigation
        currentEvent={currentEvent}
        allEvents={events}
        onSelectEvent={(evt) => setActiveEventId(evt.id)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAiAssistant={handleOpenAiAssistant}
        onOpenNewEventModal={() => setIsNewEventModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewView
            event={currentEvent}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAiAssistant={handleOpenAiAssistant}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetView
            event={currentEvent}
            onUpdateBudgetItems={handleUpdateBudgetItems}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            event={currentEvent}
            onUpdateMilestones={handleUpdateMilestones}
            onUpdateDayOfSchedule={handleUpdateDayOfSchedule}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorsView
            event={currentEvent}
            onUpdateVendors={handleUpdateVendors}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasView
            event={currentEvent}
            onUpdateIdeas={handleUpdateIdeas}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'guests' && (
          <GuestsView
            event={currentEvent}
            onUpdateGuests={handleUpdateGuests}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
            <span>EventFlow AI — Smart Event &amp; Wedding Planner</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Budgets</span>
            <span>·</span>
            <span>Timelines</span>
            <span>·</span>
            <span>Vendors</span>
            <span>·</span>
            <span>GenAI Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        event={currentEvent}
        initialMode={aiModalMode}
        onApplyBlueprint={handleApplyBlueprint}
        onAddCreativeIdea={handleAddCreativeIdea}
      />

      <NewEventModal
        isOpen={isNewEventModalOpen}
        onClose={() => setIsNewEventModalOpen(false)}
        onCreateEvent={handleCreateNewEvent}
      />

      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        event={currentEvent}
      />
    </div>
  );
}
