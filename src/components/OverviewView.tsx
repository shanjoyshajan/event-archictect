import React from 'react';
import { 
  Sparkles, 
  Clock, 
  DollarSign, 
  Users, 
  CheckSquare, 
  LifeBuoy, 
  Lightbulb, 
  FileDown, 
  MapPin, 
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { EventPlan } from '../types/event';
import { 
  calculateBudgetSummary, 
  calculateCategoryBreakdown, 
  calculateTimelineStats, 
  calculateGuestStats,
  formatCurrency 
} from '../utils/eventCalculations';

interface OverviewViewProps {
  event: EventPlan;
  onNavigateTab: (tabId: string) => void;
  onOpenAiAssistant: (mode?: string) => void;
  onOpenExportModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  event,
  onNavigateTab,
  onOpenAiAssistant,
  onOpenExportModal,
}) => {
  const budgetSummary = calculateBudgetSummary(event.budgetItems, event.targetBudget);
  const categoryBreakdown = calculateCategoryBreakdown(event.budgetItems);
  const timelineStats = calculateTimelineStats(event.milestones, event.dayOfSchedule, event.date);
  const guestStats = calculateGuestStats(event.guests);

  const upcomingMilestones = [...event.milestones]
    .filter(m => !m.isCompleted)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
    .slice(0, 4);

  const bookmarkedIdeas = event.creativeIdeas.filter(i => i.isBookmarked);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Measured Contrast Scrim */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-72 sm:h-80 object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-72 sm:h-80 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300">
              <span className="uppercase tracking-wider">{event.type} Blueprint</span>
              <span aria-hidden="true">·</span>
              <span>{event.styleTheme}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance">
              {event.title}
            </h1>

            <p className="text-sm text-slate-300 line-clamp-2 max-w-2xl font-normal leading-relaxed">
              {event.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[280px]">{event.location}</span>
              </div>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{event.guestCount} Target Guests</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Countdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Countdown</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {timelineStats.daysRemaining > 0 ? (
              <span>{timelineStats.daysRemaining} <span className="text-sm font-normal text-slate-500">days left</span></span>
            ) : timelineStats.daysRemaining === 0 ? (
              <span className="text-amber-600">Today!</span>
            ) : (
              <span className="text-slate-500">Past event</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-2 truncate">
            {event.date} target date
          </div>
        </div>

        {/* Metric 2: Budget Allocated */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Budget Allocated</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {formatCurrency(budgetSummary.totalActual, event.currency)}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Target: {formatCurrency(budgetSummary.targetBudget, event.currency)}</span>
            <span className={`font-semibold tabular-nums ${budgetSummary.isOverBudget ? 'text-rose-600' : 'text-slate-700'}`}>
              {budgetSummary.percentSpent}%
            </span>
          </div>
        </div>

        {/* Metric 3: Milestones Completed */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Preparation Progress</span>
            <CheckSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {timelineStats.completedMilestones} / {timelineStats.totalMilestones}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all" 
                style={{ width: `${timelineStats.milestonePercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 tabular-nums">
              {timelineStats.milestonePercent}%
            </span>
          </div>
        </div>

        {/* Metric 4: RSVPs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Guest Attendance</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {guestStats.totalAttending} <span className="text-sm font-normal text-slate-500">confirmed</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
            <span>{guestStats.totalPending} pending</span>
            <span aria-hidden="true">·</span>
            <span>{guestStats.totalDeclined} declined</span>
          </div>
        </div>
      </div>

      {/* AI Assistant Quick-Launch Hub */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GenAI Event Planning Suite</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Intelligent Event Architecture &amp; Real-Time Problem Solving
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
              Generate complete custom budgets, run-of-show schedules, professional vendor inquiries, and day-of emergency solutions with Gemini.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onOpenAiAssistant('blueprint')}
            className="flex items-start gap-3 p-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Full Event Blueprint</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Generate complete budget, timeline &amp; vendors</div>
            </div>
          </button>

          <button
            onClick={() => onOpenAiAssistant('ideas')}
            className="flex items-start gap-3 p-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Creative Brainstormer</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Theme concepts, photo ops &amp; food pairings</div>
            </div>
          </button>

          <button
            onClick={() => onOpenAiAssistant('copywriter')}
            className="flex items-start gap-3 p-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-colors"
          >
            <FileDown className="w-4 h-4 text-sky-300 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Speech &amp; Invite Drafter</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Vows, toasts, invitations &amp; reminders</div>
            </div>
          </button>

          <button
            onClick={() => onOpenAiAssistant('troubleshoot')}
            className="flex items-start gap-3 p-3.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-left transition-colors"
          >
            <LifeBuoy className="w-4 h-4 text-rose-300 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-white">Day-of Troubleshooter</div>
              <div className="text-[11px] text-slate-300 mt-0.5">Instant triage &amp; contingency pivots</div>
            </div>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Budget Snapshot & Upcoming Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Spending Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Budget Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">Top expenditure categories by volume</p>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <span>View Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {categoryBreakdown.slice(0, 5).map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{cat.category}</span>
                  <span className="text-slate-600 tabular-nums">
                    {formatCurrency(cat.actual || cat.estimated, event.currency)}{' '}
                    <span className="text-slate-400 font-normal">({cat.percentOfTotal}%)</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-slate-800 h-full rounded-full"
                    style={{ width: `${Math.min(100, cat.percentOfTotal * 1.5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Remaining Unallocated:</span>
            <span className={`font-semibold tabular-nums ${budgetSummary.unallocatedBudget < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {formatCurrency(budgetSummary.unallocatedBudget, event.currency)}
            </span>
          </div>
        </div>

        {/* Right Column: Upcoming Preparation Milestones */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Upcoming Milestones</h3>
              <p className="text-xs text-slate-500 mt-0.5">Next priority deliverables to complete</p>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <span>View Full Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingMilestones.length > 0 ? (
              upcomingMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900 truncate">
                      {milestone.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>Due {milestone.targetDate}</span>
                      {milestone.assignedTo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>Lead: {milestone.assignedTo}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                All milestones are currently up to date!
              </div>
            )}
          </div>

          {/* Quick Day-of Run-of-Show teaser */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Day-of Schedule:</span>
            <span className="font-medium text-slate-900">
              {event.dayOfSchedule.length} program items scheduled
            </span>
          </div>
        </div>

      </div>

      {/* Bookmarked Creative Ideas Section */}
      {bookmarkedIdeas.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900">Curated Creative Highlights</h3>
            </div>
            <button
              onClick={() => onNavigateTab('ideas')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1"
            >
              <span>Explore All Ideas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedIdeas.slice(0, 3).map((idea) => (
              <div
                key={idea.id}
                className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">{idea.title}</div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                    {idea.description}
                  </p>
                </div>
                {idea.suggestedAction && (
                  <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">Next Action:</span> {idea.suggestedAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contacts Footer Bar */}
      {event.emergencyContacts && event.emergencyContacts.length > 0 && (
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Key Event Day-of Contacts:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            {event.emergencyContacts.map((contact, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900">{contact.role}:</span>
                <span>{contact.name}</span>
                <span className="text-slate-400 font-mono">({contact.phone})</span>
              </div>
            ))}
          </div>
          <button
            onClick={onOpenExportModal}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium transition-colors"
          >
            Export Run-of-Show PDF
          </button>
        </div>
      )}

    </div>
  );
};
