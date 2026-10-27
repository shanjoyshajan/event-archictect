import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  Plus, 
  Sparkles, 
  Trash2, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { VendorItem, VendorStatus, EventPlan } from '../types/event';
import { formatCurrency } from '../utils/eventCalculations';

interface VendorsViewProps {
  event: EventPlan;
  onUpdateVendors: (vendors: VendorItem[]) => void;
  onOpenAiAssistant: (mode?: string) => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({
  event,
  onUpdateVendors,
  onOpenAiAssistant,
}) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);

  // AI RFP Modal State
  const [isRfpModalOpen, setIsRfpModalOpen] = useState(false);
  const [rfpVendor, setRfpVendor] = useState<VendorItem | null>(null);
  const [rfpLoading, setRfpLoading] = useState(false);
  const [rfpResult, setRfpResult] = useState<{ subject: string; body: string } | null>(null);
  const [rfpCopied, setRfpCopied] = useState(false);

  // New Vendor Form
  const [vBusiness, setVBusiness] = useState('');
  const [vCategory, setVCategory] = useState('Catering & Bar');
  const [vContact, setVContact] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vQuote, setVQuote] = useState<number>(2000);
  const [vDeposit, setVDeposit] = useState<number>(0);
  const [vStatus, setVStatus] = useState<VendorStatus>('researching');
  const [vNotes, setVNotes] = useState('');

  const filteredVendors = event.vendors.filter(v => 
    selectedStatusFilter === 'all' || v.status === selectedStatusFilter
  );

  const totalQuoted = event.vendors.reduce((sum, v) => sum + (v.quotedAmount || 0), 0);
  const totalDeposited = event.vendors.reduce((sum, v) => sum + (v.depositAmount || 0), 0);
  const totalBalanceDue = Math.max(0, totalQuoted - totalDeposited);

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vBusiness.trim()) return;

    const newVendor: VendorItem = {
      id: `vendor-${Date.now()}`,
      businessName: vBusiness.trim(),
      category: vCategory,
      contactName: vContact.trim() || 'Lead Representative',
      email: vEmail.trim() || 'info@vendor.com',
      phone: vPhone.trim() || '(555) 000-0000',
      quotedAmount: Number(vQuote) || 0,
      depositAmount: Number(vDeposit) || 0,
      balancePaid: Number(vDeposit) || 0,
      status: vStatus,
      contractNotes: vNotes.trim() || undefined,
    };

    onUpdateVendors([...event.vendors, newVendor]);
    setIsAddVendorModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setVBusiness('');
    setVCategory('Catering & Bar');
    setVContact('');
    setVEmail('');
    setVPhone('');
    setVQuote(2000);
    setVDeposit(0);
    setVStatus('researching');
    setVNotes('');
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('Remove this vendor from your event plan?')) {
      onUpdateVendors(event.vendors.filter(v => v.id !== id));
    }
  };

  const handleUpdateStatus = (id: string, status: VendorStatus) => {
    const updated = event.vendors.map(v => 
      v.id === id ? { ...v, status } : v
    );
    onUpdateVendors(updated);
  };

  const handleOpenRfp = async (vendor: VendorItem) => {
    setRfpVendor(vendor);
    setIsRfpModalOpen(true);
    setRfpLoading(true);
    setRfpCopied(false);
    setRfpResult(null);

    try {
      const res = await fetch('/api/gemini/vendor-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorCategory: vendor.category,
          businessName: vendor.businessName,
          eventType: event.type,
          date: event.date,
          guestCount: event.guestCount,
          location: event.location,
          budgetAllocation: vendor.quotedAmount,
          specialRequests: vendor.contractNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate RFP');
      const data = await res.json();
      setRfpResult(data);
    } catch (err) {
      console.error(err);
      setRfpResult({
        subject: `Inquiry: ${vendor.category} services for ${event.title} on ${event.date}`,
        body: `Dear ${vendor.contactName || vendor.businessName},\n\nWe are currently planning our ${event.type} on ${event.date} at ${event.location} with approximately ${event.guestCount} guests. We are very interested in learning more about your packages and availability.\n\nOur target allocation is approximately $${vendor.quotedAmount.toLocaleString()}.\n\nCould you please let us know your availability and send over your brochure?\n\nBest regards,\nEvent Planning Team`,
      });
    } finally {
      setRfpLoading(false);
    }
  };

  const handleCopyRfp = () => {
    if (!rfpResult) return;
    const textToCopy = `Subject: ${rfpResult.subject}\n\n${rfpResult.body}`;
    navigator.clipboard.writeText(textToCopy);
    setRfpCopied(true);
    setTimeout(() => setRfpCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Vendor Hub &amp; Checklists</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track inquiries, quotes, deposit balances, and generate custom AI RFP inquiry emails.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddVendorModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Contracted Vendors</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            {event.vendors.filter(v => v.status === 'booked').length} / {event.vendors.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Booked / Total</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Total Quoted</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            {formatCurrency(totalQuoted, event.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Committed contracts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Deposits Paid</div>
          <div className="text-xl font-bold text-emerald-700 tabular-nums mt-1">
            {formatCurrency(totalDeposited, event.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Secured retainers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Balance Remaining</div>
          <div className="text-xl font-bold text-slate-800 tabular-nums mt-1">
            {formatCurrency(totalBalanceDue, event.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Due before / day-of</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['all', 'researching', 'contacted', 'proposal_received', 'booked'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap capitalize ${
              selectedStatusFilter === status
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => {
          const balance = Math.max(0, vendor.quotedAmount - vendor.depositAmount);

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                      {vendor.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {vendor.businessName}
                    </h3>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={vendor.status}
                    onChange={(e) => handleUpdateStatus(vendor.id, e.target.value as VendorStatus)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border focus:outline-none ${
                      vendor.status === 'booked'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : vendor.status === 'contacted'
                        ? 'bg-sky-50 text-sky-800 border-sky-200'
                        : vendor.status === 'proposal_received'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal_received">Proposal Received</option>
                    <option value="booked">Booked</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="font-medium text-slate-700">Contact: {vendor.contactName}</div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vendor.phone}</span>
                  </div>
                </div>

                {/* Contract Notes */}
                {vendor.contractNotes && (
                  <div className="mt-3 p-2 bg-slate-50 rounded text-[11px] text-slate-600 border border-slate-100">
                    {vendor.contractNotes}
                  </div>
                )}
              </div>

              {/* Financials & Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Quote</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(vendor.quotedAmount, event.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Paid</span>
                    <span className="font-semibold text-emerald-700 tabular-nums">
                      {formatCurrency(vendor.depositAmount, event.currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Balance Due</span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      {formatCurrency(balance, event.currency)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => handleOpenRfp(vendor)}
                    className="flex-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5"
                    aria-label={`Draft AI inquiry email for ${vendor.businessName}`}
                  >
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Draft AI Inquiry</span>
                  </button>

                  <button
                    onClick={() => handleDeleteVendor(vendor.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete Vendor"
                    aria-label={`Delete ${vendor.businessName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vendor Modal */}
      {isAddVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Add New Vendor</h3>
              <button onClick={() => setIsAddVendorModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddVendor} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sylvan Floral Co."
                  value={vBusiness}
                  onChange={(e) => setVBusiness(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={vCategory}
                    onChange={(e) => setVCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={vStatus}
                    onChange={(e) => setVStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  >
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal_received">Proposal Received</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Elena Smith"
                    value={vContact}
                    onChange={(e) => setVContact(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="contact@vendor.com"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Quoted Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={vQuote}
                    onChange={(e) => setVQuote(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Deposit Paid ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={vDeposit}
                    onChange={(e) => setVDeposit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Contract Terms / Inquiry Questions</label>
                <textarea
                  rows={2}
                  placeholder="Inclusions, load-in hours, sound restrictions..."
                  value={vNotes}
                  onChange={(e) => setVNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddVendorModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-semibold"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI RFP Inquiry Drafter Modal */}
      {isRfpModalOpen && rfpVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  AI Vendor Inquiry Email: {rfpVendor.businessName}
                </h3>
              </div>
              <button
                onClick={() => setIsRfpModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                ✕
              </button>
            </div>

            {rfpLoading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs text-slate-600 font-medium">
                  Generating customized RFP email tailored to {event.title}...
                </div>
              </div>
            ) : rfpResult ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Line</label>
                  <input
                    type="text"
                    readOnly
                    value={rfpResult.subject}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Body</label>
                  <textarea
                    rows={10}
                    readOnly
                    value={rfpResult.body}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono text-[11px] leading-relaxed"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Send to: <strong className="text-slate-700">{rfpVendor.email}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyRfp}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      {rfpCopied ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
};
