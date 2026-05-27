# OrdinanceFlow Cebu — Public Web Portal

Citizen-facing website for browsing, searching, and understanding Cebu City ordinances. No login required.

Part of **OrdinanceFlow Cebu**, a two-app system built for the **Cebu Solutionsfest 2026 — Ordinance Reach Track**, in response to a problem identified by the Office of the City Councilor, Cebu City.

---

## Stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Inline styles with CSS custom properties (no external CSS framework) |
| Icons | Lucide React |
| State | React `useState` / `useMemo` |
| Data | Mock TypeScript objects (production would connect to a backend API) |
| AI | Simulated pattern-matching engine (production would call an LLM API) |

---

## Running the App

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173` by default.

```bash
npm run build   # Production build → dist/
npm run preview # Preview the production build locally
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero search, featured ordinances, category grid, stats banner, "How it works" |
| `/ordinances` | Ordinance database | Searchable, filterable, paginated list of all ordinances |
| `/ordinances/:id` | Ordinance detail | Full text, AI summary, responsible offices, amendments, per-ordinance AI chatbot |
| `/categories` | Categories | Browse all 8 governance categories with expandable ordinance panels |
| `/barangays` | Barangays | All 80 Cebu City barangays (16 populated) with relevant ordinance links |
| `/about` | About & FAQ | Portal explanation, "How it works", 8-item FAQ accordion, contact info |
| `/help` | — | Redirects to `/about` |

---

## Features

### Ordinance Browse (`/ordinances`)
- Full-text search across title, summary, keywords, and ordinance number
- Filter by **category** (8 governance areas), **status** (active / amended / repealed), and **year enacted**
- Sort by newest, oldest, or A–Z title
- Active filter chips with individual and "Clear all" removal
- **Pagination** — 10 results per page with ellipsis-aware page controls
- Results count shows "X–Y of Z ordinances"

### Ordinance Detail (`/ordinances/:id`)
- Ordinance number, title, category badge, status badge, enactment date, author
- **AI plain-language summary** with disclaimer
- Collapsible full ordinance text
- Affected sectors, responsible offices, quick facts sidebar
- Amendment history (where applicable)
- Related ordinances (same category)
- Action buttons: **Download PDF**, **Print**, **Save/Bookmark**, **Share** (copy link modal), **Report issue** (modal with submission flow)
- **Per-ordinance AI chatbot** — context-aware answers about penalties, affected sectors, responsible offices, compliance, and amendment history

### AI Chatbot
Two modes, one component (`AIChatbot.tsx`):

- **Global assistant** — floats on all pages except the detail page. Answers cross-ordinance questions like "What ordinances apply to food businesses?" or "Which office handles traffic violations?" Returns matched ordinances as clickable links.
- **Per-ordinance assistant** — shown on the detail page. Answers questions specifically about the open ordinance (penalties, who it affects, implementing offices, dates, compliance steps).

Both use a simulated pattern-matching engine against the mock data. Production would replace this with an LLM API call (e.g., OpenAI GPT-4o or Google Gemini) with the ordinance text as system context.

### Barangays (`/barangays`)
- 16 of 80 Cebu City barangays across 4 congressional districts
- District filter tabs and search by name or topic
- Slide-in detail drawer per barangay showing population, area, governance tags, and relevant ordinances

### Categories (`/categories`)
- All 8 governance categories with descriptions and topic highlights
- Click to expand and see sample ordinances in that category
- "View all N ordinances" button links to the filtered browse page

### About & FAQ (`/about`)
- Portal explanation and mission
- 4-step "How it works" lifecycle (enacted → offices notified → published → citizens ask AI)
- Problem/solution cards
- 8-item FAQ accordion (what is an ordinance, AI accuracy disclaimer, how to report non-compliance, etc.)
- Contact info for the Cebu City Council Records Office

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav with search modal, mobile menu
│   │   └── Footer.tsx          # Site footer
│   ├── ordinance/
│   │   └── OrdinanceCard.tsx   # Card component (featured / default / compact variants)
│   └── ui/
│       ├── AIChatbot.tsx       # Floating AI assistant (global + per-ordinance modes)
│       ├── Badges.tsx          # StatusBadge, CategoryChip, AIPill, Button
│       └── SearchModal.tsx     # Keyboard-navigable spotlight search modal
├── data/
│   └── ordinances.ts           # 8 mock ordinances + categoryStats
├── hooks/                      # (reserved for custom hooks)
├── pages/
│   ├── HomePage.tsx
│   ├── OrdinancesPage.tsx      # With year filter + pagination
│   ├── OrdinanceDetailPage.tsx # With print button + per-ordinance chatbot
│   ├── BarangaysPage.tsx
│   ├── CategoriesPage.tsx
│   └── AboutPage.tsx
├── types/
│   └── index.ts                # Ordinance, OrdinanceStatus, OrdinanceCategory, etc.
├── App.tsx                     # Router + GlobalChatbot (suppressed on detail page)
├── main.tsx
└── index.css                   # CSS custom properties (design tokens)
```

---

## Mock Data

The database currently contains **8 sample ordinances** across 6 of the 8 categories:

| No. | Title (abbreviated) | Category | Status | Year |
|---|---|---|---|---|
| 2876 | Solid Waste Disposal in Public Markets | Health & Sanitation | Active | 2025 |
| 2871 | No-Parking Zones During Peak Hours | Traffic & Transport | Active | 2025 |
| 2865 | Business Permit Renewal for Food Establishments | Business & Permits | Amended | 2024 |
| 2858 | Single-Use Plastic Bag Ban | Environment | Active | 2024 |
| 2850 | Safe Spaces in Schools and Barangay Halls | Public Safety | Active | 2024 |
| 2841 | TNVS (Ride-Hailing) Regulation | Traffic & Transport | Active | 2024 |
| 2829 | Mandatory PhilHealth Registration for Informal Workers | Social Welfare | Active | 2024 |
| 2810 | Curfew for Minors | Public Safety | Amended | 2023 |

Category counts shown in the UI (e.g., "218 Health & Sanitation ordinances") represent the full Cebu City ordinance archive — not just the 8 in the mock database.

---

## Related App

The companion **Government Web App** (`/government-web-app`) is the internal portal for City Council encoders, department heads, and system administrators. It handles ordinance encoding, multi-channel dispatch notifications, compliance tracking, escalation, audit logs, and role-based access for 6 user roles.

---

## Production Architecture (Recommended)

| Layer | Technology |
|---|---|
| Backend / Auth | Supabase (PostgreSQL + Auth + Storage) |
| Full-text search | PostgreSQL `tsvector` via Supabase |
| File storage | Supabase Storage (PDF/DOCX attachments) |
| AI | OpenAI GPT-4o or Google Gemini with ordinance text as system context |
| Email notifications | SendGrid |
| SMS notifications | Semaphore PH / Globe Labs |
| Hosting | Vercel or Netlify |
