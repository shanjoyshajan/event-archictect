import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  FileText, 
  LifeBuoy, 
  Copy, 
  Check, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { EventPlan, CreativeIdea } from '../types/event';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventPlan;
  initialMode?: string;
  onApplyBlueprint: (blueprint: Partial<EventPlan>) => void;
  onAddCreativeIdea: (idea: CreativeIdea) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  event,
  initialMode = 'blueprint',
  onApplyBlueprint,
  onAddCreativeIdea,
}) => {
  const [activeMode, setActiveMode] = useState<string>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Blueprint Generator State
  const [bpBudget, setBpBudget] = useState(event.targetBudget);
  const [bpGuests, setBpGuests] = useState(event.guestCount);
  const [bpTheme, setBpTheme] = useState(event.styleTheme);
  const [bpNotes, setBpNotes] = useState(event.culturalNotes || '');
  const [generatedBlueprint, setGeneratedBlueprint] = useState<any | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);

  // 2. Ideas Generator State
  const [ideaFocus, setIdeaFocus] = useState('all');
  const [generatedIdeas, setGeneratedIdeas] = useState<any[]>([]);

  // 3. Copywriter State
  const [copyType, setCopyType] = useState('toast');
  const [copyTone, setCopyTone] = useState('Warm, heartfelt, and humorous');
  const [copySpeaker, setCopySpeaker] = useState('Host / Best Friend');
  const [copyMemories, setCopyMemories] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState<any | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // 4. Troubleshooter State
  const [troubleIssue, setTroubleIssue] = useState('');
  const [troublePhase, setTroublePhase] = useState('During Cocktail / Reception');
  const [generatedTriage, setGeneratedTriage] = useState<any | null>(null);

  if (!isOpen) return null;

  // Handler 1: Generate Full Blueprint
  const handleGenerateBlueprint = async () => {
    setLoading(true);
    setError(null);
    setAppliedNotice(false);

    try {
      const res = await fetch('/api/gemini/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          title: event.title,
          location: event.location,
          date: event.date,
          guestCount: bpGuests,
          targetBudget: bpBudget,
          styleTheme: bpTheme,
          culturalNotes: bpNotes,
        }),
      });

      if (!res.ok) throw new Error('Blueprint generation failed');
      const data = await res.json();
      setGeneratedBlueprint(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI service');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyBlueprint = () => {
    if (!generatedBlueprint) return;

    onApplyBlueprint({
      styleTheme: generatedBlueprint.styleTheme || bpTheme,
      description: generatedBlueprint.description || event.description,
      budgetItems: generatedBlueprint.budgetItems?.map((item: any, idx: number) => ({
        id: `gen-b-${Date.now()}-${idx}`,
        category: item.category,
        name: item.name,
        estimatedCost: item.estimatedCost || 0,
        actualCost: 0,
        paidAmount: 0,
        status: 'planned',
        notes: item.notes,
      })) || event.budgetItems,
      milestones: generatedBlueprint.milestones?.map((item: any, idx: number) => ({
        id: `gen-m-${Date.now()}-${idx}`,
        title: item.title,
        targetDate: event.date,
        phase: item.phase || '3_months',
        category: item.category || 'Planning',
        isCompleted: false,
        notes: item.notes,
      })) || event.milestones,
      dayOfSchedule: generatedBlueprint.dayOfSchedule?.map((item: any, idx: number) => ({
        id: `gen-d-${Date.now()}-${idx}`,
        time: item.time || '12:00 PM',
        title: item.title,
        durationMinutes: item.durationMinutes || 45,
        leadPerson: item.leadPerson || 'Lead Coordinator',
        location: item.location || 'Main Zone',
        notes: item.notes,
        isCompleted: false,
      })) || event.dayOfSchedule,
      vendors: generatedBlueprint.vendors?.map((item: any, idx: number) => ({
        id: `gen-v-${Date.now()}-${idx}`,
        category: item.category,
        businessName: item.businessName,
        contactName: item.contactName || 'Lead Representative',
        email: item.email || 'inquiries@vendor.com',
        phone: item.phone || '(555) 000-0000',
        status: 'researching',
        quotedAmount: item.quotedAmount || 0,
        depositAmount: 0,
        balancePaid: 0,
        contractNotes: item.contractNotes,
      })) || event.vendors,
      creativeIdeas: generatedBlueprint.creativeIdeas?.map((item: any, idx: number) => ({
        id: `gen-i-${Date.now()}-${idx}`,
        category: item.category || 'experience',
        title: item.title,
        description: item.description,
        estimatedImpact: item.estimatedImpact || 'High',
        tags: item.tags || ['AI Generated'],
        isBookmarked: true,
      })) || event.creativeIdeas,
    });

    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  // Handler 2: Generate Ideas
  const handleGenerateIdeas = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: event.type,
          theme: event.styleTheme,
          location: event.location,
          guestCount: event.guestCount,
          focusArea: ideaFocus,
        }),
      });

      if (!res.ok) throw new Error('Ideas generation failed');
      const data = await res.json();
      setGeneratedIdeas(data.ideas || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate ideas');
    } finally {
      setLoading(false);
    }
  };

  // Handler 3: Generate Copy
  const handleGenerateCopy = async () => {
    setLoading(true);
    setError(null);
    setCopySuccess(false);

    try {
      const res = await fetch('/api/gemini/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: copyType,
          tone: copyTone,
          speakerRole: copySpeaker,
          keyMemories: copyMemories,
          eventDetails: {
            title: event.title,
            type: event.type,
            date: event.date,
            location: event.location,
          },
        }),
      });

      if (!res.ok) throw new Error('Copywriting failed');
      const data = await res.json();
      setGeneratedCopy(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate copy');
    } finally {
      setLoading(false);
    }
  };

  // Handler 4: Troubleshoot
  const handleTroubleshoot = async (issueOverride?: string) => {
    const issueToSolve = issueOverride || troubleIssue;
    if (!issueToSolve.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/gemini/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: issueToSolve,
          eventType: event.type,
          currentTimelinePhase: troublePhase,
          availableMinutes: '15 minutes',
        }),
      });

      if (!res.ok) throw new Error('Troubleshooting failed');
      const data = await res.json();
      setGeneratedTriage(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate troubleshooting plan');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                AI Event Planning Engine
              </h2>
              <p className="text-[11px] text-slate-300">
                Powered by Gemini for {event.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto shrink-0">
          {[
            { id: 'blueprint', label: 'Event Blueprint', icon: Sparkles },
            { id: 'ideas', label: 'Theme & Ideas', icon: Lightbulb },
            { id: 'copywriter', label: 'Speech & Invite Copy', icon: FileText },
            { id: 'troubleshoot', label: 'Day-of Problem Solver', icon: LifeBuoy },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMode(tab.id);
                  setError(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Viewport */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MODE 1: FULL BLUEPRINT */}
          {activeMode === 'blueprint' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <h3 className="font-semibold text-slate-900">
                  Generate Complete Custom Event Architecture
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Gemini will formulate an exhaustive budget breakdown, milestone preparation schedule, minute-by-minute day-of run of show, and vendor RFP checklist tailored specifically to your parameters.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Target Budget ($)</label>
                    <input
                      type="number"
                      value={bpBudget}
                      onChange={(e) => setBpBudget(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Guest Count</label>
                    <input
                      type="number"
                      value={bpGuests}
                      onChange={(e) => setBpGuests(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Aesthetic Style &amp; Atmosphere Vibe</label>
                  <input
                    type="text"
                    value={bpTheme}
                    onChange={(e) => setBpTheme(e.target.value)}
                    placeholder="e.g. Modern Botanical & Warm Amber Brass, Candlelit Greenhouse"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Cultural Traditions, Dining or Music Notes</label>
                  <input
                    type="text"
                    value={bpNotes}
                    onChange={(e) => setBpNotes(e.target.value)}
                    placeholder="e.g. Bilingual ceremony, Mediterranean family feast, live acoustic cello"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleGenerateBlueprint}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-2 shadow-2xs"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Synthesizing Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate Custom Blueprint</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Blueprint Results Preview */}
              {generatedBlueprint && (
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-800">Generated Blueprint Ready</div>
                      <div className="font-bold text-slate-900 text-sm">{generatedBlueprint.styleTheme}</div>
                    </div>

                    <button
                      onClick={handleApplyBlueprint}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-md shadow-2xs flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply to Current Event</span>
                    </button>
                  </div>

                  {appliedNotice && (
                    <div className="p-2 bg-emerald-100 text-emerald-900 rounded font-semibold text-center">
                      ✓ Successfully updated your active event plan with the generated blueprint!
                    </div>
                  )}

                  <p className="text-slate-600 leading-relaxed italic">
                    "{generatedBlueprint.description}"
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="p-2 bg-white rounded border border-slate-100">
                      <div className="text-[10px] text-slate-400">Budget Items</div>
                      <div className="font-bold text-slate-800">{generatedBlueprint.budgetItems?.length || 0} items</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-100">
                      <div className="text-[10px] text-slate-400">Milestones</div>
                      <div className="font-bold text-slate-800">{generatedBlueprint.milestones?.length || 0} steps</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-100">
                      <div className="text-[10px] text-slate-400">Run of Show</div>
                      <div className="font-bold text-slate-800">{generatedBlueprint.dayOfSchedule?.length || 0} timeslots</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-slate-100">
                      <div className="text-[10px] text-slate-400">Creative Ideas</div>
                      <div className="font-bold text-slate-800">{generatedBlueprint.creativeIdeas?.length || 0} concepts</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: CREATIVE IDEAS */}
          {activeMode === 'ideas' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <h3 className="font-semibold text-slate-900">
                  Brainstorm Personalized Theme &amp; Experience Ideas
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Tailored concepts for interactive activations, memorable food &amp; cocktail stations, lighting design, and photo moments.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'All Creative Angles' },
                    { id: 'decor', label: 'Floral & Decor' },
                    { id: 'experience', label: 'Guest Experience' },
                    { id: 'food_drink', label: 'Food & Bar' },
                    { id: 'photo_op', label: 'Photo Moments' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setIdeaFocus(f.id)}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        ideaFocus === f.id
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleGenerateIdeas}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-2 shadow-2xs"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Dreaming Up Concepts...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate Fresh Ideas</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ideas Results */}
              {generatedIdeas.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Generated Concepts ({generatedIdeas.length})
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedIdeas.map((idea, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
                            <span>{idea.category}</span>
                            <span>{idea.estimatedImpact} Impact</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mt-1">{idea.title}</h4>
                          <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                            {idea.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex gap-1">
                            {idea.tags?.slice(0, 2).map((t: string, i: number) => (
                              <span key={i} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{t}</span>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              onAddCreativeIdea({
                                id: `idea-gen-${Date.now()}-${idx}`,
                                category: idea.category,
                                title: idea.title,
                                description: idea.description,
                                estimatedImpact: idea.estimatedImpact || 'High',
                                tags: idea.tags || [],
                                isBookmarked: true,
                              });
                              alert(`Added "${idea.title}" to your saved ideas!`);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded text-[11px] flex items-center gap-1"
                          >
                            <span>+ Save Idea</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 3: SPEECH & INVITE COPYWRITER */}
          {activeMode === 'copywriter' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <h3 className="font-semibold text-slate-900">
                  AI Speech, Vows &amp; Invitation Copywriter
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Draft articulate, heartfelt speeches, wedding vows, host welcome remarks, formal invitation prose, or RSVP reminders.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">What would you like to draft?</label>
                    <select
                      value={copyType}
                      onChange={(e) => setCopyType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md"
                    >
                      <option value="toast">Best Man / Maid of Honor Toast</option>
                      <option value="vows">Personal Wedding Vows</option>
                      <option value="welcome_address">Host Welcome Address</option>
                      <option value="formal_invitation">Formal Invitation Wording</option>
                      <option value="rsvp_reminder">Gentle RSVP Reminder Message</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Tone of Voice</label>
                    <select
                      value={copyTone}
                      onChange={(e) => setCopyTone(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md"
                    >
                      <option value="Warm, heartfelt, and humorous">Warm, heartfelt, &amp; humorous</option>
                      <option value="Eloquent, poetic, and romantic">Eloquent, poetic, &amp; romantic</option>
                      <option value="Lively, upbeat, and celebratory">Lively, upbeat, &amp; celebratory</option>
                      <option value="Concise, elegant, and modern">Concise, elegant, &amp; modern</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Speaker / Writer Role</label>
                    <input
                      type="text"
                      value={copySpeaker}
                      onChange={(e) => setCopySpeaker(e.target.value)}
                      placeholder="e.g. Best Friend, Sister, Event Host"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Key Anecdotes / Words to Include</label>
                    <input
                      type="text"
                      value={copyMemories}
                      onChange={(e) => setCopyMemories(e.target.value)}
                      placeholder="e.g. Trip to Spain, shared love of hiking, resilience"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-md"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleGenerateCopy}
                    disabled={loading}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-2 shadow-2xs"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Crafting Copy...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-amber-300" />
                        <span>Generate Custom Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Copy Results */}
              {generatedCopy && (
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-slate-900 text-sm">{generatedCopy.title}</h4>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.content)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg text-slate-800 font-serif leading-relaxed whitespace-pre-line text-xs">
                    {generatedCopy.content}
                  </div>

                  {generatedCopy.deliveryTips && generatedCopy.deliveryTips.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-900 space-y-1">
                      <div className="font-semibold text-[11px]">Delivery &amp; Pacing Advice:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                        {generatedCopy.deliveryTips.map((tip: string, i: number) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODE 4: DAY-OF PROBLEM SOLVER */}
          {activeMode === 'troubleshoot' && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <LifeBuoy className="w-4 h-4" />
                  <span>Day-of Emergency Triage &amp; Contingency Pivot</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Experiencing an unexpected last-minute obstacle? Gemini provides immediate 3-minute emergency protocols, guest-facing scripts, and seamless operational workarounds.
                </p>

                {/* Common Emergency Quick-Picks */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                    Common High-Priority Scenarios:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Sudden rain storm on outdoor reception',
                      'DJ equipment failed 15 min before entrance',
                      'Main course catering running 45 min late',
                      'Red wine spilled on wedding attire',
                      'Wedding cake damaged during transport',
                      'Bar ran out of wine and specialty spirits',
                    ].map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setTroubleIssue(preset);
                          handleTroubleshoot(preset);
                        }}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-400 text-slate-700 rounded text-[11px] transition-colors"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block font-medium text-slate-700 mb-1">Describe the specific incident or roadblock</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Power outlet tripped at ceremony gazebo"
                      value={troubleIssue}
                      onChange={(e) => setTroubleIssue(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-md"
                    />
                    <button
                      onClick={() => handleTroubleshoot()}
                      disabled={loading || !troubleIssue.trim()}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold rounded-md shadow-2xs whitespace-nowrap"
                    >
                      {loading ? 'Analyzing...' : 'Resolve Issue'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Troubleshooting Plan Output */}
              {generatedTriage && (
                <div className="p-5 bg-white rounded-xl border border-rose-200 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <LifeBuoy className="w-4 h-4" />
                    <span>{generatedTriage.triageSummary}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                      Immediate Action Steps (First 5 Minutes)
                    </div>
                    <div className="space-y-2">
                      {generatedTriage.immediateSteps?.map((step: string, idx: number) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {generatedTriage.guestFacingScript && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1">
                      <div className="font-semibold text-amber-950 text-[11px]">
                        Exact Guest-Facing Script (To protect the atmosphere):
                      </div>
                      <p className="italic text-amber-900 text-xs">
                        "{generatedTriage.guestFacingScript}"
                      </p>
                    </div>
                  )}

                  {generatedTriage.alternativeWorkaround && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-semibold text-slate-800 text-[11px]">
                        Long-Term Pivot &amp; Backup Plan:
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {generatedTriage.alternativeWorkaround}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            EventFlow AI Planning System
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition-colors"
          >
            Close Assistant
          </button>
        </div>

      </div>
    </div>
  );
};
