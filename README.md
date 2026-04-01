<p align="center">
  <img src="public/logo.svg" alt="AquaCity Logo" width="80" />
</p>

<h1 align="center">AquaCity — Urban Water Infrastructure Dashboard</h1>

<p align="center">
  <strong>Aligned with UN Sustainable Development Goal 11: Sustainable Cities & Communities</strong><br />
  A data-driven monitoring platform for urban water bodies across Maharashtra, India
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UN_SDG-11-F59E0B?style=for-the-badge&logo=united-nations&logoColor=white" />
  <img src="https://img.shields.io/badge/CPCB-Benchmarked-0D9488?style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI_Kosh-Powered-6366F1?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
</p>

---

## 📌 Problem Statement

Urbanisation in India is accelerating — by 2030, 40% of India's population will live in cities (UN Habitat). As cities grow, **urban water bodies** (lakes, rivers, reservoirs, ponds, wells) face:

- **Untreated sewage discharge** and industrial effluent contamination
- **Encroachment and loss** of natural waterfronts
- **Eutrophication** and declining dissolved oxygen levels
- **Lack of real-time, centralised monitoring data** accessible to citizens and policymakers

Without a systematic, data-driven approach, urban water infrastructure degrades silently, impacting public health, biodiversity, and climate resilience.

---

## 💡 The Idea

**AquaCity** is a civic-tech platform that brings transparency and accountability to urban water management by:

1. **Centralising water quality data** from government agencies (CPCB, MoEFCC), research institutions, and community monitors into a single dashboard
2. **Scoring every water body** using a composite **Water Quality Health Index** based on CPCB standards and IS 10500 norms
3. **Mapping urban water infrastructure** geospatially to identify critical zones, pollution hotspots, and conservation priorities
4. **Enabling citizen participation** through authenticated field data submissions
5. **Generating actionable reports** aligned with NITI Aayog SDG India Index indicators

---

## 🌍 SDG 11 Alignment

AquaCity directly contributes to multiple SDG 11 targets:

| Target | Description | How AquaCity Contributes |
|--------|-------------|--------------------------|
| **11.3** | Enhance inclusive and sustainable urbanisation | Provides open data on urban water resources for equitable city planning |
| **11.5** | Reduce deaths from water-related disasters | Identifies critical water bodies requiring urgent intervention |
| **11.6** | Reduce per-capita environmental impact of cities | Monitors pollution levels, tracks improvement over time |
| **11.7** | Provide access to safe, inclusive green and public spaces | Maps water body accessibility and conservation status |
| **11.b** | Implement integrated policies for resource efficiency | Generates compliance reports aligned with government standards |

### Government & Industry Standards Used

- **CPCB** (Central Pollution Control Board) — Water quality classification criteria (A, B, C, D, E)
- **IS 10500:2012** — Bureau of Indian Standards for drinking water specification
- **MoEFCC** — Ministry of Environment, Forest & Climate Change guidelines
- **NITI Aayog SDG India Index** — State/district-level SDG performance framework
- **AI Kosh** — National AI data repository for validated environmental datasets
- **MoSPI** — Ministry of Statistics for SDG indicator tracking

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Component-based SPA with type safety |
| **Styling** | Tailwind CSS 3 + shadcn/ui | Semantic design tokens, accessible components |
| **Charts** | Recharts | Interactive data visualisations (pie, bar, trend) |
| **Maps** | Leaflet.js | Geospatial mapping with OpenStreetMap tiles |
| **Backend** | Lovable Cloud (Supabase) | PostgreSQL database, Auth, Row-Level Security |
| **Build** | Vite 5 | Fast HMR, optimised production builds |
| **Reports** | jsPDF + html2canvas | PDF report generation with government references |
| **Routing** | React Router v6 | Client-side navigation with protected routes |

---

## 📊 Health Score Methodology

AquaCity computes a **composite Water Quality Health Index** (0–100) based on five parameter categories, benchmarked against CPCB and IS 10500 standards:

### Scoring Breakdown

| Parameter | Weight | Optimal Range (CPCB) | Scoring Logic |
|-----------|--------|----------------------|---------------|
| **pH** | 20 pts | 6.5 – 8.5 | Full marks in range, graded deductions outside |
| **Dissolved Oxygen** | 30 pts | ≥ 6 mg/L | Highest weight — critical for aquatic life |
| **Turbidity** | 20 pts | < 25 NTU | Lower turbidity = better clarity and less contamination |
| **Temperature** | 10 pts | 15 – 25 °C | Moderate weighting, affects DO solubility |
| **Pollutants** | 20 pts | See sub-params | Composite of BOD, COD, nitrates, phosphates, fecal coliform |

### Pollutant Sub-Parameters

| Sub-Parameter | Threshold | Penalty |
|---------------|-----------|---------|
| BOD (Biochemical Oxygen Demand) | > 5 mg/L | –5 pts |
| COD (Chemical Oxygen Demand) | > 20 mg/L | –5 pts |
| Nitrates | > 10 mg/L | –3 pts |
| Phosphates | > 0.5 mg/L | –3 pts |
| Fecal Coliform | > 500 MPN/100mL | –4 pts |

### Health Status Classification

| Score Range | Status | Interpretation |
|-------------|--------|----------------|
| 85 – 100 | 🟢 Excellent | Meets all CPCB norms; safe for designated use |
| 70 – 84 | 🔵 Good | Minor deviations; generally acceptable |
| 50 – 69 | 🟡 Fair | Noticeable degradation; needs monitoring |
| 30 – 49 | 🟠 Poor | Significant pollution; intervention required |
| 0 – 29 | 🔴 Critical | Severe contamination; immediate action needed |

> This methodology aligns with CPCB's Water Quality Criteria for Designated Best Use classification and WHO Guidelines for Drinking-water Quality (4th Edition).

---

## 📁 Data Sources

| Source | Type | Usage |
|--------|------|-------|
| **AI Kosh** | National AI Data Platform | Primary source for validated water body datasets |
| **CPCB ENVIS** | Government Portal | Water quality benchmarks and classification standards |
| **NITI Aayog SDG India Index** | Government Framework | District-level SDG 11 performance indicators |
| **MoSPI SDG Dashboard** | Government Dashboard | National SDG indicator tracking and reporting |
| **Maharashtra Jal Sampada Vibhag** | State Dept. | Reservoir levels, dam capacities, irrigation data |
| **Census 2011 / Urban Frame Survey** | Government | Urban population and settlement classification data |

---

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard with stats, charts, map
│   ├── Layout.tsx       # App shell with navigation and footer
│   ├── StatCard.tsx     # Metric display cards
│   ├── WaterBodyCard.tsx # Water body summary cards
│   ├── WaterBodyMap.tsx # Leaflet-based geospatial map
│   ├── QuickActions.tsx # Export and utility actions
│   └── ui/              # shadcn/ui component library
├── contexts/            # React Context for global state
│   └── WaterBodyContext.tsx
├── data/                # Seed data and district references
│   └── maharashtraData.ts
├── pages/               # Route-level page components
│   ├── Index.tsx        # Dashboard landing page
│   ├── WaterBodyList.tsx # Filterable water body directory
│   ├── WaterBodyDetail.tsx # Individual water body profile
│   ├── AddWaterBody.tsx # Authenticated data entry form
│   ├── Analytics.tsx    # Charts and trend analysis
│   ├── Methodology.tsx  # Scoring methodology & references
│   └── Auth.tsx         # Sign in / Sign up
├── types/               # TypeScript type definitions
│   └── waterBody.ts
├── utils/               # Business logic utilities
│   ├── healthScore.ts   # Health index calculation engine
│   └── reportGenerator.ts # PDF report generation
└── integrations/        # Backend integration layer
    └── supabase/        # Auto-generated Supabase client & types
```

---

## 🔐 Security & Access Control

- **Row-Level Security (RLS)** enforced on all database tables
- **Public read access** for water body data (transparency by design)
- **Authenticated write access** — only signed-in users can add/edit records
- **User-scoped mutations** — users can only modify their own submissions
- **Email verification** required before account activation

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` with hot module replacement.

---

## 📎 Key References

- [UN SDG 11 — Sustainable Cities](https://sdgs.un.org/goals/goal11)
- [SDG India Index — NITI Aayog](https://sdgindiaindex.niti.gov.in/#/ranking)
- [MoSPI SDG Dashboard](https://www.sdgindia2030.mospi.gov.in/dashboard/overview)
- [CPCB Water Quality Standards](https://cpcb.nic.in/water-quality-criteria/)
- [IS 10500:2012 — Drinking Water Specification](https://www.bis.gov.in/)
- [AI Kosh — National AI Data Platform](https://aikosh.cgg.gov.in/)
- [WHO Drinking Water Guidelines](https://www.who.int/publications/i/item/9789241549950)

---

## 📜 License

This project is developed as an academic/civic-tech initiative aligned with India's SDG commitments. Data sourced from government open data platforms.

---

<p align="center">
  <strong>AquaCity</strong> — Engineering sustainable cities through data-driven urban water monitoring<br />
  <em>SDG 11 · CPCB Benchmarked · AI Kosh Powered · MoEFCC Aligned</em>
</p>
