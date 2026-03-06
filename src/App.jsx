import { useState, useMemo, useCallback } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

/* ══════════════════════════════════════════
   TRANSLATIONS
   ══════════════════════════════════════════ */
const I18N = {
  cs: {
    title: "Vyplatí se mi pronájem nebo koupě?",
    subtitle: "Interaktivní kalkulačka s analýzou nákladů obětované příležitosti",
    meta: "Výchozí hodnoty: průměry Praha, 2026 · Zdroje: Deloitte, ČNB, ČBA, ČSÚ",
    rent: "Pronájem", buy: "Koupě", opp: "Náklady obětované příležitosti",
    monthlyRent: "Měsíční nájem", rentGrowth: "Roční růst nájmu",
    price: "Kupní cena", dp: "Vlastní prostředky",
    rate: "Úroková sazba", term: "Doba splácení",
    invest: "Výnos z investic (např. S&P 500)", appreciation: "Zhodnocení nemovitosti",
    oppNote: "Nájemce investuje vlastní prostředky + měsíční úspory (když hypotéka > nájem) s daným výnosem.",
    buyWins: "Koupě se vyplatí", rentWins: "Pronájem se vyplatí",
    after: "po", yrs: "letech", moreBy: "více čistého jmění díky",
    buyVerb: "koupi", rentVerb: "pronájmu + investování",
    propWorth: "Nemovitost bude mít hodnotu", debt: "se zbývajícím dluhem",
    paid: "(splaceno)", renterReach: "Portfolio nájemce by dosáhlo",
    investReach: "Vaše investiční portfolio dosáhne",
    fromDp: "z vlastních prostředků", fromSav: "z měsíčních úspor",
    buyerWould: "Jmění kupujícího by bylo",
    lblBuyEq: "Jmění kupujícího", lblRentEq: "Portfolio nájemce",
    lblMtg: "Hypotéka/měs.", lblRent1: "Nájem rok 1", lblRentN: "Nájem rok",
    secEquity: "Vývoj čistého jmění", secMonthly: "Měsíční platby", secTable: "Roční přehled",
    totalBuy: "Celkové náklady koupě", totalRent: "Celkový nájem", cashD: "Rozdíl cash flow",
    buyMore: "koupě stojí víc", rentMore: "pronájem stojí víc",
    down: "vlastní", interest: "úroky",
    crossover: "Nájem přesáhne splátku hypotéky v roce",
    buyer: "Kupující", renter: "Nájemce",
    prop: "Nemovitost", debtL: "− Dluh", eq: "Jmění",
    dpInv: "Investované VP", sav: "Úspory", portfolio: "Portfolio",
    bPlus: "Koupě +", rPlus: "Pronájem +",
    hYear: "Rok", hRent: "Nájem", hMtg: "Hyp.", hInv: "Invest.", hBuyEq: "Kupující", hRentEq: "Nájemce", hD: "Δ",
    rentL: "Nájem", mtgL: "Hypotéka",
    legBuy: "Kupující (nemovitost − dluh)", legRent: "Nájemce (investiční portfolio)",
    paidS: "Splaceno", perYr: "/rok", bal: "Zůstatek",
    disc: "Upozornění: Zjednodušený model. Nezahrnuje údržbu, daň z nemovitosti, pojištění, transakční poplatky, daňové odpočty úroků, korekci o inflaci ani kauci. Zhodnocení a výnosy nejsou zaručené. Poraďte se s finančním poradcem.",
    src: "Data: Deloitte Rent Index 2025, ČBA Hypomonitor 2025, ČSÚ 2024, RE/MAX Praha 2025, ČNB 2025.",
    contact: "Kontakt", unit: "let",
  },
  en: {
    title: "Should I Rent or Buy?",
    subtitle: "Interactive calculator with opportunity cost analysis",
    meta: "Defaults: Prague averages, 2026 · Sources: Deloitte, CNB, CBA, CZSO",
    rent: "Renting", buy: "Buying", opp: "Opportunity cost",
    monthlyRent: "Monthly rent", rentGrowth: "Annual rent increase",
    price: "Purchase price", dp: "Down payment",
    rate: "Mortgage rate", term: "Mortgage term",
    invest: "Investment return (e.g. S&P 500)", appreciation: "Property appreciation",
    oppNote: "Renter invests down payment + monthly savings (when mortgage > rent) at this return rate.",
    buyWins: "Buying wins", rentWins: "Renting wins",
    after: "after", yrs: "years", moreBy: "more net equity by",
    buyVerb: "buying", rentVerb: "renting + investing",
    propWorth: "Property will be worth", debt: "with remaining debt",
    paid: "(fully paid off)", renterReach: "Renter's portfolio would reach",
    investReach: "Your investment portfolio reaches",
    fromDp: "from down payment", fromSav: "from monthly savings",
    buyerWould: "Buyer's equity would be",
    lblBuyEq: "Buyer equity", lblRentEq: "Renter portfolio",
    lblMtg: "Mortgage/mo", lblRent1: "Rent yr 1", lblRentN: "Rent yr",
    secEquity: "Net Equity Over Time", secMonthly: "Monthly Payments", secTable: "Yearly Breakdown",
    totalBuy: "Total cost of buying", totalRent: "Total rent", cashD: "Cash outflow Δ",
    buyMore: "buying costs more", rentMore: "renting costs more",
    down: "down", interest: "interest",
    crossover: "Rent exceeds mortgage payment in",
    buyer: "Buyer", renter: "Renter",
    prop: "Property", debtL: "− Debt", eq: "Equity",
    dpInv: "DP invested", sav: "Savings", portfolio: "Portfolio",
    bPlus: "Buy +", rPlus: "Rent +",
    hYear: "Year", hRent: "Rent", hMtg: "Mtg", hInv: "Invests", hBuyEq: "Buyer", hRentEq: "Renter", hD: "Δ",
    rentL: "Rent", mtgL: "Mortgage",
    legBuy: "Buyer (property − debt)", legRent: "Renter (investment portfolio)",
    paidS: "Paid off", perYr: "/yr", bal: "Balance",
    disc: "Disclaimer: Simplified model. Does not include maintenance, property tax, insurance, transaction fees, mortgage interest deductions, inflation adjustment, or deposit. Returns are not guaranteed. Consult a financial advisor.",
    src: "Data: Deloitte Rent Index 2025, CBA Hypomonitor 2025, CZSO 2024, RE/MAX Prague 2025, CNB 2025.",
    contact: "Contact", unit: "years",
  },
};

/* ══════════════════════════════════════════
   CONSTANTS & FORMATTERS
   ══════════════════════════════════════════ */
const C = { // colors
  bg: "#0e0e1a", card: "#151522", border: "#222238",
  buy: "#fb7185", rent: "#818cf8", inv: "#4ade80", warn: "#fbbf24",
  txt: "#e0e0e0", dim: "#5a5a6a", faint: "#3a3a4a",
};

const fmt = {
  k: (v) => `${(v / 1000).toFixed(1)}k`,
  m2: (v) => `${(v / 1e6).toFixed(2)}M`,
  m1: (v) => `${(v / 1e6).toFixed(1)}M`,
  n: (v) => Math.round(v).toLocaleString("cs-CZ"),
};

/* ══════════════════════════════════════════
   CALCULATION ENGINE
   ══════════════════════════════════════════ */
function compute(baseRent, rentRate, purchasePrice, downPayment, annualRate, mortgageYears, investReturn, propertyAppreciation) {
  const principal = Math.max(0, purchasePrice - downPayment);
  const mRate = annualRate / 100 / 12;
  const nPay = mortgageYears * 12;
  const rRate = rentRate / 100;
  const iRateM = Math.pow(1 + investReturn / 100, 1 / 12) - 1;
  const pRate = propertyAppreciation / 100;
  const totalYears = Math.max(mortgageYears, 10) + 1;

  // Monthly mortgage payment (annuity formula)
  const mp = principal <= 0 ? 0
    : mRate > 0 ? Math.round(principal * mRate * Math.pow(1 + mRate, nPay) / (Math.pow(1 + mRate, nPay) - 1))
    : Math.round(principal / nPay);

  let bal = principal, dpC = downPayment, savC = 0, cross = null;

  const rows = Array.from({ length: totalYears }, (_, i) => {
    const rent = Math.round(baseRent * Math.pow(1 + rRate, i));
    const mtg = i < mortgageYears ? mp : 0;
    const pv = Math.round(purchasePrice * Math.pow(1 + pRate, i));
    let yI = 0, yP = 0, mS = 0, mSc = 0;

    for (let m = 0; m < 12; m++) {
      if (bal > 0 && i < mortgageYears) {
        const mi = bal * mRate;
        const mP = mp - mi;
        yI += mi;
        yP += Math.min(mP, bal);
        bal = Math.max(0, bal - mP);
      }
      const diff = mtg - rent;
      if (diff > 0) { savC = (savC + diff) * (1 + iRateM); mS += diff; mSc++; }
      else { savC *= (1 + iRateM); }
      dpC *= (1 + iRateM);
    }

    if (!cross && rent >= mtg && mtg > 0) cross = 2026 + i;

    return {
      year: 2026 + i, rent, mortgage: mtg,
      yearInterest: Math.round(yI), balance: Math.round(Math.max(0, bal)),
      propertyValue: pv,
      buyerEquity: Math.round(pv - Math.max(0, bal)),
      renterEquity: Math.round(dpC + savC),
      dpInvested: Math.round(dpC), savingsInvested: Math.round(savC),
      monthlySavings: mSc > 0 ? Math.round(mS / mSc) : 0,
    };
  });

  const tRent = rows.reduce((s, d) => s + d.rent * 12, 0);
  const last = rows[rows.length - 1];

  return {
    data: rows, mp,
    tMort: mp * nPay + downPayment,
    tInt: mp * nPay - principal,
    tRent, cross,
    buyEq: last.buyerEquity, rentEq: last.renterEquity,
    years: totalYears - 1,
  };
}

/* ══════════════════════════════════════════
   REUSABLE COMPONENTS
   ══════════════════════════════════════════ */
function Slider({ label, value, onChange, min, max, step, format, unit, color }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label style={{ display: "block", marginBottom: 14, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#8a8a9a" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "monospace" }}>
          {format ? format(value) : value}{unit && ` ${unit}`}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(+e.target.value)}
        aria-label={label}
        style={{
          width: "100%", height: 5, appearance: "none", WebkitAppearance: "none",
          background: `linear-gradient(90deg,${color} ${pct}%,#2a2a3e ${pct}%)`,
          borderRadius: 6, outline: "none", cursor: "pointer",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#4a4a5a", marginTop: 2 }}>
        <span>{format ? format(min) : min}{unit && ` ${unit}`}</span>
        <span>{format ? format(max) : max}{unit && ` ${unit}`}</span>
      </div>
    </label>
  );
}

function Section({ title, open, onToggle, children }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 onClick={onToggle} style={{
        background: "none", border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
        cursor: "pointer", padding: "8px 0", margin: 0, display: "flex", alignItems: "center", gap: 8,
      }}>
        <span style={{ color: "#4a4a6a", fontSize: 12, transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(90deg)" : "rotate(0)" }}>▶</span>
        {title}
      </h2>
      {open && <div style={{ paddingTop: 8 }}>{children}</div>}
    </section>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingBottom: 10, flexWrap: "wrap" }}>
      {items.map(([c, t]) => (
        <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 16, height: 3, background: c, borderRadius: 2, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: "#7a7a8a" }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

function Card({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", flex: "1 1 170px", minWidth: 170 }}>
      <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color, marginTop: 3, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "#4a4a5a", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

/* ── Tooltip Components ── */
const tipBox = { background: "#1c1c30", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: C.txt, fontSize: 12, fontFamily: "monospace", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" };
const tipRow = (c, l, v) => (
  <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
    <span style={{ color: c }}>{l}</span><span>{v}</span>
  </div>
);

function MonthlyTip({ active, payload, t }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div style={{ ...tipBox, minWidth: 200 }}>
      <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14, color: "#fff" }}>{d.year}</div>
      {tipRow(C.rent, t.rentL, `${fmt.n(d.rent)} CZK`)}
      {tipRow(C.buy, t.mtgL, d.mortgage > 0 ? `${fmt.n(d.mortgage)} CZK` : t.paidS)}
      {d.monthlySavings > 0 && (
        <div style={{ fontSize: 11, color: C.inv, marginTop: 4, textAlign: "right" }}>+{fmt.n(d.monthlySavings)}/m</div>
      )}
    </div>
  );
}

function EquityTip({ active, payload, t }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  const ahead = d.buyerEquity >= d.renterEquity;
  return (
    <div style={{ ...tipBox, minWidth: 240 }}>
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14, color: "#fff" }}>{d.year}</div>
      <div style={{ fontSize: 10, color: C.buy, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{t.buyer}</div>
      {tipRow("#aaa", t.prop, fmt.m1(d.propertyValue))}
      {tipRow("#aaa", t.debtL, `−${fmt.m1(d.balance)}`)}
      {tipRow(C.buy, t.eq, fmt.m1(d.buyerEquity))}
      <div style={{ height: 6 }} />
      <div style={{ fontSize: 10, color: C.rent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{t.renter}</div>
      {tipRow("#aaa", t.dpInv, fmt.m1(d.dpInvested))}
      {tipRow("#aaa", t.sav, fmt.m1(d.savingsInvested))}
      {tipRow(C.rent, t.portfolio, fmt.m1(d.renterEquity))}
      <div style={{ borderTop: "1px solid #333", paddingTop: 6, marginTop: 6, fontWeight: 700, color: ahead ? C.buy : C.rent }}>
        {ahead ? `${t.bPlus}${fmt.m1(d.buyerEquity - d.renterEquity)}` : `${t.rPlus}${fmt.m1(d.renterEquity - d.buyerEquity)}`}
      </div>
    </div>
  );
}

/* Chart axis/grid shared props */
const axisProps = { stroke: "#333", fontSize: 11, tickLine: false, tick: { fill: "#5a5a6a" } };
const gridProps = { stroke: "#1e1e30", strokeDasharray: "3 3" };
const dotProps = (c) => ({ r: 5, fill: c, stroke: C.bg, strokeWidth: 2 });

/* ══════════════════════════════════════════
   MAIN APP
   ══════════════════════════════════════════ */
export default function RentVsBuy() {
  const [lang, setLang] = useState("cs");
  const [baseRent, setBaseRent] = useState(22000);
  const [rentRate, setRentRate] = useState(5);
  const [purchasePrice, setPurchasePrice] = useState(8500000);
  const [downPayment, setDownPayment] = useState(1700000);
  const [annualRate, setAnnualRate] = useState(4.5);
  const [mortgageYears, setMortgageYears] = useState(30);
  const [investReturn, setInvestReturn] = useState(8);
  const [propAppr, setPropAppr] = useState(5);
  const [openSec, setOpenSec] = useState({ eq: true, mo: false, tbl: false });

  const t = I18N[lang];
  const toggleSec = useCallback((k) => setOpenSec((p) => ({ ...p, [k]: !p[k] })), []);

  const r = useMemo(
    () => compute(baseRent, rentRate, purchasePrice, downPayment, annualRate, mortgageYears, investReturn, propAppr),
    [baseRent, rentRate, purchasePrice, downPayment, annualRate, mortgageYears, investReturn, propAppr]
  );

  const last = r.data[r.data.length - 1];
  const eqDiff = r.buyEq - r.rentEq;
  const bw = eqDiff >= 0;
  const wc = bw ? C.buy : C.rent;
  const xI = Math.max(1, Math.floor(r.data.length / 7));

  const yMaxEq = useMemo(() => {
    let mx = 0;
    for (const d of r.data) { const v = Math.max(d.buyerEquity, d.renterEquity); if (v > mx) mx = v; }
    return Math.ceil(mx / 1e6) * 1e6 + 1e6;
  }, [r.data]);

  const yMaxMo = useMemo(() => {
    let mx = 0;
    for (const d of r.data) { const v = Math.max(d.rent, d.mortgage); if (v > mx) mx = v; }
    return Math.ceil(mx / 10000) * 10000 + 5000;
  }, [r.data]);

  const verdict = bw
    ? `${t.propWorth} ${fmt.m1(last.propertyValue)} CZK ${last.balance > 0 ? `${t.debt} ${fmt.m1(last.balance)}` : t.paid}. ${t.renterReach} ${fmt.m1(r.rentEq)} CZK.`
    : `${t.investReach} ${fmt.m1(r.rentEq)} CZK (${fmt.m1(last.dpInvested)} ${t.fromDp} + ${fmt.m1(last.savingsInvested)} ${t.fromSav}). ${t.buyerWould} ${fmt.m1(r.buyEq)} CZK.`;

  return (
    <div style={{ background: C.bg, color: C.txt, minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid #1e1e30`, padding: "16px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0 }}>{t.title}</h1>
            <p style={{ color: C.dim, fontSize: 11, margin: "2px 0 0" }}>{t.subtitle}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 10, color: "#4a4a5a" }}>{t.meta}</span>
            {/* Language toggle */}
            <nav aria-label="Language" style={{ display: "flex", background: "#1a1a2a", borderRadius: 8, overflow: "hidden", border: "1px solid #2a2a3e" }}>
              {["cs", "en"].map((l) => (
                <button key={l} onClick={() => setLang(l)} aria-current={lang === l ? "true" : undefined}
                  style={{
                    background: lang === l ? "#2a2a4a" : "transparent", border: "none",
                    color: lang === l ? "#fff" : "#5a5a6a", fontSize: 12, fontWeight: lang === l ? 700 : 400,
                    padding: "6px 14px", cursor: "pointer", fontFamily: "inherit",
                  }}>
                  {l === "cs" ? "CZ" : "EN"}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 32px" }}>

        {/* ── CONTROLS ── */}
        <div role="form" aria-label={t.title} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 32 }}>
          {/* Rent */}
          <fieldset style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px 8px", margin: 0 }}>
            <legend style={{ fontSize: 10, color: C.rent, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, padding: "0 4px" }}>{t.rent}</legend>
            <Slider label={t.monthlyRent} value={baseRent} onChange={setBaseRent} min={8000} max={80000} step={1000} format={fmt.n} unit="CZK" color={C.rent} />
            <Slider label={t.rentGrowth} value={rentRate} onChange={setRentRate} min={0} max={12} step={0.5} unit="%" color={C.rent} />
          </fieldset>
          {/* Buy */}
          <fieldset style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px 8px", margin: 0 }}>
            <legend style={{ fontSize: 10, color: C.buy, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, padding: "0 4px" }}>{t.buy}</legend>
            <Slider label={t.price} value={purchasePrice} onChange={setPurchasePrice} min={2e6} max={25e6} step={5e5} format={fmt.m1} unit="CZK" color={C.buy} />
            <Slider label={t.dp} value={downPayment} onChange={(v) => setDownPayment(Math.min(v, purchasePrice))} min={0} max={Math.min(purchasePrice, 15e6)} step={1e5} format={fmt.m1} unit="CZK" color={C.buy} />
            <Slider label={t.rate} value={annualRate} onChange={setAnnualRate} min={1} max={10} step={0.1} unit="%" color={C.buy} />
            <Slider label={t.term} value={mortgageYears} onChange={setMortgageYears} min={5} max={40} step={1} unit={t.unit} color={C.buy} />
          </fieldset>
          {/* Opportunity cost */}
          <fieldset style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px 8px", margin: 0 }}>
            <legend style={{ fontSize: 10, color: C.inv, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, padding: "0 4px" }}>{t.opp}</legend>
            <Slider label={t.invest} value={investReturn} onChange={setInvestReturn} min={0} max={20} step={0.5} unit={`%${t.perYr}`} color={C.inv} />
            <Slider label={t.appreciation} value={propAppr} onChange={setPropAppr} min={0} max={12} step={0.5} unit={`%${t.perYr}`} color={C.inv} />
            <p style={{ fontSize: 10, color: C.faint, lineHeight: 1.5, margin: "4px 0 8px" }}>{t.oppNote}</p>
          </fieldset>
        </div>

        {/* ══ VERDICT ══ */}
        <div role="status" aria-live="polite" style={{
          background: `linear-gradient(135deg, ${wc}18, ${wc}08)`,
          border: `1px solid ${wc}33`, borderRadius: 16, padding: "28px 28px 24px", marginBottom: 32,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <strong style={{ background: wc, color: "#fff", fontSize: 13, fontWeight: 800, padding: "6px 16px", borderRadius: 20, letterSpacing: 1, textTransform: "uppercase" }}>
              {bw ? t.buyWins : t.rentWins}
            </strong>
            <span style={{ color: "#7a7a8a", fontSize: 13 }}>{t.after} {r.years} {t.yrs}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 8, fontFamily: "monospace", letterSpacing: -1 }}>
            {fmt.m2(Math.abs(eqDiff))} CZK
          </div>
          <p style={{ fontSize: 14, color: "#aaa", lineHeight: 1.7, maxWidth: 700, margin: 0 }}>
            {t.moreBy} {bw ? t.buyVerb : t.rentVerb}. {verdict}
          </p>
          <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
            {[
              [t.lblBuyEq, fmt.m1(r.buyEq), C.buy],
              [t.lblRentEq, fmt.m1(r.rentEq), C.rent],
              [t.lblMtg, fmt.n(r.mp), C.buy],
              [t.lblRent1, fmt.n(baseRent), C.rent],
              [`${t.lblRentN} ${r.years}`, fmt.n(last.rent), C.rent],
            ].map(([l, v, c]) => (
              <div key={l}>
                <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "monospace", marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ EQUITY CHART ══ */}
        <Section title={t.secEquity} open={openSec.eq} onToggle={() => toggleSec("eq")}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 12px 8px 0" }}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={r.data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <defs>
                  <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.buy} stopOpacity={0.15} /><stop offset="95%" stopColor={C.buy} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.rent} stopOpacity={0.15} /><stop offset="95%" stopColor={C.rent} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="year" {...axisProps} interval={xI} />
                <YAxis {...axisProps} tickFormatter={fmt.m1} domain={[0, yMaxEq]} />
                <Tooltip content={<EquityTip t={t} />} />
                <Area type="monotone" dataKey="buyerEquity" stroke={C.buy} strokeWidth={2.5} fill="url(#gB)" activeDot={dotProps(C.buy)} />
                <Area type="monotone" dataKey="renterEquity" stroke={C.rent} strokeWidth={2.5} fill="url(#gR)" activeDot={dotProps(C.rent)} />
              </AreaChart>
            </ResponsiveContainer>
            <Legend items={[[C.buy, t.legBuy], [C.rent, t.legRent]]} />
          </div>
        </Section>

        {/* ══ MONTHLY CHART ══ */}
        <Section title={t.secMonthly} open={openSec.mo} onToggle={() => toggleSec("mo")}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Card label={t.totalBuy} value={`${fmt.m1(r.tMort)} CZK`} sub={`${fmt.m1(downPayment)} ${t.down} + ${fmt.m1(r.tInt)} ${t.interest}`} color={C.buy} />
            <Card label={`${t.totalRent} (${r.years} ${t.unit})`} value={`${fmt.m1(r.tRent)} CZK`} sub={`${fmt.n(baseRent)} → ${fmt.n(last.rent)}/m`} color={C.rent} />
            <Card label={t.cashD} value={`${fmt.m1(Math.abs(r.tMort - r.tRent))} CZK`} sub={r.tMort > r.tRent ? t.buyMore : t.rentMore} color={C.warn} />
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 12px 8px 0" }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={r.data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="year" {...axisProps} interval={xI} />
                <YAxis {...axisProps} tickFormatter={fmt.k} domain={[0, yMaxMo]} />
                <Tooltip content={<MonthlyTip t={t} />} />
                <Line type="monotone" dataKey="rent" stroke={C.rent} strokeWidth={2.5} dot={false} activeDot={dotProps(C.rent)} />
                <Line type="stepAfter" dataKey="mortgage" stroke={C.buy} strokeWidth={2.5} dot={false} activeDot={dotProps(C.buy)} />
              </LineChart>
            </ResponsiveContainer>
            <Legend items={[[C.rent, `${t.rentL} (${rentRate}%${t.perYr})`], [C.buy, `${t.mtgL} (${annualRate}%)`]]} />
          </div>
          {r.cross && (
            <p style={{ background: "#1a1a2a", border: "1px solid #2a2a3a", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#7a7a8a", marginTop: 12 }}>
              {t.crossover} <strong style={{ color: C.warn }}>{r.cross}</strong>.
            </p>
          )}
        </Section>

        {/* ══ TABLE ══ */}
        <Section title={t.secTable} open={openSec.tbl} onToggle={() => toggleSec("tbl")}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 640, fontFamily: "monospace" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {[t.hYear, t.hRent, t.hMtg, t.hInv, t.hBuyEq, t.hRentEq, t.hD].map((h) => (
                    <th key={h} style={{ padding: "10px 10px", textAlign: "right", color: "#4a4a5a", fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.data.map((d, i) => {
                  const eq = d.buyerEquity - d.renterEquity;
                  return (
                    <tr key={d.year} style={{ borderBottom: "1px solid #1a1a2a", background: i & 1 ? "#12121e" : "transparent" }}>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: "#6a6a7a" }}>{d.year}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: C.rent }}>{fmt.n(d.rent)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: C.buy }}>{d.mortgage > 0 ? fmt.n(d.mortgage) : "—"}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: d.monthlySavings > 0 ? C.inv : "#3a3a4a" }}>
                        {d.monthlySavings > 0 ? `+${fmt.n(d.monthlySavings)}` : "—"}
                      </td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: C.buy, fontWeight: 600 }}>{fmt.m1(d.buyerEquity)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: C.rent, fontWeight: 600 }}>{fmt.m1(d.renterEquity)}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: eq >= 0 ? C.buy : C.rent, fontSize: 10 }}>
                        {eq >= 0 ? `${t.bPlus}${fmt.m1(eq)}` : `${t.rPlus}${fmt.m1(Math.abs(eq))}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid #1e1e30", padding: "24px", background: "#0a0a14" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 500 }}>
            <p style={{ fontSize: 11, color: "#3a3a4a", lineHeight: 1.7, margin: 0 }}>{t.disc}</p>
            <p style={{ fontSize: 10, color: "#2a2a3a", marginTop: 8 }}>{t.src}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.dim, marginBottom: 4 }}>{t.contact}</div>
            <a href="mailto:team@rentorbuy.cz" style={{ color: C.rent, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              team@rentorbuy.cz
            </a>
            <div style={{ fontSize: 10, color: "#2a2a3a", marginTop: 8 }}>© 2026 rentorbuy.cz</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
