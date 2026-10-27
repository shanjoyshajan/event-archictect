# EventFlow AI — Intelligent GenAI Event & Wedding Planner

> A production-grade, GenAI-powered planning platform engineered to help organizers seamlessly manage **weddings**, **milestone birthdays**, and **community events** with dynamic budgets, run-of-show timelines, intelligent conflict detection, vendor checklists, and personalized creative ideas.

---

## 🎯 Problem Statement Alignment

| Problem Statement Requirement | Implementation in EventFlow AI | Location in Codebase |
| :--- | :--- | :--- |
| **Weddings Organization** | Full wedding blueprint with ceremony, cocktail hour, formal portraits, reception, floral canopy rigging, family seating, and bilingual vows. | `src/data/initialEvents.ts` (`wedding-elena-marcus`) |
| **Birthdays Organization** | Milestone celebrations (e.g. 30th rooftop soirée) with lounge buyouts, DJ booking, decade cocktail flights, and dessert displays. | `src/data/initialEvents.ts` (`birthday-jessica-30th`) |
| **Community Events** | Large-scale civic gatherings (800+ attendees) with city permits, police/EMT details, ADA sanitation, sound stages, and food trucks. | `src/data/initialEvents.ts` (`community-oakridge-festival`) |
| **Dynamic Budgets** | Financial ledger with Target Budget, Estimated, Actual Committed, Paid Out, Unallocated Buffer, category breakdowns, and CSV export. | `src/components/BudgetView.tsx`, `src/utils/eventCalculations.ts` |
| **Timelines & Run-of-Show** | Dual-mode tracking: multi-month preparation countdown + minute-by-minute day-of schedule with lead coordinator assignments. | `src/components/TimelineView.tsx` |
| **Schedule Conflict Detection** | Mathematical timeline analyzer that automatically flags overlapping program items or tight buffers before the event day. | `src/utils/eventCalculations.ts` (`detectTimelineConflicts`) |
| **Vendor Checklists** | Contract status workflow (Researching, Contacted, Proposal Received, Booked), deposit tracking, and balance due calculations. | `src/components/VendorsView.tsx` |
| **AI Vendor RFP Inquiries** | 1-click generator formulating tailored, professional inquiry emails with event specs, dates, headcount, and budget allocations. | `server.ts` (`/api/gemini/vendor-inquiry`), `VendorsView.tsx` |
| **Personalized Creative Ideas** | Curated theme concepts, decor installations, interactive guest experiences, signature cocktail pairings, and custom bookmarks. | `src/components/IdeasView.tsx`, `server.ts` (`/api/gemini/ideas`) |
| **Day-of Troubleshooter** | Real-time crisis response triage providing immediate 5-minute protocols, guest-facing scripts, and operational pivots. | `server.ts` (`/api/gemini/troubleshoot`), `AiAssistantModal.tsx` |
| **Speech & Invite Copywriter** | Generates personalized vows, wedding toasts, formal invitation text, and RSVP follow-up reminders with delivery pacing advice. | `server.ts` (`/api/gemini/copywriter`), `AiAssistantModal.tsx` |
| **Printable Run-of-Show Export** | Official master itinerary packet with emergency contact directory, vendor sheet, and browser print / PDF export support. | `src/components/ExportSummaryModal.tsx` |

---

## 🌟 Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend & Server-Side AI**: Node.js, Express, tsx.
- **AI SDK**: `@google/genai` (v2.4.0) utilizing `gemini-3.8-flash`.
- **Testing**: Built-in `node:test` and `node:assert/strict` with zero external test bloat.
- **Design System**: Domain-native typography (`Plus Jakarta Sans`), tabular figures (`tabular-nums`), zero-pill metadata discipline, and high-fidelity photography assets.

---

## 📁 Project Directory Structure

```text
├── index.html                   # HTML entry point with synchronized SEO meta
├── metadata.json                # AI Studio capability configuration
├── package.json                 # Scripts, dependencies, and type definitions
├── server.ts                    # Express API endpoints for Gemini + Vite dev middleware
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite bundler configuration
├── src/
│   ├── App.tsx                  # Root state orchestration & navigation controller
│   ├── index.css                # Tailwind CSS v4 base configuration & fonts
│   ├── main.tsx                 # React application mounting
│   ├── types/
│   │   └── event.ts             # Strongly-typed TypeScript interfaces
│   ├── utils/
│   │   ├── eventCalculations.ts # Decoupled pure logic (budgets, conflicts, stats)
│   │   └── eventCalculations.test.ts # Fast-feedback unit tests (7 tests passing)
│   ├── data/
│   │   └── initialEvents.ts     # Realistic seed data for Wedding, Birthday & Community
│   ├── assets/images/           # High-fidelity visual theme assets
│   └── components/
│       ├── Navigation.tsx       # Top bar contract & active event switcher
│       ├── OverviewView.tsx     # High-level command center with KPI metric cards
│       ├── BudgetView.tsx       # Interactive financial ledger & category breakdown
│       ├── TimelineView.tsx     # Dual-mode timeline & conflict detection
│       ├── VendorsView.tsx      # Vendor hub & 1-click AI RFP generator
│       ├── IdeasView.tsx        # Personalized ideas, mood board & bookmarking
│       ├── GuestsView.tsx       # Guest list, RSVP tracking & dietary stats
│       ├── AiAssistantModal.tsx # Multi-tool GenAI powerhouse (4 distinct modes)
│       ├── NewEventModal.tsx    # Event creation with AI auto-generation
│       └── ExportSummaryModal.tsx # Printable master itinerary & PDF exporter
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js >= 18.0.0
- npm or bun

### 2. Installation
```bash
# Clone the repository
git clone <your-repository-url>
cd eventflow-ai

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (or use `.env.example`):
```bash
# Optional: Set your Gemini API key for live LLM responses.
# If omitted, EventFlow AI seamlessly activates its intelligent fallback generators.
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Verification & Unit Tests
```bash
# Run unit tests
npm test

# Run TypeScript type check
npm run lint

# Build for production
npm run build
```

---

## 🧪 Unit Test Suite (`node:test`)

Core logic is decoupled into pure functions and covered by unit tests in `src/utils/eventCalculations.test.ts`:

- `calculateBudgetSummary`: Verifies exact sums of estimated, actual, and paid amounts, unallocated cushion, and over-budget triggers.
- `calculateCategoryBreakdown`: Tests categorization math and percentage calculations.
- `parseTimeToMinutes`: Tests parsing of 12h AM/PM and 24h formats into absolute timeline minutes.
- `detectTimelineConflicts`: Validates schedule overlap detection and conflicting time slots.
- `calculateDaysRemaining`: Verifies calendar countdown calculations.
- `calculateGuestStats`: Tests attendance tallying and dietary restrictions breakdown.
- `formatCurrency`: Verifies clean currency formatting with tabular numerals.

---

## 📦 Submission Compliance Checklist

- [x] **Problem Statement Alignment**: Comprehensive coverage of Weddings, Birthdays, and Community events with budgets, timelines, vendors, and personalized ideas.
- [x] **Code Quality & Cleanliness**: 100% strict TypeScript types, zero type errors (`tsc --noEmit`), clean modular components.
- [x] **Repository Size**: Less than 10 MB total size (`.gitignore` excludes `node_modules`, `dist`, `.playwright-cli`, and build artifacts).
- [x] **Public Accessibility**: Ready for public GitHub repository hosting.
- [x] **Resilience**: Zero-crash architecture with graceful server-side timeout wrappers and high-fidelity fallbacks.

---

## 🎥 Video Demonstration Guide

For hackathon video submissions (YouTube Unlisted or Google Drive with public access):
1. **Introduction (0:00 - 0:30)**: Overview of EventFlow AI and the problem statement (Weddings, Birthdays, Community Events).
2. **Event Switcher & Overview (0:30 - 1:00)**: Demonstrate Elena & Marcus's Wedding, Jessica's 30th Birthday, and Oakridge Community Festival with countdowns and KPI metrics.
3. **Dynamic Budget Planner (1:00 - 1:45)**: Show financial ledger, category breakdown bars, inline status toggles, and CSV export.
4. **Timeline & Conflict Detection (1:45 - 2:30)**: Toggle between preparation milestones and day-of run of show; highlight the active schedule conflict detection alert.
5. **Vendor Hub & AI RFP Drafter (2:30 - 3:15)**: Show vendor contracts, deposit balances, and click "Draft AI Inquiry" to produce a customized RFP email.
6. **GenAI Suite & Day-of Troubleshooter (3:15 - 4:15)**: Open AI Assistant; demonstrate Event Blueprint generator, Speech Copywriter (vows/toasts), and Day-of Emergency Troubleshooter.
7. **Export & Print (4:15 - 4:45)**: Open Master Itinerary Packet, demonstrate Markdown copy/download and browser print view.
