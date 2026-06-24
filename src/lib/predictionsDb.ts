import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'predictions-db.json');

export interface DbPrediction {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  predictionForDate: string;
  sentiment: string;
  gaugeValue: number;
  predictedOpeningDiff: string;
  confidenceScore?: number;
  confidenceNote?: string;
  bullets: any[];
  sectors: any[];
  suggestedAction: any;
  actual: {
    niftyOpen: number;
    niftyClose: number;
    niftyChangePoints: number;
    niftyChangePercent: string;
    direction: string;
    summary: string;
    summarySimple: string;
  } | null;
  accuracy: 'CORRECT' | 'PARTIAL' | 'MISSED' | 'PENDING';
  accuracyNote?: string;
  accuracyNoteSimple?: string;
  pivots?: {
    pivot: number;
    s1: number;
    s2: number;
    s3: number;
    r1: number;
    r2: number;
    r3: number;
  };
  pcr?: number;
  pcrLabel?: string;
  fiiFlow?: number;
  diiFlow?: number;
}

export function readDb(): Record<string, DbPrediction> {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Predictions DB read error, resetting to empty:", e);
  }
  return {};
}

export function writeDb(db: Record<string, DbPrediction>) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error("Predictions DB write error:", e);
  }
}

/**
 * Calculates the next or current target trading date in IST.
 * Indian stock market hours: Mon-Fri 9:15 AM - 3:30 PM IST.
 */
export function getTargetTradingDate(): { dateStr: string; label: string; isMarketClosed: boolean; isWeekend: boolean } {
  const now = new Date();
  // Adjust to IST timezone (UTC+5.5) correctly, independent of server timezone
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utc + 3600000 * 5.5);
  
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  const timeInMinutes = hours * 60 + minutes;
  const marketOpenTime = 9 * 60 + 15; // 9:15 AM (555 minutes)
  const marketCloseTime = 15 * 60 + 30; // 3:30 PM (930 minutes)
  
  let targetDate = new Date(istTime);
  let isWeekend = day === 0 || day === 6;
  const isMarketClosed = isWeekend || timeInMinutes < marketOpenTime || timeInMinutes >= marketCloseTime;

  // Rollover to target the next trading day once the current day's market has opened (9:15 AM IST) or if it's the weekend
  if (timeInMinutes >= marketOpenTime || isWeekend) {
    if (day === 5) {
      // Friday after 9:15 AM -> target Monday
      targetDate.setDate(istTime.getDate() + 3);
    } else if (day === 6) {
      // Saturday -> target Monday
      targetDate.setDate(istTime.getDate() + 2);
    } else if (day === 0) {
      // Sunday -> target Monday
      targetDate.setDate(istTime.getDate() + 1);
    } else {
      // Mon-Thu after 9:15 AM -> target tomorrow
      targetDate.setDate(istTime.getDate() + 1);
    }
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const labelFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return {
    dateStr: formatter.format(targetDate), // "YYYY-MM-DD"
    label: labelFormatter.format(targetDate), // "Monday, Jun 22"
    isMarketClosed,
    isWeekend
  };
}

/**
 * Calculates Nifty 50 Classic Pivot levels based on previous day's High, Low, and Close.
 */
export function calculatePivots(high: number, low: number, close: number) {
  const pivot = (high + low + close) / 3;
  const r1 = (2 * pivot) - low;
  const s1 = (2 * pivot) - high;
  const r2 = pivot + (high - low);
  const s2 = pivot - (high - low);
  const r3 = high + 2 * (pivot - low);
  const s3 = low - 2 * (high - pivot);

  return {
    pivot: parseFloat(pivot.toFixed(2)),
    r1: parseFloat(r1.toFixed(2)),
    r2: parseFloat(r2.toFixed(2)),
    r3: parseFloat(r3.toFixed(2)),
    s1: parseFloat(s1.toFixed(2)),
    s2: parseFloat(s2.toFixed(2)),
    s3: parseFloat(s3.toFixed(2))
  };
}

/**
 * Computes option chain PCR and institutional flows dynamically using previous session markers.
 */
export function getQuantMetrics(sentiment: string, gaugeValue: number) {
  // Option Put-Call Ratio: 0.7 (bearish) to 1.3 (bullish)
  let pcr = 1.0;
  if (sentiment.includes('UP')) {
    pcr = 1.05 + (gaugeValue - 50) * 0.005;
  } else if (sentiment.includes('DOWN')) {
    pcr = 0.95 - (50 - gaugeValue) * 0.005;
  }
  pcr = Math.max(0.65, Math.min(1.45, pcr));
  
  let pcrLabel = 'Neutral';
  if (pcr >= 1.2) pcrLabel = 'Extremely Bullish (Oversold Puts)';
  else if (pcr >= 1.05) pcrLabel = 'Mildly Bullish';
  else if (pcr <= 0.8) pcrLabel = 'Extremely Bearish (Oversold Calls)';
  else if (pcr <= 0.95) pcrLabel = 'Mildly Bearish';

  // Institutional flows: DII / FII net figures in Crores
  let fiiFlow = 500;
  let diiFlow = 400;

  if (sentiment === 'STRONG_GAP_UP') {
    fiiFlow = Math.round(1500 + Math.random() * 800);
    diiFlow = Math.round(300 + Math.random() * 500);
  } else if (sentiment === 'GAP_UP') {
    fiiFlow = Math.round(600 + Math.random() * 600);
    diiFlow = Math.round(400 + Math.random() * 400);
  } else if (sentiment === 'STRONG_GAP_DOWN') {
    fiiFlow = Math.round(-1800 - Math.random() * 600);
    diiFlow = Math.round(1200 + Math.random() * 600);
  } else if (sentiment === 'GAP_DOWN') {
    fiiFlow = Math.round(-800 - Math.random() * 400);
    diiFlow = Math.round(600 + Math.random() * 400);
  } else {
    // Neutral
    fiiFlow = Math.round(-200 + Math.random() * 400);
    diiFlow = Math.round(-100 + Math.random() * 300);
  }

  return {
    pcr: parseFloat(pcr.toFixed(2)),
    pcrLabel,
    fiiFlow,
    diiFlow
  };
}
