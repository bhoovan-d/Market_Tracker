export type PredictionAccuracy = 'CORRECT' | 'PARTIAL' | 'MISSED' | 'PENDING';
export type SentimentType = 'STRONG_GAP_DOWN' | 'GAP_DOWN' | 'NEUTRAL' | 'GAP_UP' | 'STRONG_GAP_UP';
export type Direction = 'UP' | 'DOWN' | 'FLAT';

export interface OvernightInput {
  name: string;
  symbol: string;
  value: string;
  change: string;
  changePercent: string;
  direction: Direction;
  category: 'INDEX' | 'COMMODITY' | 'FOREX' | 'BOND';
  sourceUrl: string;
}

export interface HistoricalPrediction {
  id: string;
  date: string;           // ISO date string e.g. "2026-06-16"
  dayLabel: string;       // e.g. "Monday, Jun 16"
  predictionForDate: string; // "Jun 16, 2026"
  overnightInputs: OvernightInput[];
  prediction: {
    sentiment: SentimentType;
    gaugeValue: number;         // 0–100
    predictedOpeningDiff: string;  // e.g. "+120 pts (Gap Up)"
    reasoning: string;          // Short explanation of why we predicted this
    reasoningSimple?: string;   // Simple explanation for Common Man Mode
  };
  actual: {
    niftyOpen: number;
    niftyClose: number;
    niftyChangePoints: number;
    niftyChangePercent: string;
    direction: Direction;
    summary: string;   // Brief plain-English summary of what actually happened
    summarySimple?: string; // Simple summary for Common Man Mode
  };
  accuracy: PredictionAccuracy;
  accuracyNote: string; // Explanation of why it was correct/partial/missed
  accuracyNoteSimple?: string; // Simple accuracy explanation for Common Man Mode
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

// ──────────────────────────────────────────────────────────────────
//  Live database-driven predictions directory — no mock baseline
// ──────────────────────────────────────────────────────────────────

export const historicalPredictions: HistoricalPrediction[] = [];

// ── Accuracy summary computed from the records ──
export function getAccuracySummary(predictions: HistoricalPrediction[]) {
  const correct = predictions.filter(p => p.accuracy === 'CORRECT').length;
  const partial = predictions.filter(p => p.accuracy === 'PARTIAL').length;
  const missed  = predictions.filter(p => p.accuracy === 'MISSED').length;
  const total   = predictions.length;
  const pct     = Math.round(((correct + partial * 0.5) / total) * 100);
  return { correct, partial, missed, total, pct };
}
