import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Download, 
  Check, 
  Trash2, 
  Search,
  Filter,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { BudgetItem, BudgetCategory, EventPlan } from '../types/event';
import { 
  calculateBudgetSummary, 
  calculateCategoryBreakdown, 
  formatCurrency 
} from '../utils/eventCalculations';

interface BudgetViewProps {
  event: EventPlan;
  onUpdateBudgetItems: (items: BudgetItem[]) => void;
  onOpenAiAssistant: (mode?: string) => void;
}

const CATEGORIES: BudgetCategory[] = [
  'Venue & Rentals',
  'Catering & Bar',
  'Photography & Video',
  'Music & Entertainment',
  'Floral & Decor',
  'Attire & Beauty',
  'Invitations & Collateral',
  'Permits, Safety & Logistics',
  'Gifts & Favors',
  'Contingency & Buffer',
];

export const BudgetView: React.FC<BudgetViewProps> = ({
  event,
  onUpdateBudgetItems,
  onOpenAiAssistant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Item Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<BudgetCategory>('Venue & Rentals');
  const [newEstimated, setNewEstimated] = useState<number>(1000);
  const [newActual, setNewActual] = useState<number>(0);
  const [newPaid, setNewPaid] = useState<number>(0);
  const [newVendor, setNewVendor] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const summary = calculateBudgetSummary(event.budgetItems, event.targetBudget);
  const breakdown = calculateCategoryBreakdown(event.budgetItems);

  // Filter items
  const filteredItems = event.budgetItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: BudgetItem = {
      id: `custom-b-${Date.now()}`,
      category: newCategory,
      name: newName.trim(),
      estimatedCost: Number(newEstimated) || 0,
      actualCost: Number(newActual) || 0,
      paidAmount: Number(newPaid) || 0,
      status: Number(newPaid) >= (Number(newActual) || Number(newEstimated)) && Number(newPaid) > 0 
        ? 'paid' 
        : Number(newPaid) > 0 ? 'deposit_paid' : 'planned',
      vendorName: newVendor.trim() || undefined,
      dueDate: newDueDate || undefined,
      notes: newNotes.trim() || undefined,
    };

    onUpdateBudgetItems([...event.budgetItems, newItem]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewName('');
    setNewCategory('Venue & Rentals');
    setNewEstimated(1000);
    setNewActual(0);
    setNewPaid(0);
    setNewVendor('');
    setNewDueDate('');
    setNewNotes('');
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to remove this expense item?')) {
      onUpdateBudgetItems(event.budgetItems.filter(i => i.id !== id));
    }
  };

  const handleTogglePaid = (item: BudgetItem) => {
    const targetAmount = item.actualCost > 0 ? item.actualCost : item.estimatedCost;
    const updated = event.budgetItems.map(i => {
      if (i.id !== item.id) return i;
      const isCurrentlyPaid = i.status === 'paid';
      return {
        ...i,
        paidAmount: isCurrentlyPaid ? 0 : targetAmount,
        status: (isCurrentlyPaid ? 'planned' : 'paid') as BudgetItem['status'],
      };
    });
    onUpdateBudgetItems(updated);
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Item Name', 'Estimated Cost', 'Actual Cost', 'Paid Amount', 'Status', 'Vendor', 'Due Date', 'Notes'];
    const rows = event.budgetItems.map(item => [
      `"${item.category}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      item.estimatedCost,
      item.actualCost,
      item.paidAmount,
      item.status,
      `"${(item.vendorName || '').replace(/"/g, '""')}"`,
      item.dueDate || '',
      `"${(item.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.title.toLowerCase().replace(/\s+/g, '_')}_budget.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Event Budget &amp; Expenses</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage target allocations, quotes, deposit deadlines, and vendor payment statuses.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenAiAssistant('blueprint')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Budget Optimizer</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            aria-label="Export Budget as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Target Budget</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            {formatCurrency(summary.targetBudget, event.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Cap target</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Estimated Total</div>
          <div className="text-xl font-bold text-slate-800 tabular-nums mt-1">
            {formatCurrency(summary.totalEstimated, event.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Initial projection</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Actual Committed</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            {formatCurrency(summary.totalActual, event.currency)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
            {summary.percentSpent}% of budget
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Total Paid Out</div>
          <div className="text-xl font-bold text-emerald-700 tabular-nums mt-1">
            {formatCurrency(summary.totalPaid, event.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 tabular-nums">
            {formatCurrency(summary.unpaidBalance, event.currency)} balance due
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
          <div className="text-xs text-slate-500">Unallocated Buffer</div>
          <div className={`text-xl font-bold tabular-nums mt-1 ${summary.unallocatedBudget < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {formatCurrency(summary.unallocatedBudget, event.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {summary.unallocatedBudget < 0 ? 'Over budget!' : 'Remaining cushion'}
          </div>
        </div>
      </div>

      {/* Category Spending Bars */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
          Category Allocation Breakdown
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {breakdown.map((cat) => (
            <div key={cat.category} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 truncate max-w-[140px]">{cat.category}</span>
                <span className="text-slate-700 font-semibold tabular-nums">
                  {formatCurrency(cat.actual || cat.estimated, event.currency)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-slate-800 h-full rounded-full"
                  style={{ width: `${Math.min(100, cat.percentOfTotal * 1.5)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{cat.itemCount} items</span>
                <span>{cat.percentOfTotal}% of total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, vendors, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:bg-white focus:outline-none"
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:bg-white focus:outline-none"
            aria-label="Filter by payment status"
          >
            <option value="all">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="deposit_paid">Deposit Paid</option>
            <option value="paid">Fully Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* High-Density Expense Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Item &amp; Category</th>
                <th className="py-2.5 px-4">Vendor &amp; Notes</th>
                <th className="py-2.5 px-4 text-right">Estimated</th>
                <th className="py-2.5 px-4 text-right">Actual</th>
                <th className="py-2.5 px-4 text-right">Paid</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const effectiveCost = item.actualCost > 0 ? item.actualCost : item.estimatedCost;
                  const isPaid = item.status === 'paid';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.category}</div>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-medium text-slate-700">{item.vendorName || '—'}</div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-500 truncate" title={item.notes}>
                            {item.notes}
                          </div>
                        )}
                        {item.dueDate && (
                          <div className="text-[10px] text-amber-700">Due: {item.dueDate}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                        {formatCurrency(item.estimatedCost, event.currency)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                        {formatCurrency(effectiveCost, event.currency)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700 font-medium">
                        {formatCurrency(item.paidAmount, event.currency)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          item.status === 'paid' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : item.status === 'deposit_paid'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : item.status === 'overdue'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleTogglePaid(item)}
                            title={isPaid ? 'Mark as Unpaid' : 'Mark as Fully Paid'}
                            className={`p-1.5 rounded transition-colors ${
                              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            aria-label={`Toggle paid status for ${item.name}`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            title="Delete Item"
                            className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                    No expense items match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add New Expense Item</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Cake & Dessert Tier"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as BudgetCategory)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Vendor / Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g. Sweet Artistry Bakery"
                    value={newVendor}
                    onChange={(e) => setNewVendor(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Estimated ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newEstimated}
                    onChange={(e) => setNewEstimated(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Actual Quote ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newActual}
                    onChange={(e) => setNewActual(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Deposit Paid ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPaid}
                    onChange={(e) => setNewPaid(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Notes / Inclusions</label>
                <textarea
                  rows={2}
                  placeholder="Inclusions, delivery windows, payment terms..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-2xs"
                >
                  Add to Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
