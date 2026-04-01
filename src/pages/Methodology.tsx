import { Layout } from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FlaskConical, ShieldCheck, BarChart3, Database, BookOpen, ExternalLink, Droplets, Thermometer, Activity, Bug, TestTube } from 'lucide-react';

const scoringParameters = [
  {
    name: 'pH Level',
    weight: 20,
    icon: FlaskConical,
    optimal: '6.5 – 8.5',
    standard: 'IS 10500 & CPCB Class A',
    description: 'Measures acidity/alkalinity. Values outside the optimal range indicate chemical contamination or natural mineral imbalance. CPCB Class A (drinking without treatment) requires pH 6.5–8.5.',
    scoring: [
      { range: '6.5 – 8.5', points: 20, label: 'Optimal' },
      { range: '6.0 – 9.0', points: 15, label: 'Acceptable' },
      { range: '5.5 – 9.5', points: 10, label: 'Stressed' },
      { range: 'Outside 5.5–9.5', points: 5, label: 'Critical' },
    ],
  },
  {
    name: 'Dissolved Oxygen (DO)',
    weight: 30,
    icon: Droplets,
    optimal: '≥ 6 mg/L',
    standard: 'CPCB Class C',
    description: 'The most critical parameter for aquatic ecosystem health. DO below 4 mg/L causes fish kills and ecosystem collapse. CPCB mandates ≥4 mg/L for Class C (drinking with conventional treatment) and ≥6 mg/L for Class B (outdoor bathing).',
    scoring: [
      { range: '≥ 6 mg/L', points: 30, label: 'Healthy' },
      { range: '4 – 6 mg/L', points: 22, label: 'Stressed' },
      { range: '2 – 4 mg/L', points: 15, label: 'Poor' },
      { range: '< 2 mg/L', points: 5, label: 'Hypoxic' },
    ],
  },
  {
    name: 'Turbidity',
    weight: 20,
    icon: Activity,
    optimal: '< 25 NTU',
    standard: 'IS 10500 (5 NTU desirable, 10 NTU permissible)',
    description: 'Measures water clarity. High turbidity indicates suspended solids from erosion, sewage, or algal blooms. IS 10500 sets 5 NTU as desirable and 10 NTU as the permissible limit for drinking water. Field monitoring uses broader thresholds.',
    scoring: [
      { range: '< 25 NTU', points: 20, label: 'Clear' },
      { range: '25 – 50 NTU', points: 15, label: 'Moderate' },
      { range: '50 – 100 NTU', points: 10, label: 'Turbid' },
      { range: '> 100 NTU', points: 5, label: 'Opaque' },
    ],
  },
  {
    name: 'Temperature',
    weight: 10,
    icon: Thermometer,
    optimal: '15 – 25 °C',
    standard: 'CPCB / WHO Guidelines',
    description: 'Water temperature affects dissolved oxygen capacity, biological activity, and chemical reaction rates. Thermal pollution from industrial discharge can devastate aquatic ecosystems.',
    scoring: [
      { range: '15 – 25 °C', points: 10, label: 'Optimal' },
      { range: '10 – 30 °C', points: 7, label: 'Acceptable' },
      { range: 'Outside 10–30 °C', points: 3, label: 'Stressed' },
    ],
  },
  {
    name: 'Pollutant Index',
    weight: 20,
    icon: Bug,
    optimal: 'All sub-parameters within limits',
    standard: 'CPCB + IS 10500',
    description: 'A composite score from five sub-parameters: BOD, COD, Nitrates, Phosphates, and Fecal Coliform. Each exceedance deducts points from a base of 20, providing a holistic pollution assessment.',
    scoring: [],
  },
];

const pollutantSubParams = [
  { name: 'BOD (Biochemical Oxygen Demand)', threshold: '> 5 mg/L', penalty: '–5 pts', standard: 'CPCB Class C: ≤3 mg/L', why: 'Indicates organic pollution load. High BOD means bacteria are consuming oxygen to decompose organic matter.' },
  { name: 'COD (Chemical Oxygen Demand)', threshold: '> 20 mg/L', penalty: '–5 pts', standard: 'CPCB: ≤250 mg/L (industrial discharge)', why: 'Measures total oxygen needed for chemical oxidation. COD > BOD suggests non-biodegradable chemical contamination.' },
  { name: 'Nitrates (NO₃)', threshold: '> 10 mg/L', penalty: '–3 pts', standard: 'IS 10500: 45 mg/L permissible', why: 'Excess nitrates cause eutrophication and are harmful in drinking water (methemoglobinemia in infants).' },
  { name: 'Phosphates (PO₄)', threshold: '> 0.5 mg/L', penalty: '–3 pts', standard: 'No IS limit; ecological threshold', why: 'Primary driver of algal blooms. Sources include detergents, fertilisers, and untreated sewage.' },
  { name: 'Fecal Coliform', threshold: '> 500 MPN/100mL', penalty: '–4 pts', standard: 'CPCB Class A: ≤50 MPN/100mL', why: 'Indicates faecal contamination. Critical public health indicator for waterborne diseases.' },
];

const healthStatuses = [
  { range: '85 – 100', status: 'Excellent', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', meaning: 'Meets all CPCB designated best-use norms. Safe for intended purpose. No immediate intervention required.' },
  { range: '70 – 84', status: 'Good', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', meaning: 'Minor deviations from standards. Generally acceptable water quality. Routine monitoring sufficient.' },
  { range: '50 – 69', status: 'Fair', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', meaning: 'Noticeable degradation in one or more parameters. Increased monitoring and source identification recommended.' },
  { range: '30 – 49', status: 'Poor', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', meaning: 'Significant pollution across multiple parameters. Active intervention and remediation measures required.' },
  { range: '0 – 29', status: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', meaning: 'Severe contamination. Immediate government/civic action needed. Not safe for any designated use.' },
];

const references = [
  { name: 'CPCB Water Quality Criteria', url: 'https://cpcb.nic.in/water-quality-criteria/', org: 'Central Pollution Control Board' },
  { name: 'IS 10500:2012 — Drinking Water Specification', url: 'https://www.bis.gov.in/', org: 'Bureau of Indian Standards' },
  { name: 'WHO Drinking Water Quality Guidelines (4th Ed.)', url: 'https://www.who.int/publications/i/item/9789241549950', org: 'World Health Organization' },
  { name: 'SDG India Index & Dashboard', url: 'https://sdgindiaindex.niti.gov.in/#/ranking', org: 'NITI Aayog' },
  { name: 'MoSPI SDG Dashboard', url: 'https://www.sdgindia2030.mospi.gov.in/dashboard/overview', org: 'Ministry of Statistics' },
  { name: 'AI Kosh National Data Platform', url: 'https://aikosh.cgg.gov.in/', org: 'Government of India' },
  { name: 'MoEFCC Environmental Guidelines', url: 'https://moef.gov.in/', org: 'Ministry of Environment, Forest & Climate Change' },
];

const Methodology = () => {
  return (
    <Layout>
      <div className="space-y-8 max-w-4xl">
        {/* Hero */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> CPCB · IS 10500 · WHO
            </Badge>
            <Badge variant="outline" className="gap-1.5 text-xs">
              <Database className="h-3.5 w-3.5" /> AI Kosh Validated
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Methodology & Scoring
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            AquaCity uses a transparent, standards-based Water Quality Health Index to assess urban water bodies. Every score is computed from measurable parameters aligned with CPCB criteria, IS 10500 norms, and WHO guidelines.
          </p>
        </div>

        <Separator />

        {/* About the Project */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> About AquaCity
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              <strong className="text-foreground">AquaCity</strong> is a civic-technology platform built to address the growing challenge of urban water body degradation in Indian cities. As India urbanises rapidly — projected to have 600+ million urban residents by 2031 — the health of lakes, rivers, reservoirs, and ponds within city limits becomes critical for public health, climate resilience, and biodiversity.
            </p>
            <p>
              The platform aligns with <strong className="text-foreground">UN SDG 11 (Sustainable Cities & Communities)</strong>, specifically targets 11.3 (sustainable urbanisation), 11.5 (disaster risk reduction), 11.6 (environmental impact), and 11.7 (public green/blue spaces). It uses data from India's <strong className="text-foreground">AI Kosh</strong> national data platform and validates measurements against standards set by CPCB, BIS, and MoEFCC.
            </p>
            <p>
              The project demonstrates how <strong className="text-foreground">Computer Engineering</strong> enables sustainable cities — through data pipelines, geospatial mapping, composite scoring algorithms, real-time dashboards, and secure citizen data participation.
            </p>
          </div>
        </section>

        <Separator />

        {/* Scoring Parameters */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Health Score Parameters
          </h2>
          <p className="text-sm text-muted-foreground">
            The composite score (0–100) is calculated from five categories. Dissolved Oxygen receives the highest weight (30%) as it is the most critical indicator of aquatic ecosystem viability.
          </p>

          <div className="space-y-4">
            {scoringParameters.map((param) => (
              <Card key={param.name} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <param.icon className="h-4 w-4 text-primary" />
                      {param.name}
                    </CardTitle>
                    <Badge variant="secondary" className="font-bold">{param.weight} pts</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optimal: <strong>{param.optimal}</strong> · Standard: {param.standard}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{param.description}</p>
                  {param.scoring.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {param.scoring.map((s) => (
                        <div key={s.range} className="p-2 rounded-lg bg-secondary/50 text-center">
                          <p className="text-xs font-semibold text-foreground">{s.label}</p>
                          <p className="text-[11px] text-muted-foreground">{s.range}</p>
                          <p className="text-sm font-bold text-primary">{s.points} pts</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Pollutant Sub-Parameters */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TestTube className="h-5 w-5 text-primary" /> Pollutant Sub-Parameters
          </h2>
          <p className="text-sm text-muted-foreground">
            The Pollutant Index starts at 20 points. Each exceedance deducts points, capturing multi-dimensional pollution impact.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="text-left p-3 font-semibold text-foreground">Parameter</th>
                  <th className="text-left p-3 font-semibold text-foreground">Threshold</th>
                  <th className="text-left p-3 font-semibold text-foreground">Penalty</th>
                  <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Standard</th>
                </tr>
              </thead>
              <tbody>
                {pollutantSubParams.map((p, i) => (
                  <tr key={p.name} className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/20'}>
                    <td className="p-3">
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.why}</p>
                    </td>
                    <td className="p-3 font-mono text-xs text-foreground">{p.threshold}</td>
                    <td className="p-3 font-bold text-destructive">{p.penalty}</td>
                    <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">{p.standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Separator />

        {/* Health Status Classification */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Health Status Classification
          </h2>
          <p className="text-sm text-muted-foreground">
            The final score maps to a five-tier classification aligned with CPCB's Designated Best Use framework.
          </p>

          <div className="space-y-2">
            {healthStatuses.map((s) => (
              <div key={s.status} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Badge className={`${s.color} shrink-0 mt-0.5`}>{s.status}</Badge>
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.range} points</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.meaning}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* Data Sources */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> Data Sources & Validation
          </h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
            <p>
              Water quality data is extracted from <strong className="text-foreground">AI Kosh</strong>, India's national AI data repository maintained by the Centre for Good Governance. Data undergoes validation against CPCB monitoring station records and cross-referenced with state-level irrigation department datasets.
            </p>
            <p>
              Citizen-submitted field data is tagged with user authentication IDs and flagged for moderation. Government-submitted records receive higher confidence weighting in aggregate statistics.
            </p>
          </div>
        </section>

        <Separator />

        {/* References */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> References & Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {references.map((ref) => (
              <a
                key={ref.name}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors group"
              >
                <ExternalLink className="h-4 w-4 text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{ref.name}</p>
                  <p className="text-xs text-muted-foreground">{ref.org}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            This scoring methodology is designed for urban water body monitoring as part of SDG 11 compliance reporting.
            It does not replace laboratory-grade water quality assessments. For regulatory decisions, refer to CPCB-accredited laboratory results.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Methodology;
