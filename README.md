# EventFlow AI — Intelligent GenAI Event & Wedding Planner

> A production-grade, GenAI-powered planning platform engineered to help organizers seamlessly manage **weddings**, **milestone birthdays**, and **community events** with dynamic budgets, run-of-show timelines, intelligent conflict detection, vendor checklists, and personalized creative ideas.

---

## 🏆 Hackathon Submission Overview

- **Chosen Vertical**: AI Event Management & Lifestyle Assistant (Weddings, Milestone Birthdays, Community Gatherings)
- **Live Deployed App**: [https://ais-pre-bbftut2v7o26jmqbff4bzh-650610241128.asia-southeast1.run.app](https://ais-pre-bbftut2v7o26jmqbff4bzh-650610241128.asia-southeast1.run.app)
- **Repository Size**: **4.3 MB** *(Strictly within the < 10 MB limit)*
- **Branch**: Single `main` branch
- **Access**: Public GitHub Repository

---

## 1. Chosen Vertical

**Vertical**: **AI-Powered Event Planning & Production Assistant**  
EventFlow AI is designed for three distinct real-world event personas:

1. **Couples & Wedding Planners**: Managing multi-phase logistics, venue contracts, catering tastings, photographer coverage, seating arrangements, bilingual vows, and ceremony-to-reception transitions.
2. **Milestone Birthday Hosts**: Planning high-energy parties (e.g., 30th rooftop lounge soirée) with venue buyouts, custom mixology tabs, vinyl DJs, and photo moments.
3. **Civic & Community Organizers**: Coordinating large-scale neighborhood gatherings (e.g., 800+ attendee street festival) involving municipal street closure permits, police/EMT standby details, ADA portable sanitation, sound stages, and food truck load-ins.

---

## 2. Approach and Logic

EventFlow AI pairs modern frontend engineering with secure server-side Generative AI:

1. **Context-Aware Event Engine**: Event parameters (type, headcount, target budget, aesthetic theme, and cultural/dietary notes) inform every AI generation and budget allocation.
2. **Mathematical Timeline Conflict Detection**: A dedicated algorithmic scanner (`detectTimelineConflicts`) analyzes day-of run-of-show schedules, converting 12h/24h timestamps into absolute minute offsets to identify time overlaps or unsafe buffer gaps before the event begins.
3. **Dynamic Financial Ledger & Variance Math**: Calculations for estimated vs. committed actuals, category distribution percentages, unpaid vendor balances, and over-budget thresholds are decoupled into pure, testable utility functions.
4. **Secure Server-Side AI Architecture**: The Google Gemini API (`gemini-3.8-flash`) is executed exclusively on server-side Express endpoints (`server.ts`) with zero client-side API key exposure. Calls are wrapped in timeout-resilient handlers with intelligent fallbacks so the application never hangs or crashes.

---

## 3. How the Solution Works

1. **Event Selection & Blueprint Generation**:
   - Organizers can select an existing event or create a new one using the **New Event Modal**.
   - With 1 click, the **Full Event Blueprint Generator** calls Gemini to synthesize a complete event architecture: itemized budget allocations, milestone preparation checklists, an hour-by-hour day-of schedule, and vendor categories.
2. **Interactive Budget Management**:
   - Organizers track target caps, estimated quotes, and paid retainers.
   - Live category bars show visual spending percentages with inline status toggles (Planned, Deposit Paid, Fully Paid, Overdue) and instant CSV export.
3. **Run-of-Show Scheduling**:
   - Dual-view interface toggles between **Preparation Milestones** (chronological phases from 12 months out to post-event wrap-up) and **Day-of Run of Show** (minute-by-minute schedule with assigned leads and zones).
   - Any conflicting schedule items trigger an active warning banner with an **AI Conflict Fix** recommendation.
4. **Vendor Hub & Automated RFP Inquiries**:
   - Organizers monitor quotes, deposits paid, and balances due across vendor categories.
   - Clicking **"Draft AI Inquiry"** on any vendor automatically drafts a tailored, professional Request for Proposal (RFP) email ready to copy and send.
5. **Personalized Ideas & Visual Mood Board**:
   - Visual inspiration cards with curated themes, decor installations, interactive guest experiences, and food/drink concepts that can be bookmarked or converted into event tasks.
6. **Guest List & Dietary Restrictions Tracker**:
   - Tracks attendance tallies (Confirmed, Pending, Declined) and aggregates dietary requirements (Vegetarian, Gluten-Free, Vegan, Allergies) for caterers.
7. **Day-of Troubleshooter**:
   - Immediate crisis triage for unexpected hiccups (e.g., sudden outdoor rain, DJ equipment failure, delayed catering) delivering 5-minute action steps, operational pivots, and calm guest-facing scripts.
8. **Export & Print**:
   - Formats a printable master itinerary packet with emergency contacts, vendor sheet, and run-of-show schedule with browser print / PDF export support.

---

## 4. Assumptions Made

1. **Financial Currency**: Defaults to USD ($) with whole-dollar rounding for high-level event budgeting.
2. **Timeline Phasing**: Uses industry-standard preparation tiers (`12_months`, `6_months`, `3_months`, `1_month`, `final_weeks`, and `post_event`).
3. **Conflict Detection Threshold**: Any schedule overlap where Event B starts before Event A concludes is flagged as a conflict.
4. **Network & Offline Resilience**: In environments where external API access is restricted or latency spikes, the system falls back to pre-calculated, domain-rich generators without interrupting the user workflow.

---

## 5. Evaluation Focus Areas Alignment

### A. Code Quality (High Impact)
- **Strict TypeScript**: 100% type-checked codebase with standard interfaces (`src/types/event.ts`). Zero compiler errors (`tsc --noEmit`).
- **Modular Component Structure**: Clean separation of concerns between views, modals, state controllers, and pure calculation utilities.
- **Readable & Maintainable**: Clear naming conventions, human-readable prose, and no artificial AI clutter.

### B. Security & Safety (Medium Impact)
- **Zero Client-Side Key Exposure**: The Gemini API key is strictly accessed via server-side `process.env.GEMINI_API_KEY`. No API keys or authorization headers are exposed in client bundles.
- **Safe HTML & Sanitize**: No `dangerouslySetInnerHTML` usage. Proper DOM attribute escaping.

### C. Efficiency & Performance (Medium Impact)
- **Lightweight Repository**: Entire Git repository footprint is **~4.3 MB**, easily meeting the **< 10 MB** requirement.
- **Fast Unit Tests**: Decoupled unit tests execute in **< 400ms** via Node's native test runner (`node:test`).
- **Single Level Depth**: Flat visual surfaces with 1px hairline borders avoiding nested card-in-card performance overhead.

### D. Testing & Verification (Medium Impact)
- Built-in test suite (`src/utils/eventCalculations.test.ts`) covering 7 core mathematical functions:
  ```bash
  npm test
  ```
  - ✅ `calculateBudgetSummary`: Financial variance and over-budget triggers
  - ✅ `calculateCategoryBreakdown`: Category grouping and percentage allocation
  - ✅ `parseTimeToMinutes`: 12-hour AM/PM and 24-hour timestamp conversions
  - ✅ `detectTimelineConflicts`: Automated day-of schedule overlap detection
  - ✅ `calculateDaysRemaining`: Calendar difference and event countdown
  - ✅ `calculateGuestStats`: Attendance tallying and dietary restrictions aggregation
  - ✅ `formatCurrency`: Clean currency formatting with tabular figures

### E. Accessibility (Low Impact / Polish)
- WCAG AA compliant contrast ratios.
- Native semantic HTML elements (`<button>`, `<nav>`, `<header>`, `<table>`, `<main>`).
- Tabular figures (`tabular-nums`) across all numeric displays to prevent visual jitter.
- Color-blind accessible status indicators (combining text labels with semantic colors).

---

## 6. Project Directory Map

```text
├── README.md                    # Project documentation & evaluation mapping
├── index.html                   # HTML entry point with synchronized meta
├── metadata.json                # AI Studio capability configuration
├── package.json                 # Scripts and dependencies
├── server.ts                    # Express API endpoints for Gemini + Vite dev middleware
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite bundler configuration
├── src/
│   ├── App.tsx                  # Root state orchestration & navigation controller
│   ├── index.css                # Tailwind CSS v4 styling & typography setup
│   ├── main.tsx                 # React application mounting
│   ├── types/
│   │   └── event.ts             # TypeScript definitions
│   ├── utils/
│   │   ├── eventCalculations.ts # Decoupled business logic
│   │   └── eventCalculations.test.ts # Fast-feedback unit tests (7 passed)
│   ├── data/
│   │   └── initialEvents.ts     # Realistic seed blueprints (Wedding, Birthday, Festival)
│   ├── assets/images/           # High-fidelity visual theme assets
│   └── components/
│       ├── Navigation.tsx       # Top bar contract & active event switcher
│       ├── OverviewView.tsx     # Command center with KPI metric cards
│       ├── BudgetView.tsx       # Financial ledger & category breakdown
│       ├── TimelineView.tsx     # Dual-mode timeline & conflict detection
│       ├── VendorsView.tsx      # Vendor hub & AI RFP inquiry generator
│       ├── IdeasView.tsx        # Personalized ideas, mood board & bookmarking
│       ├── GuestsView.tsx       # Guest list, RSVP tracking & dietary stats
│       ├── AiAssistantModal.tsx # Multi-tool GenAI powerhouse (4 distinct modes)
│       ├── NewEventModal.tsx    # Event creation modal
│       └── ExportSummaryModal.tsx # Printable master itinerary & PDF exporter
```

---

## 7. How to Push to Your Single-Branch Public GitHub Repository

Follow these terminal commands to initialize and push your repository to GitHub on a single branch:

```bash
# 1. Initialize git with a single 'main' branch
git init -b main

# 2. Stage all project files
git add .

# 3. Create your initial commit
git commit -m "Initial commit: EventFlow AI planner with Gemini 3.8 Flash"

# 4. Link your remote public GitHub repository
git remote add origin https://github.com/<your-username>/eventflow-ai.git

# 5. Push your single branch to GitHub
git push -u origin main
```
