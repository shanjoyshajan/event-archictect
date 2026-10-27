import React, { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Plus, 
  Trash2, 
  Lightbulb, 
  Palette, 
  Music, 
  Utensils, 
  Camera,
  Check
} from 'lucide-react';
import { CreativeIdea, EventPlan } from '../types/event';

interface IdeasViewProps {
  event: EventPlan;
  onUpdateIdeas: (ideas: CreativeIdea[]) => void;
  onOpenAiAssistant: (mode?: string) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({
  event,
  onUpdateIdeas,
  onOpenAiAssistant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Idea Form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<CreativeIdea['category']>('experience');
  const [newImpact, setNewImpact] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newTags, setNewTags] = useState('Interactive, Signature');
  const [newAction, setNewAction] = useState('');

  const filteredIdeas = event.creativeIdeas.filter(idea => 
    selectedCategory === 'all' || idea.category === selectedCategory
  );

  const toggleBookmark = (id: string) => {
    const updated = event.creativeIdeas.map(i => 
      i.id === id ? { ...i, isBookmarked: !i.isBookmarked } : i
    );
    onUpdateIdeas(updated);
  };

  const deleteIdea = (id: string) => {
    onUpdateIdeas(event.creativeIdeas.filter(i => i.id !== id));
  };

  const handleAddCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIdea: CreativeIdea = {
      id: `custom-idea-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      estimatedImpact: newImpact,
      tags: newTags.split(',').map(s => s.trim()).filter(Boolean),
      isBookmarked: true,
      suggestedAction: newAction.trim() || undefined,
    };

    onUpdateIdeas([newIdea, ...event.creativeIdeas]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewAction('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personalized Ideas &amp; Mood Board</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curated styling, interactive guest experiences, signature cocktails, and photo moments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAiAssistant('ideas')}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Generate Fresh Ideas</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Idea</span>
          </button>
        </div>
      </div>

      {/* Mood Board Showcase Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 md:col-span-2 space-y-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700">
              <Palette className="w-3.5 h-3.5" />
              <span>Aesthetic Concept &amp; Color Strategy</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {event.styleTheme}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every detail is calibrated to express this visual signature — from textural linen and ambient candlelight to thoughtful signature cocktails and warm hospitality.
            </p>
            {event.culturalNotes && (
              <div className="pt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Cultural &amp; Personal Notes:</span> {event.culturalNotes}
              </div>
            )}
          </div>

          <div className="h-48 md:h-auto relative bg-slate-100">
            <img
              src="/src/assets/images/event_planning_moodboard_1792753503440.jpg"
              alt="Event Moodboard Palette"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Ideas' },
          { id: 'decor', label: 'Floral & Decor' },
          { id: 'experience', label: 'Guest Experience' },
          { id: 'food_drink', label: 'Food & Bar' },
          { id: 'entertainment', label: 'Music & Shows' },
          { id: 'photo_op', label: 'Photo Moments' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedCategory === tab.id
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ideas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map((idea) => {
          return (
            <div
              key={idea.id}
              className={`bg-white rounded-xl border p-5 flex flex-col justify-between space-y-4 shadow-2xs transition-all ${
                idea.isBookmarked 
                  ? 'border-amber-300 ring-1 ring-amber-100' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    {idea.category.replace('_', ' ')}
                  </span>
                  
                  <button
                    onClick={() => toggleBookmark(idea.id)}
                    className="text-slate-400 hover:text-amber-500 transition-colors"
                    aria-label={`Bookmark ${idea.title}`}
                    title={idea.isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}
                  >
                    {idea.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {idea.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {idea.description}
                </p>

                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {idea.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action and Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Impact: <strong className="text-slate-700">{idea.estimatedImpact}</strong>
                </span>

                <button
                  onClick={() => deleteIdea(idea.id)}
                  className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                  title="Remove Idea"
                  aria-label={`Delete ${idea.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Idea Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Custom Creative Idea</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddCustomIdea} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Idea Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Espresso & Beignet Cart"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="decor">Floral &amp; Decor</option>
                    <option value="experience">Guest Experience</option>
                    <option value="food_drink">Food &amp; Bar</option>
                    <option value="entertainment">Music &amp; Entertainment</option>
                    <option value="photo_op">Photo Moments</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Impact Level</label>
                  <select
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="High">High Impact</option>
                    <option value="Medium">Medium Impact</option>
                    <option value="Low">Low Effort</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Concept Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the experience, visuals, or setup..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Nightlife, Interactive, Dessert"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-semibold"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
