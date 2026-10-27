export type EventType = 'wedding' | 'birthday' | 'community' | 'custom';

export type BudgetCategory = 
  | 'Venue & Rentals'
  | 'Catering & Bar'
  | 'Photography & Video'
  | 'Music & Entertainment'
  | 'Floral & Decor'
  | 'Attire & Beauty'
  | 'Invitations & Collateral'
  | 'Permits, Safety & Logistics'
  | 'Gifts & Favors'
  | 'Contingency & Buffer';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: 'planned' | 'deposit_paid' | 'paid' | 'overdue';
  vendorName?: string;
  dueDate?: string;
  notes?: string;
}

export type TimelinePhase = 
  | '12_months'
  | '6_months'
  | '3_months'
  | '1_month'
  | 'final_weeks'
  | 'post_event';

export interface MilestoneItem {
  id: string;
  title: string;
  targetDate: string;
  phase: TimelinePhase;
  category: string;
  isCompleted: boolean;
  assignedTo?: string;
  notes?: string;
}

export interface DayOfItem {
  id: string;
  time: string; // e.g. "14:00" or "02:00 PM"
  endTime?: string;
  title: string;
  durationMinutes: number;
  leadPerson: string;
  location: string;
  notes?: string;
  isCompleted: boolean;
}

export type VendorStatus = 
  | 'researching'
  | 'contacted'
  | 'proposal_received'
  | 'booked'
  | 'declined';

export interface VendorItem {
  id: string;
  category: BudgetCategory | string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  status: VendorStatus;
  quotedAmount: number;
  depositAmount: number;
  balancePaid: number;
  contractNotes?: string;
}

export interface CreativeIdea {
  id: string;
  category: 'theme' | 'decor' | 'experience' | 'food_drink' | 'entertainment' | 'photo_op';
  title: string;
  description: string;
  estimatedImpact: 'High' | 'Medium' | 'Low';
  tags: string[];
  isBookmarked: boolean;
  suggestedAction?: string;
}

export interface GuestItem {
  id: string;
  name: string;
  email?: string;
  rsvpStatus: 'attending' | 'declined' | 'pending';
  plusOnes: number;
  dietaryRestrictions: string;
  tableOrGroup?: string;
  notes?: string;
}

export interface EventPlan {
  id: string;
  title: string;
  type: EventType;
  date: string;
  location: string;
  guestCount: number;
  targetBudget: number;
  currency: string;
  styleTheme: string;
  culturalNotes?: string;
  description: string;
  coverImage?: string;
  budgetItems: BudgetItem[];
  milestones: MilestoneItem[];
  dayOfSchedule: DayOfItem[];
  vendors: VendorItem[];
  creativeIdeas: CreativeIdea[];
  guests: GuestItem[];
  emergencyContacts: { role: string; name: string; phone: string }[];
  createdAt: string;
  updatedAt: string;
}
