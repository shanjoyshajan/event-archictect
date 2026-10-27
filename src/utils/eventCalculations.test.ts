import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBudgetSummary,
  calculateCategoryBreakdown,
  parseTimeToMinutes,
  detectTimelineConflicts,
  formatMinutesToTime,
  calculateDaysRemaining,
  calculateGuestStats,
  formatCurrency,
} from './eventCalculations';
import { BudgetItem, DayOfItem, GuestItem } from '../types/event';

test('calculateBudgetSummary computes accurate financial totals', () => {
  const sampleItems: BudgetItem[] = [
    {
      id: '1',
      category: 'Venue & Rentals',
      name: 'Glasshouse Pavilion',
      estimatedCost: 10000,
      actualCost: 10500,
      paidAmount: 5000,
      status: 'deposit_paid',
    },
    {
      id: '2',
      category: 'Catering & Bar',
      name: 'Plated Dinner & Cocktails',
      estimatedCost: 8000,
      actualCost: 8000,
      paidAmount: 8000,
      status: 'paid',
    },
    {
      id: '3',
      category: 'Photography & Video',
      name: 'Full Day Coverage',
      estimatedCost: 4000,
      actualCost: 0,
      paidAmount: 1000,
      status: 'deposit_paid',
    },
  ];

  const targetBudget = 25000;
  const summary = calculateBudgetSummary(sampleItems, targetBudget);

  assert.equal(summary.targetBudget, 25000);
  assert.equal(summary.totalEstimated, 22000);
  assert.equal(summary.totalActual, 22500); // 10500 + 8000 + 4000 (falls back to estimated for item 3)
  assert.equal(summary.totalPaid, 14000);
  assert.equal(summary.unallocatedBudget, 2500);
  assert.equal(summary.unpaidBalance, 8500);
  assert.equal(summary.isOverBudget, false);
  assert.equal(summary.percentSpent, 90);
});

test('calculateCategoryBreakdown groups and calculates percentages properly', () => {
  const sampleItems: BudgetItem[] = [
    {
      id: '1',
      category: 'Venue & Rentals',
      name: 'Hall Rental',
      estimatedCost: 5000,
      actualCost: 5000,
      paidAmount: 2500,
      status: 'deposit_paid',
    },
    {
      id: '2',
      category: 'Venue & Rentals',
      name: 'Chair & Linen Rentals',
      estimatedCost: 1000,
      actualCost: 1000,
      paidAmount: 1000,
      status: 'paid',
    },
    {
      id: '3',
      category: 'Music & Entertainment',
      name: 'Live Trio Band',
      estimatedCost: 4000,
      actualCost: 4000,
      paidAmount: 2000,
      status: 'deposit_paid',
    },
  ];

  const breakdown = calculateCategoryBreakdown(sampleItems);
  assert.equal(breakdown.length, 2);
  
  const venueCategory = breakdown.find(b => b.category === 'Venue & Rentals');
  assert.ok(venueCategory);
  assert.equal(venueCategory.itemCount, 2);
  assert.equal(venueCategory.actual, 6000);
  assert.equal(venueCategory.percentOfTotal, 60);

  const musicCategory = breakdown.find(b => b.category === 'Music & Entertainment');
  assert.ok(musicCategory);
  assert.equal(musicCategory.itemCount, 1);
  assert.equal(musicCategory.actual, 4000);
  assert.equal(musicCategory.percentOfTotal, 40);
});

test('parseTimeToMinutes handles 24h and 12h AM/PM strings', () => {
  assert.equal(parseTimeToMinutes('09:00'), 540);
  assert.equal(parseTimeToMinutes('9:00 AM'), 540);
  assert.equal(parseTimeToMinutes('13:30'), 810);
  assert.equal(parseTimeToMinutes('1:30 PM'), 810);
  assert.equal(parseTimeToMinutes('12:00 PM'), 720);
  assert.equal(parseTimeToMinutes('12:00 AM'), 0);
});

test('detectTimelineConflicts accurately flags schedule overlaps', () => {
  const schedule: DayOfItem[] = [
    {
      id: 'd1',
      time: '14:00', // 2:00 PM to 3:00 PM (60 min)
      title: 'Ceremony Service',
      durationMinutes: 60,
      leadPerson: 'Officiant',
      location: 'Garden Chapel',
      isCompleted: false,
    },
    {
      id: 'd2',
      time: '14:45', // Starts at 2:45 PM -> Conflict with Ceremony!
      title: 'Family Formal Portraits',
      durationMinutes: 45,
      leadPerson: 'Photographer',
      location: 'Arbor Courtyard',
      isCompleted: false,
    },
    {
      id: 'd3',
      time: '16:00', // 4:00 PM -> Clean, no conflict
      title: 'Cocktail Hour',
      durationMinutes: 60,
      leadPerson: 'Catering Lead',
      location: 'Terrace',
      isCompleted: false,
    },
  ];

  const conflicts = detectTimelineConflicts(schedule);
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].itemAId, 'd1');
  assert.equal(conflicts[0].itemBId, 'd2');
  assert.match(conflicts[0].description, /overlaps with "Family Formal Portraits"/);
});

test('calculateDaysRemaining computes calendar difference correctly', () => {
  const days = calculateDaysRemaining('2026-12-25', '2026-12-20');
  assert.equal(days, 5);

  const pastDays = calculateDaysRemaining('2026-10-01', '2026-10-05');
  assert.equal(pastDays, -4);
});

test('calculateGuestStats tallies attendance and dietary restrictions', () => {
  const sampleGuests: GuestItem[] = [
    {
      id: 'g1',
      name: 'Alice Johnson',
      rsvpStatus: 'attending',
      plusOnes: 1,
      dietaryRestrictions: 'Vegetarian, Gluten-Free',
    },
    {
      id: 'g2',
      name: 'Bob Smith',
      rsvpStatus: 'attending',
      plusOnes: 0,
      dietaryRestrictions: 'Gluten-Free',
    },
    {
      id: 'g3',
      name: 'Charlie Brown',
      rsvpStatus: 'declined',
      plusOnes: 1,
      dietaryRestrictions: 'None',
    },
    {
      id: 'g4',
      name: 'Diana Prince',
      rsvpStatus: 'pending',
      plusOnes: 0,
      dietaryRestrictions: '',
    },
  ];

  const stats = calculateGuestStats(sampleGuests);
  assert.equal(stats.totalInvited, 6); // g1(2) + g2(1) + g3(2) + g4(1) = 6
  assert.equal(stats.totalAttending, 3); // 2 + 1 = 3
  assert.equal(stats.totalDeclined, 2); // 2
  assert.equal(stats.totalPending, 1); // 1
  assert.equal(stats.dietaryCounts['Gluten-Free'], 2);
  assert.equal(stats.dietaryCounts['Vegetarian'], 1);
});

test('formatCurrency formats standard amounts cleanly', () => {
  assert.equal(formatCurrency(15000, 'USD'), '$15,000');
  assert.equal(formatCurrency(0, 'USD'), '$0');
});
