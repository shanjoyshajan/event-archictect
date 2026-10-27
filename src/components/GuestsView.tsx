import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Utensils 
} from 'lucide-react';
import { GuestItem, EventPlan } from '../types/event';
import { calculateGuestStats } from '../utils/eventCalculations';

interface GuestsViewProps {
  event: EventPlan;
  onUpdateGuests: (guests: GuestItem[]) => void;
}

export const GuestsView: React.FC<GuestsViewProps> = ({
  event,
  onUpdateGuests,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Guest Form
  const [gName, setGName] = useState('');
  const [gEmail, setGEmail] = useState('');
  const [gStatus, setGStatus] = useState<GuestItem['rsvpStatus']>('pending');
  const [gPlusOnes, setGPlusOnes] = useState<number>(0);
  const [gDiet, setGDiet] = useState('');
  const [gTable, setGTable] = useState('');

  const stats = calculateGuestStats(event.guests);

  const filteredGuests = event.guests.filter(g => {
    const matchesSearch = !searchQuery || 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.tableOrGroup && g.tableOrGroup.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || g.rsvpStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gName.trim()) return;

    const newGuest: GuestItem = {
      id: `guest-${Date.now()}`,
      name: gName.trim(),
      email: gEmail.trim() || undefined,
      rsvpStatus: gStatus,
      plusOnes: Number(gPlusOnes) || 0,
      dietaryRestrictions: gDiet.trim() || 'None',
      tableOrGroup: gTable.trim() || undefined,
    };

    onUpdateGuests([...event.guests, newGuest]);
    setIsAddModalOpen(false);
    setGName('');
    setGEmail('');
    setGPlusOnes(0);
    setGDiet('');
    setGTable('');
  };

  const handleToggleStatus = (id: string, newStatus: GuestItem['rsvpStatus']) => {
    const updated = event.guests.map(g => 
      g.id === id ? { ...g, rsvpStatus: newStatus } : g
    );
    onUpdateGuests(updated);
  };

  const handleDeleteGuest = (id: string) => {
    if (confirm('Remove this guest from the invitation list?')) {
      onUpdateGuests(event.guests.filter(g => g.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Guest List &amp; RSVPs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage attendance headcounts, dietary requirements, plus-ones, and seating arrangements.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Guest / Party</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Total Headcount</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            {stats.totalInvited}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Capacity target: {event.guestCount}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Confirmed Attending</div>
          <div className="text-xl font-bold text-emerald-700 tabular-nums mt-1">
            {stats.totalAttending}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.totalInvited > 0 ? Math.round((stats.totalAttending / stats.totalInvited) * 100) : 0}% attendance rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Awaiting Response</div>
          <div className="text-xl font-bold text-amber-700 tabular-nums mt-1">
            {stats.totalPending}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Pending RSVPs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Regretfully Declined</div>
          <div className="text-xl font-bold text-slate-500 tabular-nums mt-1">
            {stats.totalDeclined}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cannot attend</div>
        </div>
      </div>

      {/* Dietary Requirements Summary */}
      {Object.keys(stats.dietaryCounts).length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 shadow-2xs text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <Utensils className="w-3.5 h-3.5 text-slate-400" />
            <span>Special Catering Requirements:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(stats.dietaryCounts).map(([diet, count]) => (
              <span key={diet} className="px-2.5 py-1 bg-slate-100 rounded text-slate-700 font-medium">
                {diet}: <strong className="tabular-nums font-bold text-slate-900">{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guest name, email, table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'attending', 'pending', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap capitalize ${
                statusFilter === status
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Guest / Party Name</th>
                <th className="py-2.5 px-4">Contact</th>
                <th className="py-2.5 px-4 text-center">Party Size</th>
                <th className="py-2.5 px-4">Dietary Notes</th>
                <th className="py-2.5 px-4">Table / Group</th>
                <th className="py-2.5 px-4 text-center">RSVP Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => {
                  return (
                    <tr key={guest.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {guest.name}
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {guest.email || '—'}
                      </td>

                      <td className="py-3 px-4 text-center tabular-nums text-slate-700 font-medium">
                        1 {guest.plusOnes > 0 && `+ ${guest.plusOnes}`}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {guest.dietaryRestrictions && guest.dietaryRestrictions !== 'None' ? (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                            {guest.dietaryRestrictions}
                          </span>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {guest.tableOrGroup || 'Unassigned'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <select
                          value={guest.rsvpStatus}
                          onChange={(e) => handleToggleStatus(guest.id, e.target.value as any)}
                          className={`text-[11px] font-semibold px-2 py-1 rounded border focus:outline-none ${
                            guest.rsvpStatus === 'attending'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : guest.rsvpStatus === 'declined'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="attending">Attending</option>
                          <option value="pending">Pending</option>
                          <option value="declined">Declined</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Remove Guest"
                          aria-label={`Remove ${guest.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                    No guests match your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add Guest to Invitation List</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Guest / Family Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur &amp; Jane Pendelton"
                  value={gName}
                  onChange={(e) => setGName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={gEmail}
                    onChange={(e) => setGEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Additional Plus-Ones</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={gPlusOnes}
                    onChange={(e) => setGPlusOnes(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">RSVP Status</label>
                  <select
                    value={gStatus}
                    onChange={(e) => setGStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="attending">Attending</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Table / Seating Group</label>
                  <input
                    type="text"
                    placeholder="e.g. Table 2 or Family VIP"
                    value={gTable}
                    onChange={(e) => setGTable(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Dietary Restrictions</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Gluten-Free, Halal, Nut Allergy"
                  value={gDiet}
                  onChange={(e) => setGDiet(e.target.value)}
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
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
