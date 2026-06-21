import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { mockSentimentData } from '@/lib/mockData';
import fs from 'fs';
import path from 'path';

// ── Server-side in-memory cache (survives across requests, resets on server restart) ──
interface NoteCache {
  data: any;
  timestamp: number;
}
let noteCache: NoteCache | null = null;
let lastLiveGenerationTime = 0;
const CACHE_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours — the morning note doesn't change meaningfully minute-to-minute
const FORCE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown to protect API keys from spam
const PERSISTENT_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'last-sentiment.json');

function isCacheValid(): boolean {
  if (!noteCache) return false;
  return Date.now() - noteCache.timestamp < CACHE_DURATION_MS;
}

// Load the last successful generation from disk to prime the in-memory cache on startup
function primeCache() {
  if (noteCache) return;
  try {
    if (fs.existsSync(PERSISTENT_FILE_PATH)) {
      const fileData = fs.readFileSync(PERSISTENT_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      const mtime = fs.statSync(PERSISTENT_FILE_PATH).mtime.getTime();
      noteCache = { data: parsed, timestamp: mtime };
      lastLiveGenerationTime = mtime; // Keep cooldown in sync
      console.log("Successfully primed noteCache from local persistent storage.");
    }
  } catch (e) {
    console.error("Failed to prime noteCache from persistent file:", e);
  }
}

/**
 * POST /api/generate-note
 * Model: gemini-3.5-flash (generous free tier: 1500 req/day)
 * Cache: 4-hour server-side cache — reduces API calls from 720/day to ~2-4/day
 * Dual mode: single API call returns both Expert and Common Man (simple) versions
 */
export async function POST(request: Request) {
  try {
    primeCache(); // Ensure cache is loaded from disk if empty

    let body = { tickers: [], forceRefresh: false };
    try { body = await request.json(); } catch (e) {}

    const { tickers, forceRefresh } = body;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey === 'your_gemini_key_here') {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key is not configured.',
        data: null
      }, { status: 401 });
    }

    // Protect API from spam force refreshes by enforcing a cooldown
    const isForceOnCooldown = forceRefresh && (Date.now() - lastLiveGenerationTime < FORCE_COOLDOWN_MS);

    // Return cached note if still valid and not force-refreshed, or if force-refresh is on cooldown
    if (isCacheValid() && (!forceRefresh || isForceOnCooldown)) {
      return NextResponse.json({
        success: true,
        data: noteCache!.data,
        provider: isForceOnCooldown ? 'gemini-flash-cached-cooldown' : 'gemini-flash-cached',
        cachedAt: new Date(noteCache!.timestamp).toISOString(),
        timestamp: new Date().toISOString(),
        cooldownRemaining: isForceOnCooldown ? Math.max(0, Math.ceil((FORCE_COOLDOWN_MS - (Date.now() - lastLiveGenerationTime)) / 1000)) : 0
      });
    }

    // ── Build weighted context ──────────────────────────────────
    const contextData = tickers && Array.isArray(tickers)
      ? tickers.map((t: any) => {
          let weight = 'SUPPORTING';
          if (t.id === 'gift-nifty')    weight = '★★★★★ PRIMARY (direct Nifty futures proxy)';
          if (t.id === 'india-vix')     weight = '★★★★☆ VOLATILITY GAUGE (>16=uncertain, <12=calm)';
          if (t.id === 'nasdaq-100')    weight = '★★★★☆ HIGH (drives IT/tech sector)';
          if (t.id === 'sp-500')        weight = '★★★★☆ HIGH (broad US risk appetite)';
          if (t.id === 'dollar-index')  weight = '★★★☆☆ MEDIUM (DXY high = FII outflows)';
          if (t.id === 'usd-inr')       weight = '★★★☆☆ MEDIUM (INR weakening = headwind)';
          if (t.id === 'brent-crude')   weight = '★★★☆☆ MEDIUM (high oil = cost pressure)';
          if (t.id === 'us-10y-bond')   weight = '★★★☆☆ MEDIUM (high yield = EM outflows)';
          if (t.id === 'nikkei-225')    weight = '★★☆☆☆ SUPPORTING (Asian momentum)';
          if (t.id === 'hang-seng')     weight = '★★☆☆☆ SUPPORTING (China proxy)';
          if (t.id === 'gold')          weight = '★★☆☆☆ SUPPORTING (risk-off signal)';
          if (t.id === 'dow-jones')     weight = '★★☆☆☆ SUPPORTING (US industrials)';
          return `- [${weight}] ${t.name} (${t.id}): ${t.value} | ${t.changePercent} | ${t.direction}`;
        }).join('\n')
      : 'No market data available.';

    // ── Detect expiry day (Thursday = Nifty weekly options expiry) ──
    const ist = new Date(Date.now() + (5.5 * 60 - new Date().getTimezoneOffset()) * 60000);
    const isExpiryDay = ist.getDay() === 4;
    const specialNote = isExpiryDay
      ? '⚠️ EXPIRY DAY: Thursday — weekly options expiry. High volatility expected. Dampen confidence, lean NEUTRAL.'
      : '';

    const systemInstruction = `
You are a senior financial analyst for Nifty Pulse, India's plain-English market education platform.
Your audience: first-generation Indian investors who may not understand financial jargon.

Analyse the overnight global market data and generate a pre-market note with TWO language versions for every explanation:
1. EXPERT: Technical, precise language for experienced investors
2. SIMPLE: Plain, jargon-free language using everyday analogies for the common man

## ANALYSIS FRAMEWORK:
1. GIFT Nifty is the PRIMARY anchor for your prediction (already prices in all global cues)
2. India VIX: low VIX = calm, high VIX = uncertainty — adjust confidence accordingly
3. Nasdaq/S&P: strong US moves (>1%) are meaningful; small moves (<0.4%) are noise
4. DXY rising = FII outflows from India = bearish regardless of other signals
5. Crude falling sharply (>2%) = big positive for India (lower import costs)
6. ${specialNote || 'No special conditions today.'}

## OUTPUT JSON SCHEMA (strict — include both expert and simple versions):
{
  "sentiment": "STRONG_GAP_DOWN" | "GAP_DOWN" | "NEUTRAL" | "GAP_UP" | "STRONG_GAP_UP",
  "gaugeValue": <0-100>,
  "predictedOpeningDiff": "<e.g. +120 pts (Gap Up)>",
  "confidenceScore": <1-10>,
  "confidenceNote": "<one sentence>",
  "bullets": [
    {
      "title": "<Short title>",
      "globalTrend": "<Expert: what happened overnight, 2 sentences>",
      "globalTrendSimple": "<Simple: plain English with analogy, 2-3 sentences, as if explaining to a first-time investor>",
      "indianImpact": "<Expert: technical market impact>",
      "indianImpactSimple": "<Simple: what it means for the common Indian investor's portfolio>",
      "companiesAffected": [
        {
          "symbol": "<NSE ticker>",
          "name": "<Full name>",
          "effect": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
          "reason": "<Why — 1-2 sentences>",
          "actionableGuidance": "<Specific, risk-conscious suggestion>"
        }
      ]
    }
  ],
  "sectors": [
    { "name": "<Sector name>", "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL", "reason": "<1 sentence>" }
  ],
  "suggestedAction": {
    "strategy": "<Expert: 2-3 sentences on opening session approach>",
    "strategySimple": "<Simple: same advice in plain language — what should a normal person do this morning?>",
    "sectorFocus": "<Which sectors to watch or avoid>",
    "riskWarning": "<Expert risk warning>",
    "riskWarningSimple": "<Simple: explain the risk in a way a first-timer would understand>"
  }
}
Rules:
- NEVER issue STRONG_GAP_UP/DOWN unless GIFT Nifty itself moved >0.8% AND 3+ other high-weight signals agree
- If signals conflict, set confidenceScore ≤ 5 and use NEUTRAL
- Simple versions must use analogies (petrol prices, household budgets, cricket scores, weather) — no jargon
`;

    const genAI = new GoogleGenerativeAI(geminiKey);
    // Flash model: ~500 free requests/day vs Pro's ~50 — much safer for production
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      systemInstruction: systemInstruction
    });

    const prompt = `Overnight market data:\n\n${contextData}\n\n${specialNote ? `Special conditions: ${specialNote}\n\n` : ''}Generate the complete dual-mode pre-market briefing JSON.`;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    });

    const rawText = response.response.text();
    const cleanText = rawText.replace(/^\s*```json\s*/gi, '').replace(/\s*```\s*$/g, '').trim();
    const parsedResult = JSON.parse(cleanText);

    // Store in cache
    noteCache = { data: parsedResult, timestamp: Date.now() };
    lastLiveGenerationTime = Date.now();

    // Persist successful generation to disk for offline restarts
    try {
      fs.writeFileSync(PERSISTENT_FILE_PATH, JSON.stringify(parsedResult, null, 2), 'utf-8');
    } catch (e) {
      console.error("Failed to save note to local file:", e);
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
      provider: 'gemini-flash-live',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error generating note:', error);
    
    // Ensure cache is primed from disk if this is the first request and it errored
    primeCache();

    // Return the last successfully generated note (cached in memory or loaded from file)
    if (noteCache?.data) {
      return NextResponse.json({
        success: true,
        data: noteCache.data,
        provider: 'gemini-flash-stale-cache',
        timestamp: new Date().toISOString()
      });
    }

    // Absolute fallback to mock data only if no previous generation exists on disk
    return NextResponse.json({
      success: true,
      data: mockSentimentData,
      provider: 'fallback-mock-static-error',
      error: error.message || 'Gemini API limit exceeded',
      timestamp: new Date().toISOString()
    });
  }
}
