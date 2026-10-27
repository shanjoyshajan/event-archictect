import { BudgetItem, DayOfItem, GuestItem, MilestoneItem } from '../types/event';

export interface BudgetSummary {
  targetBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  unallocatedBudget: number;
  unpaidBalance: number;
  percentSpent: number;
  isOverBudget: boolean;
}

export interface CategoryBreakdown {
  category: string;
  estimated: number;
  actual: number;
  paid: number;
  itemCount: number;
  percentOfTotal: number;
}

export interface TimelineConflict {
  itemAId: string;
  itemBId: string;
  description: string;
  type: 'overlap' | 'tight_buffer';
}

export interface TimelineStats {
  totalMilestones: number;
  completedMilestones: number;
  milestonePercent: number;
  totalDayOfItems: number;
  completedDayOfItems: number;
  daysRemaining: number;
  isPast: boolean;
}

export interface GuestStats {
  totalInvited: number;
  totalAttending: number;
  totalDeclined: number;
  totalPending: number;
  dietaryCounts: Record<string, number>;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const safeAmount = isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

export function calculateBudgetSummary(items: BudgetItem[], targetBudget: number): BudgetSummary {
  const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const totalActual = items.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const totalPaid = items.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  
  const effectiveCost = totalActual > 0 ? totalActual : totalEstimated;
  const unallocatedBudget = targetBudget - effectiveCost;
  const unpaidBalance = Math.max(0, effectiveCost - totalPaid);
  const percentSpent = targetBudget > 0 ? Math.round((effectiveCost / targetBudget) * 100) : 0;
  const isOverBudget = effectiveCost > targetBudget;

  return {
    targetBudget,
    totalEstimated,
    totalActual,
    totalPaid,
    unallocatedBudget,
    unpaidBalance,
    percentSpent,
    isOverBudget,
  };
}

export function calculateCategoryBreakdown(items: BudgetItem[]): CategoryBreakdown[] {
  const map: Record<string, { estimated: number; actual: number; paid: number; count: number }> = {};
  
  let grandTotal = 0;
  for (const item of items) {
    if (!map[item.category]) {
      map[item.category] = { estimated: 0, actual: 0, paid: 0, count: 0 };
    }
    const cost = item.actualCost > 0 ? item.actualCost : item.estimatedCost;
    map[item.category].estimated += item.estimatedCost || 0;
    map[item.category].actual += item.actualCost || 0;
    map[item.category].paid += item.paidAmount || 0;
    map[item.category].count += 1;
    grandTotal += cost;
  }

  return Object.entries(map).map(([category, data]) => {
    const cost = data.actual > 0 ? data.actual : data.estimated;
    const percentOfTotal = grandTotal > 0 ? Math.round((cost / grandTotal) * 100) : 0;
    return {
      category,
      estimated: data.estimated,
      actual: data.actual,
      paid: data.paid,
      itemCount: data.count,
      percentOfTotal,
    };
  }).sort((a, b) => b.estimated - a.estimated);
}

export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  // Handles "14:30", "2:30 PM", "9:00 AM", "09:00"
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const parts = clean.replace(/[A-Z]/g, '').trim().split(':');
  
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function detectTimelineConflicts(items: DayOfItem[]): TimelineConflict[] {
  const conflicts: TimelineConflict[] = [];
  const sorted = [...items].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      const a = sorted[i];
      const b = sorted[j];
      
      const startA = parseTimeToMinutes(a.time);
      const endA = startA + (a.durationMinutes || 30);
      const startB = parseTimeToMinutes(b.time);
      const endB = startB + (b.durationMinutes || 30);

      // Overlap detection
      if (startB < endA) {
        conflicts.push({
          itemAId: a.id,
          itemBId: b.id,
          description: `"${a.title}" ends at ${formatMinutesToTime(endA)}, which overlaps with "${b.title}" starting at ${b.time}.`,
          type: 'overlap',
        });
      }
    }
  }

  return conflicts;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const safeMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(safeMinutes / 60);
  const mins = safeMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${mins.toString().padStart(2, '0')} ${period}`;
}

export function calculateDaysRemaining(targetDateStr: string, referenceDateStr?: string): number {
  if (!targetDateStr) return 0;
  const target = new Date(targetDateStr);
  const ref = referenceDateStr ? new Date(referenceDateStr) : new Date();
  
  target.setHours(0, 0, 0, 0);
  ref.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - ref.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTimelineStats(
  milestones: MilestoneItem[],
  dayOfSchedule: DayOfItem[],
  eventDateStr: string
): TimelineStats {
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.isCompleted).length;
  const milestonePercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const totalDayOfItems = dayOfSchedule.length;
  const completedDayOfItems = dayOfSchedule.filter(d => d.isCompleted).length;

  const daysRemaining = calculateDaysRemaining(eventDateStr);

  return {
    totalMilestones,
    completedMilestones,
    milestonePercent,
    totalDayOfItems,
    completedDayOfItems,
    daysRemaining,
    isPast: daysRemaining < 0,
  };
}

export function calculateGuestStats(guests: GuestItem[]): GuestStats {
  let totalInvited = 0;
  let totalAttending = 0;
  let totalDeclined = 0;
  let totalPending = 0;
  const dietaryCounts: Record<string, number> = {};

  for (const guest of guests) {
    const count = 1 + (guest.plusOnes || 0);
    totalInvited += count;

    if (guest.rsvpStatus === 'attending') {
      totalAttending += count;
      if (guest.dietaryRestrictions && guest.dietaryRestrictions !== 'None') {
        const dietList = guest.dietaryRestrictions.split(',').map(s => s.trim());
        for (const diet of dietList) {
          if (!diet) continue;
          dietaryCounts[diet] = (dietaryCounts[diet] || 0) + 1;
        }
      }
    } else if (guest.rsvpStatus === 'declined') {
      totalDeclined += count;
    } else {
      totalPending += count;
    }
  }

  return {
    totalInvited,
    totalAttending,
    totalDeclined,
    totalPending,
    dietaryCounts,
  };
}
