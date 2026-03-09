import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

/* ══════════════════════════════════════════
   i18n
   ══════════════════════════════════════════ */
const I18N = {
  cs: {
    // Nav
    navCalc: "Kalkulačka", navLearn: "Jak na to", navAbout: "O projektu",
    // Header
    title: "Vyplatí se mi pronájem nebo koupě?",
    meta: "Výchozí hodnoty: průměry Praha, 2026 · Zdroje: Deloitte, ČNB, ČBA, ČSÚ",
    // Controls
    rent: "Pronájem", buy: "Koupě", opp: "Náklady obětované příležitosti",
    monthlyRent: "Měsíční nájem", rentGrowth: "Roční růst nájmu",
    price: "Kupní cena", dp: "Vlastní prostředky",
    rate: "Úroková sazba", term: "Doba splácení",
    invest: "Výnos z investic (např. S&P 500)", appreciation: "Zhodnocení nemovitosti",
    oppNote: "Kdo platí méně měsíčně, investuje rozdíl s daným výnosem. Nájemce navíc investuje vlastní prostředky.",
    // Verdict
    buyWins: "Koupě se vyplatí", rentWins: "Pronájem se vyplatí",
    after: "po", yrs: "letech", moreBy: "více čistého jmění díky",
    horizonLabel: "Horizont hypotéky:",
    breakBuyAfter: "Koupě se vyplatí až od roku",
    breakRentAfter: "Pronájem vede po celou dobu. Koupě se vyplatí až od roku",
    breakAlways: "po celou dobu hypotéky",
    buyVerb: "koupi", rentVerb: "pronájmu + investování",
    propWorth: "Nemovitost bude mít hodnotu", debt: "se zbývajícím dluhem",
    paid: "(splaceno)", renterReach: "Portfolio nájemce by dosáhlo",
    investReach: "Vaše investiční portfolio dosáhne",
    fromDp: "z vlastních prostředků", fromSav: "z měsíčních úspor",
    buyerWould: "Jmění kupujícího by bylo",
    lblBuyEq: "Jmění kupujícího", lblRentEq: "Portfolio nájemce",
    lblMtg: "Hypotéka/měs.", lblRent1: "Nájem rok 1", lblRentN: "Nájem rok",
    // Sections
    secEquity: "Vývoj čistého jmění", secMonthly: "Měsíční platby", secTable: "Roční přehled",
    totalBuy: "Celkové náklady koupě", totalRent: "Celkový nájem", cashD: "Rozdíl cash flow",
    buyMore: "koupě stojí víc", rentMore: "pronájem stojí víc",
    down: "vlastní", interest: "úroky",
    crossover: "Nájem přesáhne splátku hypotéky v roce",
    // Tooltips
    buyer: "Kupující", renter: "Nájemce",
    prop: "Nemovitost", debtL: "− Dluh", eq: "Jmění",
    dpInv: "Investované VP", sav: "Investice", portfolio: "Portfolio",
    bPlus: "Koupě +", rPlus: "Pronájem +",
    // Table
    hYear: "Rok", hRent: "Nájem", hMtg: "Hyp.", hInv: "Invest.", hBuyEq: "Kupující", hRentEq: "Nájemce", hD: "Δ",
    rentL: "Nájem", mtgL: "Hypotéka",
    legBuy: "Kupující (nemovitost − dluh)", legRent: "Nájemce (investiční portfolio)",
    paidS: "Splaceno", perYr: "/rok", bal: "Zůstatek",
    // Footer
    disc: "Upozornění: Zjednodušený model. Nezahrnuje údržbu, daň z nemovitosti, pojištění, transakční poplatky, daňové odpočty úroků, korekci o inflaci ani kauci. Zhodnocení a výnosy nejsou zaručené. Poraďte se s finančním poradcem.",
    src: "Data: Deloitte Rent Index 2025, ČBA Hypomonitor 2025, ČSÚ 2024, RE/MAX Praha 2025, ČNB 2025.",
    contact: "Kontakt", unit: "let",
    // Intro
    intro: "Kolik platíte za nájem? Kolik stojí byt, o kterém uvažujete? Nastavte si čísla a kalkulačka vám ukáže, jestli je pro vás výhodnější pronájem nebo koupě.",
    introLink: "Nevíte, kde začít? Přečtěte si, jak na to",
    howTitle: "3 kroky",
    how1: "Nastavte si parametry pronájmu, koupě a investic",
    how2: "Kalkulačka porovná čisté jmění obou variant",
    how3: "Výsledek najdete níže — posuňte dolů",
    ctaLearnTitle: "Chcete rozumět číslům?",
    ctaLearnDesc: "Vysvětlujeme, proč je rozhodování mezi nájmem a koupí tak složité, co jsou náklady obětované příležitosti a jak kalkulačka počítá. Jednoduše, bez financštiny.",
    ctaLearnBtn: "Přečíst průvodce",
    ctaAboutTitle: "O projektu",
    ctaAboutDesc: "Kdo za tím stojí a proč jsme to udělali.",
    ctaAboutBtn: "Zjistit víc",
    // ── LEARN PAGE ──
    learnHero: "Pronájem nebo koupě? Pojďme si to rozebrat.",
    learnHeroSub: "Bez emocí, bez tlaku. Jen čísla a zdravý rozum.",
    // Section 1: Emotions
    emo1Title: "Proč je to tak těžké rozhodnutí?",
    emo1p1: "\"Platit nájem je vyhazování peněz.\" Tohle jste určitě slyšeli. Od rodičů, od kolegů, možná i od realitního makléře. A zní to logicky — proč platit někomu jinému, když můžu splácet vlastní byt?",
    emo1p2: "Jenže realita je složitější. Rozhodování mezi pronájmem a koupí je jedno z největších finančních rozhodnutí v životě. A bohužel, většina lidí ho dělá na základě emocí místo čísel.",
    emo1p3: "\"Vlastní bydlení\" zní jako jistota. Ale co když vám ukážeme, že za určitých podmínek může být pronájem + investování finančně výhodnější? Ne vždy, ale někdy ano. A přesně to naše kalkulačka počítá.",
    // Section 2: What most people miss
    emo2Title: "Co většina lidí přehlíží",
    emo2i1t: "Náklady obětované příležitosti",
    emo2i1: "Když dáte 2 miliony jako zálohu na byt, nemůžete je investovat jinam. Kdybyste je nechali růst na akciovém trhu 30 let s výnosem 8 % ročně, máte z nich přes 20 milionů. To je cena, kterou za koupě platíte — i když ji nevidíte.",
    emo2i2t: "Rozdíl v měsíčních platbách",
    emo2i2: "Když je hypotéka dražší než nájem (nebo naopak), ten rozdíl můžete každý měsíc investovat. Naše kalkulačka tohle počítá pro obě strany — ať už šetříte jako nájemce nebo jako vlastník.",
    emo2i3t: "Zhodnocení nemovitosti není zaručené",
    emo2i3: "Ano, ceny bytů v Praze rostly. Ale také v letech 2008–2013 stagnovaly nebo klesaly. Nemovitost je investice, a jako každá investice má riziko. Naše kalkulačka vám umožní nastavit vlastní odhad růstu.",
    // Section 3: How calculator works
    emo3Title: "Jak naše kalkulačka funguje",
    emo3p1: "Kalkulačka porovnává dvě varianty vašeho budoucího já za 10, 20 nebo 30 let:",
    emo3v1t: "Varianta A: Kupujete",
    emo3v1: "Zaplatíte zálohu, vezmete si hypotéku a splácíte. Za tu dobu vaše nemovitost (doufejme) roste na hodnotě. Pokud je nájem dražší než splátka, investujete rozdíl. Na konci máte: hodnota bytu − zbývající dluh + investice z úspor.",
    emo3v2t: "Varianta B: Pronajímáte + investujete",
    emo3v2: "Zálohu, kterou byste dali na byt, investujete (třeba do indexového fondu). Pokud je splátka hypotéky dražší než váš nájem, ten rozdíl také investujete. Na konci máte: investiční portfolio.",
    emo3p2: "Kalkulačka pak jednoduše porovná: kdo má na konci víc? Kupující s bytem, nebo nájemce s portfoliem?",
    // Section 4: Each slider explained
    emo4Title: "Co znamená každé nastavení",
    emo4s1t: "Měsíční nájem",
    emo4s1: "Kolik platíte (nebo byste platili) za pronájem. V Praze je průměr pro 2+kk kolem 22 000 Kč.",
    emo4s2t: "Roční růst nájmu",
    emo4s2: "Jak rychle roste nájem. V Praze to bylo historicky 5–7 % ročně. Celostátní průměr je nižší, kolem 4 %.",
    emo4s3t: "Kupní cena",
    emo4s3: "Celková cena bytu, který byste koupili. Pro srovnatelný byt k nájmu výše nastavte stejnou úroveň.",
    emo4s4t: "Vlastní prostředky (záloha)",
    emo4s4: "Kolik dáte z vlastních peněz. Banky typicky vyžadují minimálně 20 %. Tento obnos je důležitý — pokud nekupujete, můžete ho investovat.",
    emo4s5t: "Úroková sazba hypotéky",
    emo4s5: "Aktuální průměr v ČR je kolem 4,5 %. Může se měnit při refixaci.",
    emo4s6t: "Doba splácení",
    emo4s6: "Typicky 25–30 let. Delší doba = nižší splátky, ale víc zaplacených úroků.",
    emo4s7t: "Výnos z investic",
    emo4s7: "Kolik by vydělaly vaše peníze na trhu. S&P 500 má historický průměr kolem 10 % ročně. My defaultně používáme 8 % — konzervativnější odhad.",
    emo4s8t: "Zhodnocení nemovitosti",
    emo4s8: "Jak rychle roste cena bytu. V Praze se odhaduje 5–6 % ročně na příštích 10 let. Záleží na lokalitě.",
    // Section 5: Key takeaway
    emo5Title: "Takže co si z toho odnést?",
    emo5p1: "Neexistuje univerzální odpověď. Záleží na vašem nájmu, na ceně bytu, na úrokové sazbě, na tom, jak dlouho plánujete bydlet, a na tom, co byste dělali s penězi, které byste jinak investovali.",
    emo5p2: "Naše kalkulačka vám nedá odpověď na to, jestli máte koupit byt. Ale ukáže vám čísla, která za normálních okolností nikdo nepočítá. A s čísly se rozhoduje líp než s emocemi.",
    emo5cta: "Vyzkoušet kalkulačku",
    // ── ABOUT PAGE ──
    aboutTitle: "O projektu rentorbuy.cz",
    aboutP1: "Tenhle projekt vznikl z jednoduchého důvodu: chtěli jsme si sami spočítat, jestli se nám vyplatí koupit byt, nebo jestli je lepší zůstat v nájmu a investovat. Zjistili jsme, že žádná česká kalkulačka nepočítá s náklady obětované příležitosti — tedy s tím, co by vaše peníze vydělaly, kdybyste je investovali místo do nemovitosti.",
    aboutP2: "Tak jsme si ji udělali sami. A pak jsme ji sdíleli, protože si myslíme, že každý by měl mít přístup k těmhle číslům. Zdarma, bez registrace, bez reklam.",
    aboutP3: "Kalkulačka používá reálná data z českého trhu — průměrné nájmy z Deloitte Rent Indexu, ceny bytů z ČSÚ, úrokové sazby z ČBA Hypomonitoru a prognózy ČNB.",
    aboutP4: "Nejsme finanční poradci. Kalkulačka je zjednodušený model, který nezahrnuje všechny náklady (údržba, daně, pojištění, transakční poplatky). Ale dává vám základ pro informované rozhodnutí — ne rozhodnutí založené na \u201Eplatit nájem je vyhazování peněz\u201C.",
    aboutTeam: "Za projektem stojí",
    aboutTeamDesc: "Parta lidí, která věří, že finanční rozhodnutí by se měla dělat s čísly, ne s emocemi.",
    aboutContact: "Napište nám",
    aboutCalcDesc: "Spočítejte si, jestli se vám víc vyplatí pronájem nebo koupě.",
    aboutCalcBtn: "Spustit kalkulačku",
    aboutLearnDesc: "Vysvětlujeme pozadí, náklady obětované příležitosti a jak kalkulačka počítá.",
  },
  en: {
    navCalc: "Calculator", navLearn: "Learn", navAbout: "About",
    title: "Should I Rent or Buy?",
    meta: "Defaults: Prague averages, 2026 · Sources: Deloitte, CNB, CBA, CZSO",
    rent: "Renting", buy: "Buying", opp: "Opportunity cost",
    monthlyRent: "Monthly rent", rentGrowth: "Annual rent increase",
    price: "Purchase price", dp: "Down payment",
    rate: "Mortgage rate", term: "Mortgage term",
    invest: "Investment return (e.g. S&P 500)", appreciation: "Property appreciation",
    oppNote: "Whoever pays less per month invests the difference. Renter also invests the down payment.",
    buyWins: "Buying wins", rentWins: "Renting wins",
    after: "after", yrs: "years", moreBy: "more net equity by",
    horizonLabel: "Mortgage horizon:",
    breakBuyAfter: "Buying becomes better from",
    breakRentAfter: "Renting leads the whole time. Buying only wins from",
    breakAlways: "for the entire mortgage term",
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
    dpInv: "DP invested", sav: "Investments", portfolio: "Portfolio",
    bPlus: "Buy +", rPlus: "Rent +",
    hYear: "Year", hRent: "Rent", hMtg: "Mtg", hInv: "Invests", hBuyEq: "Buyer", hRentEq: "Renter", hD: "Δ",
    rentL: "Rent", mtgL: "Mortgage",
    legBuy: "Buyer (property − debt)", legRent: "Renter (investment portfolio)",
    paidS: "Paid off", perYr: "/yr", bal: "Balance",
    disc: "Disclaimer: Simplified model. Does not include maintenance, property tax, insurance, transaction fees, mortgage interest deductions, inflation adjustment, or deposit. Returns are not guaranteed. Consult a financial advisor.",
    src: "Data: Deloitte Rent Index 2025, CBA Hypomonitor 2025, CZSO 2024, RE/MAX Prague 2025, CNB 2025.",
    contact: "Contact", unit: "years",
    intro: "How much do you pay in rent? How much does the apartment you're considering cost? Set the numbers and the calculator will tell you whether renting or buying makes more sense for you.",
    introLink: "Not sure where to start? Read our guide",
    howTitle: "3 steps",
    how1: "Set your rent, purchase, and investment parameters",
    how2: "The calculator compares net equity of both options",
    how3: "Scroll down to see the result",
    ctaLearnTitle: "Want to understand the numbers?",
    ctaLearnDesc: "We explain why choosing between renting and buying is so hard, what opportunity cost means, and how the calculator works. Simply, no financial jargon.",
    ctaLearnBtn: "Read the guide",
    ctaAboutTitle: "About the project",
    ctaAboutDesc: "Who's behind it and why we built it.",
    ctaAboutBtn: "Learn more",
    learnHero: "Rent or buy? Let's break it down.",
    learnHeroSub: "No emotions, no pressure. Just numbers and common sense.",
    emo1Title: "Why is this such a hard decision?",
    emo1p1: "\"Paying rent is throwing money away.\" You've heard this before. From your parents, colleagues, maybe even a real estate agent. And it sounds logical — why pay someone else when you could be paying off your own place?",
    emo1p2: "But reality is more complex. Choosing between renting and buying is one of the biggest financial decisions of your life. And unfortunately, most people make it based on emotions rather than numbers.",
    emo1p3: "\"Owning your home\" sounds like security. But what if we showed you that under certain conditions, renting + investing can be financially better? Not always, but sometimes. And that's exactly what our calculator computes.",
    emo2Title: "What most people overlook",
    emo2i1t: "Opportunity cost",
    emo2i1: "When you put 2 million CZK as a down payment, you can't invest it elsewhere. If you let it grow in the stock market for 30 years at 8% annually, it becomes over 20 million. That's the price you pay for buying — even though you don't see it.",
    emo2i2t: "Monthly payment difference",
    emo2i2: "When the mortgage is more expensive than rent (or vice versa), you can invest that difference every month. Our calculator tracks this for both sides — whether you save as a renter or as an owner.",
    emo2i3t: "Property appreciation isn't guaranteed",
    emo2i3: "Yes, Prague apartment prices have been rising. But they also stagnated or dropped in 2008–2013. Real estate is an investment, and like any investment, it carries risk. Our calculator lets you set your own growth estimate.",
    emo3Title: "How our calculator works",
    emo3p1: "The calculator compares two versions of your future self in 10, 20, or 30 years:",
    emo3v1t: "Option A: You buy",
    emo3v1: "You pay a down payment, get a mortgage, and make payments. Over time, your property (hopefully) grows in value. If rent is more expensive than your payment, you invest the difference. At the end you have: property value − remaining debt + savings invested.",
    emo3v2t: "Option B: You rent + invest",
    emo3v2: "The down payment you would have spent goes into investments (like an index fund). If the mortgage payment would be more expensive than rent, you invest that difference too. At the end you have: investment portfolio.",
    emo3p2: "The calculator then simply compares: who has more at the end? The buyer with a flat, or the renter with a portfolio?",
    emo4Title: "What each setting means",
    emo4s1t: "Monthly rent", emo4s1: "How much you pay (or would pay) to rent. Prague average for a 2+kk is around 22,000 CZK.",
    emo4s2t: "Annual rent increase", emo4s2: "How fast rent grows. In Prague, historically 5–7% per year. The national average is lower, around 4%.",
    emo4s3t: "Purchase price", emo4s3: "Total price of the apartment you'd buy. Set it to a comparable level as the rental above.",
    emo4s4t: "Down payment", emo4s4: "How much you put down from your own savings. Banks typically require at least 20%. This amount matters — if you don't buy, you can invest it.",
    emo4s5t: "Mortgage rate", emo4s5: "Current Czech average is around 4.5%. May change at refixation.",
    emo4s6t: "Mortgage term", emo4s6: "Typically 25–30 years. Longer = lower payments, but more interest paid.",
    emo4s7t: "Investment return", emo4s7: "What your money could earn in the market. S&P 500 historical average is about 10% annually. We default to 8% — a more conservative estimate.",
    emo4s8t: "Property appreciation", emo4s8: "How fast the apartment price grows. Prague is estimated at 5–6% annually over the next decade. Depends on location.",
    emo5Title: "So what's the takeaway?",
    emo5p1: "There's no universal answer. It depends on your rent, the apartment price, the interest rate, how long you plan to stay, and what you'd do with the money you'd otherwise invest.",
    emo5p2: "Our calculator won't tell you whether to buy. But it'll show you numbers that nobody normally calculates. And decisions are better made with numbers than with emotions.",
    emo5cta: "Try the calculator",
    aboutTitle: "About rentorbuy.cz",
    aboutP1: "This project started for a simple reason: we wanted to calculate whether it makes sense to buy an apartment or keep renting and investing. We found that no Czech calculator accounts for opportunity cost — the return your money could earn if invested instead of being locked in real estate.",
    aboutP2: "So we built our own. And then shared it, because we believe everyone should have access to these numbers. Free, no registration, no ads.",
    aboutP3: "The calculator uses real Czech market data — average rents from the Deloitte Rent Index, apartment prices from CZSO, mortgage rates from the CBA Hypomonitor, and CNB forecasts.",
    aboutP4: "We're not financial advisors. The calculator is a simplified model that doesn't include all costs (maintenance, taxes, insurance, transaction fees). But it gives you a foundation for an informed decision — not one based on \"paying rent is throwing money away.\"",
    aboutTeam: "The team behind this",
    aboutTeamDesc: "A group of people who believe financial decisions should be made with numbers, not emotions.",
    aboutContact: "Get in touch",
    aboutCalcDesc: "Calculate whether renting or buying makes more sense for you.",
    aboutCalcBtn: "Open calculator",
    aboutLearnDesc: "We explain the background, opportunity cost, and how the calculator works.",
  },
};

/* ══════════════════════════════════════════
   CONSTANTS & FORMATTERS
   ══════════════════════════════════════════ */
const themes = {
  dark: {
    bg: "#0e0e1a", card: "#151522", border: "#222238",
    buy: "#fb7185", rent: "#818cf8", inv: "#4ade80", warn: "#fbbf24",
    txt: "#e0e0e0", txt2: "#ccc", dim: "#8a8a9a", dim2: "#7a7a8a", faint: "#4a4a5a", muted: "#3a3a4a",
    sliderTrack: "#2a2a3e", tipBg: "#1c1c30", tipBorder: "#333", tipSub: "#aaa",
    grid: "#1e1e30", axis: "#333", axisTick: "#5a5a6a",
    rowAlt: "#12121e", rowBorder: "#1a1a2a",
    headerBg: "#0e0e1a", menuBg: "#12121e", menuBorder: "#2a2a3e",
    footerBg: "#0a0a14", footerBorder: "#1e1e30", footerTxt: "#4a4a5a", footerTxt2: "#3a3a4a",
    langBg: "#1a1a2a", langActiveBg: "#2a2a4a", langBorder: "#2a2a3e",
    stepBg: "#2a2a3e", stepTxt: "#aaa",
    crossBg: "#1a1a2a", crossBorder: "#2a2a3a",
  },
  light: {
    bg: "#f5f5f7", card: "#ffffff", border: "#e0e0e6",
    buy: "#e11d48", rent: "#6366f1", inv: "#16a34a", warn: "#d97706",
    txt: "#1a1a2a", txt2: "#333", dim: "#555", dim2: "#666", faint: "#999", muted: "#bbb",
    sliderTrack: "#ddd", tipBg: "#fff", tipBorder: "#ddd", tipSub: "#666",
    grid: "#eee", axis: "#ccc", axisTick: "#888",
    rowAlt: "#f8f8fa", rowBorder: "#eee",
    headerBg: "#ffffff", menuBg: "#f8f8fa", menuBorder: "#e0e0e6",
    footerBg: "#eeeef0", footerBorder: "#e0e0e6", footerTxt: "#888", footerTxt2: "#aaa",
    langBg: "#eee", langActiveBg: "#ddd", langBorder: "#d0d0d8",
    stepBg: "#e8e8ee", stepTxt: "#555",
    crossBg: "#eee", crossBorder: "#ddd",
  },
};

// Default — will be overridden by theme prop
let C = themes.dark;

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
  const totalYears = mortgageYears + 1;

  const mp = principal <= 0 ? 0
    : mRate > 0 ? Math.round(principal * mRate * Math.pow(1 + mRate, nPay) / (Math.pow(1 + mRate, nPay) - 1))
    : Math.round(principal / nPay);

  let bal = principal, dpC = downPayment, rSav = 0, bSav = 0, cross = null;

  const rows = Array.from({ length: totalYears }, (_, i) => {
    const rent = Math.round(baseRent * Math.pow(1 + rRate, i));
    const mtg = i < mortgageYears ? mp : 0;
    const pv = Math.round(purchasePrice * Math.pow(1 + pRate, i));
    let yI = 0, yP = 0, rMS = 0, rMSc = 0, bMS = 0, bMSc = 0;

    for (let m = 0; m < 12; m++) {
      if (bal > 0 && i < mortgageYears) {
        const mi = bal * mRate, mP = mp - mi;
        yI += mi; yP += Math.min(mP, bal); bal = Math.max(0, bal - mP);
      }
      const diff = mtg - rent;
      if (diff > 0) { rSav = (rSav + diff) * (1 + iRateM); bSav *= (1 + iRateM); rMS += diff; rMSc++; }
      else if (diff < 0) { bSav = (bSav - diff) * (1 + iRateM); rSav *= (1 + iRateM); bMS -= diff; bMSc++; }
      else { rSav *= (1 + iRateM); bSav *= (1 + iRateM); }
      dpC *= (1 + iRateM);
    }
    if (!cross && rent >= mtg && mtg > 0) cross = 2026 + i;
    return {
      year: 2026 + i, rent, mortgage: mtg, yearInterest: Math.round(yI),
      balance: Math.round(Math.max(0, bal)), propertyValue: pv,
      buyerEquity: Math.round(pv - Math.max(0, bal) + bSav),
      renterEquity: Math.round(dpC + rSav),
      dpInvested: Math.round(dpC), renterSavInvested: Math.round(rSav),
      buyerSavInvested: Math.round(bSav),
      renterMoSav: rMSc > 0 ? Math.round(rMS / rMSc) : 0,
      buyerMoSav: bMSc > 0 ? Math.round(bMS / bMSc) : 0,
    };
  });

  // Find breakpoint: year where winner changes
  let breakpoint = null;
  for (let i = 1; i < rows.length; i++) {
    const prevBuyWins = rows[i - 1].buyerEquity >= rows[i - 1].renterEquity;
    const curBuyWins = rows[i].buyerEquity >= rows[i].renterEquity;
    if (prevBuyWins !== curBuyWins) {
      breakpoint = { year: rows[i].year, buyWinsAfter: curBuyWins };
    }
  }

  const tRent = rows.reduce((s, d) => s + d.rent * 12, 0);
  const last = rows[rows.length - 1];
  return { data: rows, mp, tMort: mp * nPay + downPayment, tInt: mp * nPay - principal, tRent, cross, buyEq: last.buyerEquity, rentEq: last.renterEquity, years: totalYears - 1, breakpoint };
}

/* ══════════════════════════════════════════
   SHARED COMPONENTS
   ══════════════════════════════════════════ */
function Slider({ label, value, onChange, min, max, step, format, unit, color }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label style={{ display: "block", marginBottom: 14, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: C.dim }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "monospace" }}>{format ? format(value) : value}{unit && ` ${unit}`}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} aria-label={label}
        style={{ width: "100%", height: 5, appearance: "none", WebkitAppearance: "none", background: `linear-gradient(90deg,${color} ${pct}%,${C.sliderTrack} ${pct}%)`, borderRadius: 6, outline: "none", cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.faint, marginTop: 2 }}>
        <span>{format ? format(min) : min}{unit && ` ${unit}`}</span><span>{format ? format(max) : max}{unit && ` ${unit}`}</span>
      </div>
    </label>
  );
}

function ChartSection({ title, open, onToggle, children }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 onClick={onToggle} style={{ background: "none", border: "none", color: C.txt, fontSize: 15, fontWeight: 700, cursor: "pointer", padding: "8px 0", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.faint, fontSize: 12, transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(90deg)" : "rotate(0)" }}>▶</span>{title}
      </h2>
      {open && <div style={{ paddingTop: 8 }}>{children}</div>}
    </section>
  );
}

function ChartLegend({ items }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingBottom: 10, flexWrap: "wrap" }}>
      {items.map(([c, t]) => (<div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 16, height: 3, background: c, borderRadius: 2, display: "inline-block" }} /><span style={{ fontSize: 11, color: C.dim2 }}>{t}</span></div>))}
    </div>
  );
}

function Card({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", flex: "1 1 170px", minWidth: 170 }}>
      <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color, marginTop: 3, fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.faint, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

const getTipBox = () => ({ background: C.tipBg, border: `1px solid ${C.tipBorder}`, borderRadius: 8, padding: "12px 16px", color: C.txt, fontSize: 12, fontFamily: "monospace", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" });
const tipRow = (c, l, v) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ color: c }}>{l}</span><span>{v}</span></div>);

function MonthlyTip({ active, payload, t }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (<div style={{ ...getTipBox(), minWidth: 200 }}>
    <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14, color: C.txt }}>{d.year}</div>
    {tipRow(C.rent, t.rentL, `${fmt.n(d.rent)} CZK`)}
    {tipRow(C.buy, t.mtgL, d.mortgage > 0 ? `${fmt.n(d.mortgage)} CZK` : t.paidS)}
    {d.renterMoSav > 0 && <div style={{ fontSize: 11, color: C.inv, marginTop: 4, textAlign: "right" }}>{t.renter} +{fmt.n(d.renterMoSav)}/m</div>}
    {d.buyerMoSav > 0 && <div style={{ fontSize: 11, color: C.inv, marginTop: 4, textAlign: "right" }}>{t.buyer} +{fmt.n(d.buyerMoSav)}/m</div>}
  </div>);
}

function EquityTip({ active, payload, t }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  const ah = d.buyerEquity >= d.renterEquity;
  return (<div style={{ ...getTipBox(), minWidth: 240 }}>
    <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14, color: C.txt }}>{d.year}</div>
    <div style={{ fontSize: 10, color: C.buy, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{t.buyer}</div>
    {tipRow(C.tipSub, t.prop, fmt.m1(d.propertyValue))}{tipRow(C.tipSub, t.debtL, `−${fmt.m1(d.balance)}`)}{d.buyerSavInvested > 0 && tipRow(C.tipSub, t.sav, fmt.m1(d.buyerSavInvested))}{tipRow(C.buy, t.eq, fmt.m1(d.buyerEquity))}
    <div style={{ height: 6 }} />
    <div style={{ fontSize: 10, color: C.rent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{t.renter}</div>
    {tipRow(C.tipSub, t.dpInv, fmt.m1(d.dpInvested))}{d.renterSavInvested > 0 && tipRow(C.tipSub, t.sav, fmt.m1(d.renterSavInvested))}{tipRow(C.rent, t.portfolio, fmt.m1(d.renterEquity))}
    <div style={{ borderTop: "1px solid #333", paddingTop: 6, marginTop: 6, fontWeight: 700, color: ah ? C.buy : C.rent }}>{ah ? `${t.bPlus}${fmt.m1(d.buyerEquity - d.renterEquity)}` : `${t.rPlus}${fmt.m1(d.renterEquity - d.buyerEquity)}`}</div>
  </div>);
}

const getAx = () => ({ stroke: C.axis, fontSize: 11, tickLine: false, tick: { fill: C.axisTick } });
const getGr = () => ({ stroke: C.grid, strokeDasharray: "3 3" });
const dp = (c) => ({ r: 5, fill: c, stroke: C.bg, strokeWidth: 2 });

/* ══════════════════════════════════════════
   LEARN PAGE
   ══════════════════════════════════════════ */
function LearnPage({ t, onGoCalc }) {
  const P = ({ children, style }) => <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.8, margin: "0 0 16px", textAlign: "justify", ...style }}>{children}</p>;
  const H = ({ children, icon }) => <h2 style={{ fontSize: 22, fontWeight: 800, color: C.txt, margin: "48px 0 20px", display: "flex", alignItems: "center", gap: 10 }}>{icon && <span style={{ fontSize: 24 }}>{icon}</span>}{children}</h2>;
  const Item = ({ title, children, color }) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 22px", marginBottom: 12 }}>
      <div style={{ fontWeight: 700, color: color || C.txt, fontSize: 14, marginBottom: 8 }}>{title}</div>
      <P style={{ margin: 0 }}>{children}</P>
    </div>
  );

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "24px 24px 48px" }}>
      {/* Hero */}
      <div style={{ padding: "40px 0 32px", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.txt, lineHeight: 1.3, margin: 0 }}>{t.learnHero}</h1>
        <p style={{ fontSize: 16, color: C.dim, marginTop: 8 }}>{t.learnHeroSub}</p>
      </div>

      {/* Emotions */}
      <H icon="🤯">{t.emo1Title}</H>
      <P>{t.emo1p1}</P><P>{t.emo1p2}</P><P>{t.emo1p3}</P>

      {/* What people miss */}
      <H icon="🔍">{t.emo2Title}</H>
      <Item title={t.emo2i1t} color={C.inv}>{t.emo2i1}</Item>
      <Item title={t.emo2i2t} color={C.rent}>{t.emo2i2}</Item>
      <Item title={t.emo2i3t} color={C.inv}>{t.emo2i3}</Item>

      {/* How calc works */}
      <H icon="⚙️">{t.emo3Title}</H>
      <P>{t.emo3p1}</P>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12, margin: "16px 0" }}>
        <Item title={t.emo3v1t} color={C.buy}>{t.emo3v1}</Item>
        <Item title={t.emo3v2t} color={C.rent}>{t.emo3v2}</Item>
      </div>
      <P style={{ fontStyle: "italic", color: C.faint }}>{t.emo3p2}</P>

      {/* Each slider */}
      <H icon="🎛️">{t.emo4Title}</H>
      {[
        [t.emo4s1t, t.emo4s1, C.rent], [t.emo4s2t, t.emo4s2, C.rent],
        [t.emo4s3t, t.emo4s3, C.buy], [t.emo4s4t, t.emo4s4, C.buy],
        [t.emo4s5t, t.emo4s5, C.buy], [t.emo4s6t, t.emo4s6, C.buy],
        [t.emo4s7t, t.emo4s7, C.inv], [t.emo4s8t, t.emo4s8, C.inv],
      ].map(([title, desc, color]) => <Item key={title} title={title} color={color}>{desc}</Item>)}

      {/* Takeaway */}
      <H icon="💡">{t.emo5Title}</H>
      <P>{t.emo5p1}</P><P>{t.emo5p2}</P>
      <button onClick={onGoCalc} style={{
        display: "block", width: "100%", padding: "16px", marginTop: 24,
        background: C.rent, color: "#fff", fontSize: 16, fontWeight: 700,
        border: "none", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
      }}>{t.emo5cta} →</button>
    </main>
  );
}

/* ══════════════════════════════════════════
   ABOUT PAGE
   ══════════════════════════════════════════ */
function AboutPage({ t, track, onGoCalc, onGoLearn }) {
  const P = ({ children }) => <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.8, margin: "0 0 16px", textAlign: "justify" }}>{children}</p>;
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "24px 24px 48px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: C.txt, margin: "40px 0 24px" }}>{t.aboutTitle}</h1>
      <P>{t.aboutP1}</P><P>{t.aboutP2}</P><P>{t.aboutP3}</P><P>{t.aboutP4}</P>

      {/* Links to other sections */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 32 }}>
        <button onClick={onGoCalc} style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: "20px", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>🧮</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{t.navCalc}</span>
          </div>
          <div style={{ fontSize: 13, color: C.dim, textAlign: "justify" }}>{t.aboutCalcDesc}</div>
          <span style={{ color: C.rent, fontSize: 13, fontWeight: 600, display: "inline-block", marginTop: 10 }}>{t.aboutCalcBtn} →</span>
        </button>
        <button onClick={onGoLearn} style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: "20px", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>📖</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{t.navLearn}</span>
          </div>
          <div style={{ fontSize: 13, color: C.dim, textAlign: "justify" }}>{t.aboutLearnDesc}</div>
          <span style={{ color: C.rent, fontSize: 13, fontWeight: 600, display: "inline-block", marginTop: 10 }}>{t.ctaLearnBtn} →</span>
        </button>
      </div>

      {/* Contact */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px", marginTop: 12 }}>
        <div style={{ fontSize: 13, color: C.dim, marginBottom: 6 }}>{t.aboutContact}</div>
        <a href="mailto:team@rentorbuy.cz" onClick={() => track("contact_click", { method: "email" })}
          style={{ color: C.rent, fontSize: 18, textDecoration: "none", fontWeight: 700 }}>team@rentorbuy.cz</a>
      </div>
    </main>
  );
}

/* ══════════════════════════════════════════
   CALCULATOR PAGE
   ══════════════════════════════════════════ */
function CalcPage({ t, track, onGoLearn, onGoAbout }) {
  const [baseRent, setBaseRent] = useState(22000);
  const [rentRate, setRentRate] = useState(5);
  const [purchasePrice, setPurchasePrice] = useState(8500000);
  const [downPayment, setDownPayment] = useState(1700000);
  const [annualRate, setAnnualRate] = useState(4.5);
  const [mortgageYears, setMortgageYears] = useState(30);
  const [investReturn, setInvestReturn] = useState(8);
  const [propAppr, setPropAppr] = useState(5);
  const [openSec, setOpenSec] = useState({ eq: true, mo: false, tbl: false });
  const verdictRef = useRef(null);
  const [verdictVis, setVerdictVis] = useState(false);

  useEffect(() => {
    const el = verdictRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setVerdictVis(e.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggleSec = useCallback((k) => {
    setOpenSec((p) => { const n = { ...p, [k]: !p[k] }; if (n[k]) track("section_opened", { section: k }); return n; });
  }, [track]);

  const r = useMemo(() => compute(baseRent, rentRate, purchasePrice, downPayment, annualRate, mortgageYears, investReturn, propAppr),
    [baseRent, rentRate, purchasePrice, downPayment, annualRate, mortgageYears, investReturn, propAppr]);

  const last = r.data[r.data.length - 1];
  const eqDiff = r.buyEq - r.rentEq;
  const bw = eqDiff >= 0;
  const wc = bw ? C.buy : C.rent;
  const xI = Math.max(1, Math.floor(r.data.length / 7));

  const prevV = useRef(null);
  if (prevV.current !== null && prevV.current !== bw) track("verdict_changed", { new_verdict: bw ? "buy" : "rent", equity_diff_m: Math.round(Math.abs(eqDiff) / 1e6) });
  prevV.current = bw;

  const yMaxEq = useMemo(() => { let mx = 0; for (const d of r.data) { const v = Math.max(d.buyerEquity, d.renterEquity); if (v > mx) mx = v; } return Math.ceil(mx / 1e6) * 1e6 + 1e6; }, [r.data]);
  const yMaxMo = useMemo(() => { let mx = 0; for (const d of r.data) { const v = Math.max(d.rent, d.mortgage); if (v > mx) mx = v; } return Math.ceil(mx / 10000) * 10000 + 5000; }, [r.data]);

  const vText = bw
    ? `${t.propWorth} ${fmt.m1(last.propertyValue)} CZK ${last.balance > 0 ? `${t.debt} ${fmt.m1(last.balance)}` : t.paid}${last.buyerSavInvested > 0 ? ` + ${fmt.m1(last.buyerSavInvested)} ${t.fromSav}` : ""}. ${t.renterReach} ${fmt.m1(r.rentEq)} CZK.`
    : `${t.investReach} ${fmt.m1(r.rentEq)} CZK (${fmt.m1(last.dpInvested)} ${t.fromDp}${last.renterSavInvested > 0 ? ` + ${fmt.m1(last.renterSavInvested)} ${t.fromSav}` : ""}). ${t.buyerWould} ${fmt.m1(r.buyEq)} CZK.`;

  return (
    <>
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 32px" }}>
        {/* Intro */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 20px 16px" }}>
            <p style={{ fontSize: 15, color: C.txt, lineHeight: 1.7, margin: "0 0 14px", textAlign: "justify" }}>{t.intro}</p>
            <button onClick={onGoLearn} style={{
              background: "none", border: "none", color: C.rent, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", padding: 0, textAlign: "left",
            }}>
              📖 {t.introLink} →
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[t.how1, t.how2, t.how3].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "10px 12px", display: "flex", flexDirection: "column", gap: 6, alignItems: "center", textAlign: "center",
              }}>
                <span style={{
                  background: C.stepBg, color: C.stepTxt,
                  fontSize: 11, fontWeight: 800, borderRadius: 10,
                  width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</span>
                <span style={{ fontSize: 11, color: C.dim2, lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div role="form" aria-label={t.title} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 24 }}>
          <fieldset style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px 8px", margin: 0 }}>
            <legend style={{ fontSize: 10, color: C.rent, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, padding: "0 4px" }}>{t.rent}</legend>
            <Slider label={t.monthlyRent} value={baseRent} onChange={setBaseRent} min={8000} max={80000} step={1000} format={fmt.n} unit="CZK" color={C.rent} />
            <Slider label={t.rentGrowth} value={rentRate} onChange={setRentRate} min={0} max={12} step={0.5} unit="%" color={C.rent} />
          </fieldset>
          <fieldset style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px 8px", margin: 0 }}>
            <legend style={{ fontSize: 10, color: C.buy, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, padding: "0 4px" }}>{t.buy}</legend>
            <Slider label={t.price} value={purchasePrice} onChange={setPurchasePrice} min={2e6} max={30e6} step={5e5} format={fmt.m1} unit="CZK" color={C.buy} />
            <Slider label={t.dp} value={downPayment} onChange={(v) => setDownPayment(Math.min(v, purchasePrice))} min={0} max={purchasePrice} step={1e5} format={fmt.m1} unit="CZK" color={C.buy} />
            <Slider label={t.rate} value={annualRate} onChange={setAnnualRate} min={1} max={10} step={0.1} unit="%" color={C.buy} />
            <Slider label={t.term} value={mortgageYears} onChange={setMortgageYears} min={5} max={40} step={1} unit={t.unit} color={C.buy} />
          </fieldset>
          <fieldset style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px 8px", margin: 0 }}>
            <legend style={{ fontSize: 10, color: C.inv, textTransform: "uppercase", letterSpacing: 2, fontWeight: 700, padding: "0 4px" }}>{t.opp}</legend>
            <Slider label={t.invest} value={investReturn} onChange={setInvestReturn} min={0} max={20} step={0.5} unit={`%${t.perYr}`} color={C.inv} />
            <Slider label={t.appreciation} value={propAppr} onChange={setPropAppr} min={0} max={12} step={0.5} unit={`%${t.perYr}`} color={C.inv} />
            <p style={{ fontSize: 10, color: C.faint, lineHeight: 1.5, margin: "4px 0 8px" }}>{t.oppNote}</p>
          </fieldset>
        </div>

        {/* Verdict */}
        <div ref={verdictRef} role="status" aria-live="polite" style={{
          background: `linear-gradient(135deg, ${wc}18, ${wc}08)`, border: `1px solid ${wc}33`,
          borderRadius: 16, padding: "28px 28px 24px", marginBottom: 32, scrollMarginTop: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <strong style={{ background: wc, color: "#fff", fontSize: 13, fontWeight: 800, padding: "6px 16px", borderRadius: 20, letterSpacing: 1, textTransform: "uppercase" }}>{bw ? t.buyWins : t.rentWins}</strong>
            <span style={{ color: C.dim2, fontSize: 13 }}>{t.horizonLabel} {mortgageYears} {t.unit}</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.txt, marginBottom: 8, fontFamily: "monospace", letterSpacing: -1 }}>{fmt.m2(Math.abs(eqDiff))} CZK</div>
          <p style={{ fontSize: 14, color: C.tipSub, lineHeight: 1.7, maxWidth: 700, margin: 0, textAlign: "justify" }}>{t.moreBy} {bw ? t.buyVerb : t.rentVerb}. {vText}</p>

          {/* Breakpoint insight */}
          {r.breakpoint && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 10,
              background: `${r.breakpoint.buyWinsAfter ? C.buy : C.rent}12`,
              border: `1px solid ${r.breakpoint.buyWinsAfter ? C.buy : C.rent}33`,
              fontSize: 13, color: C.txt2, lineHeight: 1.5,
            }}>
              💡 {r.breakpoint.buyWinsAfter ? t.breakBuyAfter : t.breakRentAfter}{" "}
              <strong style={{ color: r.breakpoint.buyWinsAfter ? C.buy : C.rent }}>{r.breakpoint.year}</strong>
            </div>
          )}
          {!r.breakpoint && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: 10,
              background: `${wc}12`, border: `1px solid ${wc}33`,
              fontSize: 13, color: C.txt2, lineHeight: 1.5,
            }}>
              💡 {bw ? t.buyWins : t.rentWins} {t.breakAlways}
            </div>
          )}

          <div style={{ display: "flex", gap: 24, marginTop: 20, flexWrap: "wrap" }}>
            {[[t.lblBuyEq, fmt.m1(r.buyEq), C.buy], [t.lblRentEq, fmt.m1(r.rentEq), C.rent], [t.lblMtg, fmt.n(r.mp), C.buy], [t.lblRent1, fmt.n(baseRent), C.rent], [`${t.lblRentN} ${r.years}`, fmt.n(last.rent), C.rent]].map(([l, v, c]) => (
              <div key={l}><div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: 1 }}>{l}</div><div style={{ fontSize: 16, fontWeight: 700, color: c, fontFamily: "monospace", marginTop: 2 }}>{v}</div></div>
            ))}
          </div>
        </div>

        {/* Equity Chart */}
        <ChartSection title={t.secEquity} open={openSec.eq} onToggle={() => toggleSec("eq")}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 12px 8px 0" }}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={r.data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.buy} stopOpacity={0.15} /><stop offset="95%" stopColor={C.buy} stopOpacity={0} /></linearGradient><linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.rent} stopOpacity={0.15} /><stop offset="95%" stopColor={C.rent} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid {...getGr()} /><XAxis dataKey="year" {...getAx()} interval={xI} /><YAxis {...getAx()} tickFormatter={fmt.m1} domain={[0, yMaxEq]} />
                <Tooltip content={<EquityTip t={t} />} />
                <Area type="monotone" dataKey="buyerEquity" stroke={C.buy} strokeWidth={2.5} fill="url(#gB)" activeDot={dp(C.buy)} />
                <Area type="monotone" dataKey="renterEquity" stroke={C.rent} strokeWidth={2.5} fill="url(#gR)" activeDot={dp(C.rent)} />
              </AreaChart>
            </ResponsiveContainer>
            <ChartLegend items={[[C.buy, t.legBuy], [C.rent, t.legRent]]} />
          </div>
        </ChartSection>

        {/* Monthly Chart */}
        <ChartSection title={t.secMonthly} open={openSec.mo} onToggle={() => toggleSec("mo")}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <Card label={t.totalBuy} value={`${fmt.m1(r.tMort)} CZK`} sub={`${fmt.m1(downPayment)} ${t.down} + ${fmt.m1(r.tInt)} ${t.interest}`} color={C.buy} />
            <Card label={`${t.totalRent} (${r.years} ${t.unit})`} value={`${fmt.m1(r.tRent)} CZK`} sub={`${fmt.n(baseRent)} → ${fmt.n(last.rent)}/m`} color={C.rent} />
            <Card label={t.cashD} value={`${fmt.m1(Math.abs(r.tMort - r.tRent))} CZK`} sub={r.tMort > r.tRent ? t.buyMore : t.rentMore} color={C.warn} />
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 12px 8px 0" }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={r.data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <CartesianGrid {...getGr()} /><XAxis dataKey="year" {...getAx()} interval={xI} /><YAxis {...getAx()} tickFormatter={fmt.k} domain={[0, yMaxMo]} />
                <Tooltip content={<MonthlyTip t={t} />} />
                <Line type="monotone" dataKey="rent" stroke={C.rent} strokeWidth={2.5} dot={false} activeDot={dp(C.rent)} />
                <Line type="stepAfter" dataKey="mortgage" stroke={C.buy} strokeWidth={2.5} dot={false} activeDot={dp(C.buy)} />
              </LineChart>
            </ResponsiveContainer>
            <ChartLegend items={[[C.rent, `${t.rentL} (${rentRate}%${t.perYr})`], [C.buy, `${t.mtgL} (${annualRate}%)`]]} />
          </div>
          {r.cross && <p style={{ background: C.crossBg, border: `1px solid ${C.crossBorder}`, borderRadius: 8, padding: "10px 16px", fontSize: 12, color: C.dim2, marginTop: 12 }}>{t.crossover} <strong style={{ color: C.warn }}>{r.cross}</strong>.</p>}
        </ChartSection>

        {/* Table */}
        <ChartSection title={t.secTable} open={openSec.tbl} onToggle={() => toggleSec("tbl")}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 640, fontFamily: "monospace" }}>
              <thead><tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {[t.hYear, t.hRent, t.hMtg, t.hInv, t.hBuyEq, t.hRentEq, t.hD].map((h) => (
                  <th key={h} style={{ padding: "10px 10px", textAlign: "right", color: C.faint, fontWeight: 600, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>{r.data.map((d, i) => {
                const eq = d.buyerEquity - d.renterEquity;
                return (<tr key={d.year} style={{ borderBottom: `1px solid ${C.rowBorder}`, background: i & 1 ? C.rowAlt : "transparent" }}>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: C.dim2 }}>{d.year}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: C.rent }}>{fmt.n(d.rent)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: C.buy }}>{d.mortgage > 0 ? fmt.n(d.mortgage) : "—"}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: (d.renterMoSav > 0 || d.buyerMoSav > 0) ? C.inv : C.muted }}>{d.renterMoSav > 0 ? `R +${fmt.n(d.renterMoSav)}` : d.buyerMoSav > 0 ? `B +${fmt.n(d.buyerMoSav)}` : "—"}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: C.buy, fontWeight: 600 }}>{fmt.m1(d.buyerEquity)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: C.rent, fontWeight: 600 }}>{fmt.m1(d.renterEquity)}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: eq >= 0 ? C.buy : C.rent, fontSize: 10 }}>{eq >= 0 ? `${t.bPlus}${fmt.m1(eq)}` : `${t.rPlus}${fmt.m1(Math.abs(eq))}`}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </ChartSection>

        {/* Bottom CTAs to other sections */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 16, marginBottom: 8 }}>
          <button onClick={onGoLearn} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "22px 20px", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>📖</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{t.ctaLearnTitle}</span>
            </div>
            <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, marginBottom: 12, textAlign: "justify" }}>{t.ctaLearnDesc}</div>
            <span style={{ color: C.rent, fontSize: 13, fontWeight: 600 }}>{t.ctaLearnBtn} →</span>
          </button>
          <button onClick={onGoAbout} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "22px 20px", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>👋</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>{t.ctaAboutTitle}</span>
            </div>
            <div style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, marginBottom: 12, textAlign: "justify" }}>{t.ctaAboutDesc}</div>
            <span style={{ color: C.rent, fontSize: 13, fontWeight: 600 }}>{t.ctaAboutBtn} →</span>
          </button>
        </div>
      </main>

      {/* Sticky bottom bar */}
      {!verdictVis && (
        <button onClick={() => verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "16px 20px", background: C.bg, borderTop: `2px solid ${wc}44`,
            color: wc, fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none",
            borderTop: `2px solid ${wc}44`, fontFamily: "inherit",
            boxShadow: "0 -8px 32px rgba(0,0,0,0.6)",
          }}>
          <span style={{ background: wc, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 12, letterSpacing: 0.5 }}>{bw ? t.buyWins : t.rentWins}</span>
          <span style={{ color: C.txt, fontFamily: "monospace" }}>{fmt.m2(Math.abs(eqDiff))} CZK</span>
          <span style={{ fontSize: 12, color: C.dim }}>↓</span>
        </button>
      )}
    </>
  );
}

/* ══════════════════════════════════════════
   MAIN APP (Router + Menu)
   ══════════════════════════════════════════ */
export default function App() {
  const [lang, setLang] = useState("cs");
  const [page, setPage] = useState("calc");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Set the active theme colors
  C = themes[theme];

  const t = I18N[lang];
  const track = useCallback((name, params) => { if (typeof window.gtag === "function") window.gtag("event", name, params); }, []);

  const go = useCallback((p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); track("page_view", { page: p }); }, [track]);

  return (
    <div style={{ background: C.bg, color: C.txt, minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid ${C.footerBorder}`, padding: "12px 24px", position: "sticky", top: 0, zIndex: 60, background: C.headerBg }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <button onClick={() => go("calc")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
            <svg width="28" height="28" viewBox="0 0 32 32"><defs><linearGradient id="lb" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={C.rent}/><stop offset="100%" stopColor={C.buy}/></linearGradient></defs><rect width="32" height="32" rx="6" fill="url(#lb)"/><text x="16" y="22" fontSize="14" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Arial">R|B</text></svg>
            <span style={{ color: C.txt, fontSize: 15, fontWeight: 700 }}>rentorbuy.cz</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Theme toggle */}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme"
              style={{ background: C.langBg, border: `1px solid ${C.langBorder}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16, lineHeight: 1, display: "flex", alignItems: "center" }}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            {/* Language */}
            <nav aria-label="Language" style={{ display: "flex", background: C.langBg, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.langBorder}` }}>
              {["cs", "en"].map((l) => (
                <button key={l} onClick={() => { setLang(l); track("language_changed", { language: l }); }}
                  style={{ background: lang === l ? C.langActiveBg : "transparent", border: "none", color: lang === l ? C.txt : C.dim, fontSize: 13, fontWeight: lang === l ? 700 : 400, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                  {l === "cs" ? "CZ" : "EN"}
                </button>
              ))}
            </nav>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
              style={{ background: "none", border: `1px solid ${C.langBorder}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3, alignItems: "center", justifyContent: "center" }}>
              <span style={{ display: "block", width: 18, height: 2, background: menuOpen ? C.rent : C.dim, borderRadius: 2, transition: "all 0.2s", transform: menuOpen ? "rotate(45deg) translate(2px, 2px)" : "none" }} />
              <span style={{ display: "block", width: 18, height: 2, background: C.dim, borderRadius: 2, transition: "all 0.2s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: 18, height: 2, background: menuOpen ? C.rent : C.dim, borderRadius: 2, transition: "all 0.2s", transform: menuOpen ? "rotate(-45deg) translate(2px, -2px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Dropdown menu */}
        {menuOpen && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.menuBg, borderBottom: `1px solid ${C.menuBorder}`, animation: "slideIn 0.2s ease-out", zIndex: 61 }}>
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "8px 24px 16px" }}>
              {[["calc", t.navCalc, "🧮"], ["learn", t.navLearn, "📖"], ["about", t.navAbout, "👋"]].map(([key, label, icon]) => (
                <button key={key} onClick={() => go(key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "14px 12px", margin: "2px 0",
                    background: page === key ? `${C.rent}15` : "transparent",
                    border: page === key ? `1px solid ${C.rent}33` : "1px solid transparent",
                    borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                    color: page === key ? C.txt : C.dim, fontSize: 15, fontWeight: page === key ? 700 : 400,
                    textAlign: "left",
                  }}>
                  <span style={{ fontSize: 18 }}>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── PAGE CONTENT ── */}
      {page === "calc" && <CalcPage t={t} track={track} onGoLearn={() => go("learn")} onGoAbout={() => go("about")} />}
      {page === "learn" && <LearnPage t={t} onGoCalc={() => go("calc")} />}
      {page === "about" && <AboutPage t={t} track={track} onGoCalc={() => go("calc")} onGoLearn={() => go("learn")} />}

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.footerBorder}`, padding: "24px 24px 80px", background: C.footerBg }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ maxWidth: 500 }}>
            <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.7, margin: 0 }}>{t.disc}</p>
            <p style={{ fontSize: 10, color: C.footerTxt2, marginTop: 8 }}>{t.src}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.dim, marginBottom: 4 }}>{t.contact}</div>
            <a href="mailto:team@rentorbuy.cz" onClick={() => track("contact_click", { method: "email" })} style={{ color: C.rent, fontSize: 13, textDecoration: "none", fontWeight: 600 }}>team@rentorbuy.cz</a>
            <div style={{ fontSize: 10, color: C.footerTxt2, marginTop: 8 }}>© 2026 rentorbuy.cz</div>
          </div>
        </div>
      </footer>

      {/* Click outside to close menu */}
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 59 }} />}
    </div>
  );
}
