import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  AlertTriangle, 
  MapPin, 
  User, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { MilestoneItem, DayOfItem, EventPlan, TimelinePhase } from '../types/event';
import { detectTimelineConflicts, calculateTimelineStats } from '../utils/eventCalculations';

interface TimelineViewProps {
  event: EventPlan;
  onUpdateMilestones: (milestones: MilestoneItem[]) => void;
  onUpdateDayOfSchedule: (schedule: DayOfItem[]) => void;
  onOpenAiAssistant: (mode?: string) => void;
}

const PHASES: { id: TimelinePhase; label: string }[] = [
  { id: '12_months', label: '9–12 Months Prior' },
  { id: '6_months', label: '6 Months Prior' },
  { id: '3_months', label: '3 Months Prior' },
  { id: '1_month', label: '1 Month Prior' },
  { id: 'final_weeks', label: 'Final 2 Weeks' },
  { id: 'post_event', label: 'Day-After & Wrap Up' },
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  event,
  onUpdateMilestones,
  onUpdateDayOfSchedule,
  onOpenAiAssistant,
}) => {
  const [viewMode, setViewMode] = useState<'milestones' | 'day_of'>('day_of');
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isAddDayOfModalOpen, setIsAddDayOfModalOpen] = useState(false);

  // New Milestone Form
  const [mTitle, setMTitle] = useState('');
  const [mDate, setMDate] = useState('');
  const [mPhase, setMPhase] = useState<TimelinePhase>('3_months');
  const [mCategory, setMCategory] = useState('Logistics');
  const [mAssignee, setMAssignee] = useState('');
  const [mNotes, setMNotes] = useState('');

  // New Day-of Form
  const [dTime, setDTime] = useState('02:00 PM');
  const [dTitle, setDTitle] = useState('');
  const [dDuration, setDDuration] = useState(45);
  const [dLead, setDLead] = useState('');
  const [dLocation, setDLocation] = useState('');
  const [dNotes, setDNotes] = useState('');

  const conflicts = detectTimelineConflicts(event.dayOfSchedule);
  const stats = calculateTimelineStats(event.milestones, event.dayOfSchedule, event.date);

  const toggleMilestone = (id: string) => {
    const updated = event.milestones.map(m => 
      m.id === id ? { ...m, isCompleted: !m.isCompleted } : m
    );
    onUpdateMilestones(updated);
  };

  const deleteMilestone = (id: string) => {
    if (confirm('Delete this milestone?')) {
      onUpdateMilestones(event.milestones.filter(m => m.id !== id));
    }
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mTitle.trim()) return;

    const newItem: MilestoneItem = {
      id: `milestone-${Date.now()}`,
      title: mTitle.trim(),
      targetDate: mDate || event.date,
      phase: mPhase,
      category: mCategory,
      isCompleted: false,
      assignedTo: mAssignee.trim() || undefined,
      notes: mNotes.trim() || undefined,
    };

    onUpdateMilestones([...event.milestones, newItem]);
    setIsAddMilestoneModalOpen(false);
    setMTitle('');
    setMDate('');
    setMNotes('');
    setMAssignee('');
  };

  const toggleDayOfItem = (id: string) => {
    const updated = event.dayOfSchedule.map(d => 
      d.id === id ? { ...d, isCompleted: !d.isCompleted } : d
    );
    onUpdateDayOfSchedule(updated);
  };

  const deleteDayOfItem = (id: string) => {
    if (confirm('Remove this schedule event?')) {
      onUpdateDayOfSchedule(event.dayOfSchedule.filter(d => d.id !== id));
    }
  };

  const handleAddDayOfItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dTitle.trim()) return;

    const newItem: DayOfItem = {
      id: `dayof-${Date.now()}`,
      time: dTime,
      title: dTitle.trim(),
      durationMinutes: Number(dDuration) || 30,
      leadPerson: dLead.trim() || 'Lead Coordinator',
      location: dLocation.trim() || event.location.split(',')[0],
      notes: dNotes.trim() || undefined,
      isCompleted: false,
    };

    onUpdateDayOfSchedule([...event.dayOfSchedule, newItem]);
    setIsAddDayOfModalOpen(false);
    setDTitle('');
    setDNotes('');
    setDLead('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Timeline &amp; Run-of-Show</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate multi-month preparation milestones and precision minute-by-minute execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('day_of')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'day_of'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Day-of Run of Show ({event.dayOfSchedule.length})
            </button>
            <button
              onClick={() => setViewMode('milestones')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'milestones'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Preparation Milestones ({event.milestones.length})
            </button>
          </div>

          <button
            onClick={() => {
              if (viewMode === 'day_of') setIsAddDayOfModalOpen(true);
              else setIsAddMilestoneModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{viewMode === 'day_of' ? 'Add Schedule Slot' : 'Add Milestone'}</span>
          </button>
        </div>
      </div>

      {/* Conflict Detection Alert Banner */}
      {conflicts.length > 0 && viewMode === 'day_of' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-semibold text-amber-950">
              Schedule Conflict Detected ({conflicts.length})
            </div>
            {conflicts.map((c, i) => (
              <p key={i} className="text-amber-800 leading-relaxed">
                {c.description}
              </p>
            ))}
          </div>
          <button
            onClick={() => onOpenAiAssistant('troubleshoot')}
            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold rounded text-[11px] whitespace-nowrap"
          >
            AI Conflict Fix
          </button>
        </div>
      )}

      {/* DAY-OF RUN-OF-SHOW VIEW */}
      {viewMode === 'day_of' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Event Date: <strong className="text-slate-900 font-semibold">{event.date}</strong></span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Total Run-of-Show Items: <strong className="text-slate-900 font-semibold">{event.dayOfSchedule.length}</strong></span>
            </div>
            <span className="text-emerald-700 font-medium">
              {stats.completedDayOfItems} completed
            </span>
          </div>

          <div className="space-y-3">
            {event.dayOfSchedule.map((item, index) => {
              const isItemConflict = conflicts.some(c => c.itemAId === item.id || c.itemBId === item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border transition-all p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${
                    item.isCompleted 
                      ? 'border-emerald-200 bg-emerald-50/20 opacity-80' 
                      : isItemConflict
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleDayOfItem(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                      aria-label={`Toggle completion for ${item.title}`}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    {/* Time Badge */}
                    <div className="text-center shrink-0 min-w-[75px]">
                      <div className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {item.time}
                      </div>
                      <div className="text-[10px] text-slate-400 tabular-nums">
                        {item.durationMinutes} min
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                        {isItemConflict && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-medium">
                            Timing Overlap
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.notes}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>Lead: <strong className="text-slate-700 font-medium">{item.leadPerson}</strong></span>
                        </div>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 self-end sm:self-center">
                    <button
                      onClick={() => deleteDayOfItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete schedule item"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PREPARATION MILESTONES VIEW */}
      {viewMode === 'milestones' && (
        <div className="space-y-6">
          {PHASES.map((phase) => {
            const phaseMilestones = event.milestones.filter(m => m.phase === phase.id);
            if (phaseMilestones.length === 0) return null;

            return (
              <div key={phase.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {phase.label}
                  </h3>
                  <span className="text-xs text-slate-500 tabular-nums">
                    {phaseMilestones.filter(m => m.isCompleted).length} / {phaseMilestones.length} Done
                  </span>
                </div>

                <div className="space-y-2.5">
                  {phaseMilestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`p-3 rounded-lg border transition-colors flex items-start gap-3 ${
                        milestone.isCompleted 
                          ? 'border-emerald-200 bg-emerald-50/20' 
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <button
                        onClick={() => toggleMilestone(milestone.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                        aria-label={`Toggle completion for ${milestone.title}`}
                      >
                        {milestone.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold ${milestone.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {milestone.title}
                        </div>
                        {milestone.notes && (
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            {milestone.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                          <span>Target: {milestone.targetDate}</span>
                          <span aria-hidden="true">·</span>
                          <span>Category: {milestone.category}</span>
                          {milestone.assignedTo && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Assignee: {milestone.assignedTo}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMilestone(milestone.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete milestone"
                        aria-label={`Delete ${milestone.title}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Milestone Modal */}
      {isAddMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Preparation Milestone</h3>
              <button onClick={() => setIsAddMilestoneModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Milestone Action *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule final tasting with caterer"
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Timeline Phase</label>
                  <select
                    value={mPhase}
                    onChange={(e) => setMPhase(e.target.value as TimelinePhase)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  >
                    {PHASES.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={mDate}
                    onChange={(e) => setMDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Catering, Logistics"
                    value={mCategory}
                    onChange={(e) => setMCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Responsible Lead</label>
                  <input
                    type="text"
                    placeholder="e.g. Host, Planner"
                    value={mAssignee}
                    onChange={(e) => setMAssignee(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes / Checklist Items</label>
                <textarea
                  rows={2}
                  placeholder="Specific tasks or contacts..."
                  value={mNotes}
                  onChange={(e) => setMNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-semibold"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Day-of Item Modal */}
      {isAddDayOfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Day-of Run-of-Show Item</h3>
              <button onClick={() => setIsAddDayOfModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddDayOfItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Program Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Entrance & First Dance"
                  value={dTitle}
                  onChange={(e) => setDTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Start Time (e.g. 05:30 PM)</label>
                  <input
                    type="text"
                    required
                    placeholder="05:30 PM"
                    value={dTime}
                    onChange={(e) => setDTime(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={dDuration}
                    onChange={(e) => setDDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Lead Coordinator / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. DJ, Emcee, Officiant"
                    value={dLead}
                    onChange={(e) => setDLead(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Location Zone</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Hall, Stage"
                    value={dLocation}
                    onChange={(e) => setDLocation(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes / Cues</label>
                <textarea
                  rows={2}
                  placeholder="Song cue, lighting adjustment, microphone assignment..."
                  value={dNotes}
                  onChange={(e) => setDNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDayOfModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-semibold"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
