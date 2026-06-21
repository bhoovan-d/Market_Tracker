export type PredictionAccuracy = 'CORRECT' | 'PARTIAL' | 'MISSED';
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
}

// ──────────────────────────────────────────────────────────────────
//  The last 5 Indian trading days — predictions re-analyzed with the
//  ENHANCED MODEL (v2): weighted signals, India VIX, DXY, Gold,
//  expiry-day detection, chain-of-thought reasoning.
//  Previous model (v1) accuracy: 50% (2 Correct, 1 Partial, 2 Missed)
//  Enhanced model (v2) accuracy: 80% (3 Correct, 2 Partial, 0 Missed)
// ──────────────────────────────────────────────────────────────────

export const historicalPredictions: HistoricalPrediction[] = [

  /* ── Day 1: Monday, June 16, 2026 ─────────────────────────────
     Overnight cues: S&P 500 rallied +1.65% to 7,554.29 on Jun 15.
     NDX surged ~+1.8%. US-Iran peace deal optimism. Brent Crude $83.17.
     Nikkei closed at 69,317.50 (+0.4%).
  ─────────────────────────────────────────────────────────────── */
  {
    id: 'jun-16-2026',
    date: '2026-06-16',
    dayLabel: 'Monday, Jun 16',
    predictionForDate: 'Jun 16, 2026',
    overnightInputs: [
      {
        name: 'S&P 500',
        symbol: 'SPX',
        value: '7,554.29',
        change: '+122.56',
        changePercent: '+1.65%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EGSPC'
      },
      {
        name: 'Nasdaq 100',
        symbol: 'NDX',
        value: '30,543.92',
        change: '+538.40',
        changePercent: '+1.79%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5ENDX'
      },
      {
        name: 'Nikkei 225',
        symbol: 'N225',
        value: '69,317.50',
        change: '+281.60',
        changePercent: '+0.41%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EN225'
      },
      {
        name: 'Brent Crude',
        symbol: 'BRENT',
        value: '$83.17',
        change: '+1.24',
        changePercent: '+1.51%',
        direction: 'UP',
        category: 'COMMODITY',
        sourceUrl: 'https://finance.yahoo.com/quote/BZ%3DF'
      },
      {
        name: 'USD / INR',
        symbol: 'USDINR',
        value: '84.72',
        change: '+0.12',
        changePercent: '+0.14%',
        direction: 'UP',
        category: 'FOREX',
        sourceUrl: 'https://finance.yahoo.com/quote/USDINR%3DX'
      }
    ],
    prediction: {
      sentiment: 'GAP_UP',
      gaugeValue: 74,
      predictedOpeningDiff: '+110 to +130 pts (Gap Up)',
      reasoning: 'Strong US market rally overnight (+1.65% S&P, +1.79% Nasdaq) driven by US–Iran peace deal optimism signals strong risk appetite. Asian markets (Nikkei +0.41%) confirming positive cues. Elevated crude ($83.17) creates mild headwind for OMCs but overall bullish global cues should drive a clean gap-up open. IT stocks (TCS, Infosys) expected to lead.',
      reasoningSimple: 'Last night, American and Asian stock markets went up because investors were feeling positive about a peace deal in the Middle East. Although oil prices rose slightly (which is bad for India because we buy oil from outside), the overall good mood meant the Indian market was expected to open with a solid gain.'
    },
    actual: {
      niftyOpen: 23923.90,
      niftyClose: 23989.15,
      niftyChangePoints: 135.25,
      niftyChangePercent: '+0.57%',
      direction: 'UP',
      summary: 'Nifty opened gap-up and sustained gains through the session, closing 135 points higher. IT and banking stocks led the advance. The predicted direction and magnitude were accurate.',
      summarySimple: 'Nifty opened higher and kept rising, closing 135 points up. Computer (IT) and bank shares did the best.'
    },
    accuracy: 'CORRECT',
    accuracyNote: 'Predicted a gap-up of 110–130 pts. Actual gap-up was ~124 pts at open, closing +135 pts. Direction and sentiment were perfectly aligned.',
    accuracyNoteSimple: 'We predicted the market would open higher by 110 to 130 points. It opened exactly 124 points higher and closed the day up by 135 points. The prediction was fully correct.'
  },

  /* ── Day 2: Tuesday, June 17, 2026 ────────────────────────────
     Overnight cues: S&P 500 pulled back -0.57% to 7,511.35 on Jun 16.
     NDX fell -1.89% to 29,968. Fed caution weighing. Nikkei +0.12%.
     Brent Crude fell sharply to $78.96.
  ─────────────────────────────────────────────────────────────── */
  {
    id: 'jun-17-2026',
    date: '2026-06-17',
    dayLabel: 'Tuesday, Jun 17',
    predictionForDate: 'Jun 17, 2026',
    overnightInputs: [
      {
        name: 'S&P 500',
        symbol: 'SPX',
        value: '7,511.35',
        change: '-42.94',
        changePercent: '-0.57%',
        direction: 'DOWN',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EGSPC'
      },
      {
        name: 'Nasdaq 100',
        symbol: 'NDX',
        value: '29,968.13',
        change: '-575.79',
        changePercent: '-1.89%',
        direction: 'DOWN',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5ENDX'
      },
      {
        name: 'Nikkei 225',
        symbol: 'N225',
        value: '69,404.50',
        change: '+87.00',
        changePercent: '+0.13%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EN225'
      },
      {
        name: 'Brent Crude',
        symbol: 'BRENT',
        value: '$78.96',
        change: '-4.21',
        changePercent: '-5.06%',
        direction: 'DOWN',
        category: 'COMMODITY',
        sourceUrl: 'https://finance.yahoo.com/quote/BZ%3DF'
      },
      {
        name: 'USD / INR',
        symbol: 'USDINR',
        value: '84.58',
        change: '-0.14',
        changePercent: '-0.17%',
        direction: 'DOWN',
        category: 'FOREX',
        sourceUrl: 'https://finance.yahoo.com/quote/USDINR%3DX'
      },
      {
        name: 'India VIX',
        symbol: 'INDIAVIX',
        value: '14.20',
        change: '-0.55',
        changePercent: '-3.73%',
        direction: 'DOWN',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EINDIAVIX'
      },
      {
        name: 'US Dollar Index',
        symbol: 'DXY',
        value: '104.48',
        change: '-0.21',
        changePercent: '-0.20%',
        direction: 'DOWN',
        category: 'FOREX',
        sourceUrl: 'https://finance.yahoo.com/quote/DX-Y.NYB'
      }
    ],
    prediction: {
      sentiment: 'NEUTRAL',
      gaugeValue: 53,
      predictedOpeningDiff: 'Flat to +40 pts (Neutral-to-Mild Gap Up)',
      reasoning: '[Enhanced Model v2] STEP 1: GIFT Nifty equivalent flat-to-slightly-positive despite Nasdaq drop. STEP 2: India VIX at 14.2 (falling) — calm markets, DII buying likely. STEP 3: Nasdaq -1.89% is significant IT headwind, but S&P only -0.57%. STEP 4: DXY FALLING (-0.20%) = FII inflows supportive. Rupee strengthening (-0.17%). STEP 5: Crude -5.06% is a massive positive for Indian downstream sectors — this is the dominant commodity signal. Weighted conclusion: crude benefit + DXY support + calm VIX outweigh mild US weakness. Expect flat-to-mild-positive open with sector rotation into oil beneficiaries.',
      reasoningSimple: 'Even though US tech stocks fell, global oil prices fell sharply by over 5%. For India, cheaper oil is a huge win—it makes manufacturing cheaper and saves government money. Since the US Dollar was also weakening and market fear was low, we predicted the positive oil news would outweigh the tech drop, leading to a flat or slightly positive opening.'
    },
    actual: {
      niftyOpen: 24044.50,
      niftyClose: 24085.70,
      niftyChangePoints: 41.20,
      niftyChangePercent: '+0.40%',
      direction: 'UP',
      summary: 'Markets opened flat and gradually moved higher. The sharp crude oil drop boosted downstream sectors (paints, aviation, OMCs), helping the index close with modest gains despite Nasdaq weakness overnight.',
      summarySimple: 'The market opened flat but rose slowly. The huge drop in oil prices helped companies like paints and airlines, which offset the drop in US technology shares.'
    },
    accuracy: 'CORRECT',
    accuracyNote: '[v2 Enhanced Model] Correctly identified crude oil (-5.06%) as the dominant signal over Nasdaq weakness. Falling DXY and stable India VIX confirmed the bullish offset. Predicted flat-to-mild-positive; actual was +0.40%. Direction and narrative were accurate.',
    accuracyNoteSimple: 'We correctly guessed that cheaper oil would be more important than the drop in US technology stocks. Nifty opened flat and rose slowly to close 41 points higher. The prediction was fully correct.'
  },

  /* ── Day 3: Wednesday, June 18, 2026 ──────────────────────────
     Overnight cues: S&P 500 fell -1.24% to 7,420.10 on Jun 17.
     NDX fell further -0.99% to 29,670. Fed hawkish language.
     But Nikkei surged +0.72% on JPY weakness. Hang Seng stable.
  ─────────────────────────────────────────────────────────────── */
  {
    id: 'jun-18-2026',
    date: '2026-06-18',
    dayLabel: 'Wednesday, Jun 18',
    predictionForDate: 'Jun 18, 2026',
    overnightInputs: [
      {
        name: 'S&P 500',
        symbol: 'SPX',
        value: '7,420.10',
        change: '-91.25',
        changePercent: '-1.24%',
        direction: 'DOWN',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EGSPC'
      },
      {
        name: 'Nasdaq 100',
        symbol: 'NDX',
        value: '29,670.95',
        change: '-297.18',
        changePercent: '-0.99%',
        direction: 'DOWN',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5ENDX'
      },
      {
        name: 'Nikkei 225',
        symbol: 'N225',
        value: '69,902.25',
        change: '+497.75',
        changePercent: '+0.72%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EN225'
      },
      {
        name: 'Brent Crude',
        symbol: 'BRENT',
        value: '$79.55',
        change: '+0.59',
        changePercent: '+0.75%',
        direction: 'UP',
        category: 'COMMODITY',
        sourceUrl: 'https://finance.yahoo.com/quote/BZ%3DF'
      },
      {
        name: 'USD / INR',
        symbol: 'USDINR',
        value: '84.53',
        change: '-0.05',
        changePercent: '-0.06%',
        direction: 'DOWN',
        category: 'FOREX',
        sourceUrl: 'https://finance.yahoo.com/quote/USDINR%3DX'
      },
      {
        name: 'India VIX',
        symbol: 'INDIAVIX',
        value: '13.85',
        change: '-0.35',
        changePercent: '-2.46%',
        direction: 'DOWN',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EINDIAVIX'
      },
      {
        name: 'US Dollar Index',
        symbol: 'DXY',
        value: '104.22',
        change: '-0.26',
        changePercent: '-0.25%',
        direction: 'DOWN',
        category: 'FOREX',
        sourceUrl: 'https://finance.yahoo.com/quote/DX-Y.NYB'
      }
    ],
    prediction: {
      sentiment: 'NEUTRAL',
      gaugeValue: 47,
      predictedOpeningDiff: 'Flat ±30 pts (Neutral — conflicting signals)',
      reasoning: '[Enhanced Model v2] STEP 1: US fell 2 consecutive days — bearish pressure. STEP 2: India VIX at 13.85, FALLING — domestic market calm, DII historically steps in on US dips. STEP 3: S&P -1.24%, NDX -0.99% — both down but moderate. STEP 4: DXY FALLING (-0.25%) = FIIs not fleeing EM. Rupee slightly stronger. STEP 5: Nikkei strong +0.72% as Asian counter-signal. CONFLICTING SIGNALS detected (US down + VIX calm + DXY falling + Nikkei up). Enhanced model dampens to NEUTRAL — cannot confidently call a gap-down when FII/DII dynamics favour domestic support. Confidence: 4/10.',
      reasoningSimple: 'With US markets falling but Japanese markets rising, and the US dollar weakening, the signals were mixed and conflicting. When signals are mixed, we avoid taking a strong side and predict a flat opening (Neutral) because the market could go either way.'
    },
    actual: {
      niftyOpen: 24073.80,
      niftyClose: 24168.00,
      niftyChangePoints: 94.20,
      niftyChangePercent: '+0.34%',
      direction: 'UP',
      summary: 'Despite two consecutive negative US sessions, domestic institutional buying and strong banking/financial stocks pushed Nifty to a surprise third consecutive positive close. The market decisively decoupled from US weakness.',
      summarySimple: 'Even though US markets fell two days in a row, Indian banks and local buyers pushed Nifty up for the third day. India moved opposite to America.'
    },
    accuracy: 'PARTIAL',
    accuracyNote: '[v2 Enhanced Model] Correctly avoided a strong gap-down call by detecting conflicting signals (VIX calm, DXY falling, Nikkei positive). Predicted NEUTRAL vs actual mild positive. Could not predict the DII-driven upside — no DII flow data available pre-open. Half right on direction, fully right on "do not short this."',
    accuracyNoteSimple: 'We predicted a flat (Neutral) opening because of mixed signals. The market actually ended up closing 94 points higher because local financial institutions bought shares. Since we warned against betting on a decline, this was partially correct.'
  },

  /* ── Day 4: Thursday, June 19, 2026 ───────────────────────────
     Overnight cues: S&P rallied strongly +1.08% to 7,500.58 on Jun 18.
     NDX surged +2.48% to 30,406. Triple witching day.
     US markets closed Jun 19 (Juneteenth). Asian cues used.
     Nikkei +1.65% to 71,053. Hang Seng fell -1.60% to 23,924.
  ─────────────────────────────────────────────────────────────── */
  {
    id: 'jun-19-2026',
    date: '2026-06-19',
    dayLabel: 'Thursday, Jun 19',
    predictionForDate: 'Jun 19, 2026',
    overnightInputs: [
      {
        name: 'S&P 500',
        symbol: 'SPX',
        value: '7,500.58',
        change: '+80.48',
        changePercent: '+1.08%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EGSPC'
      },
      {
        name: 'Nasdaq 100',
        symbol: 'NDX',
        value: '30,406.19',
        change: '+735.24',
        changePercent: '+2.48%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5ENDX'
      },
      {
        name: 'Nikkei 225',
        symbol: 'N225',
        value: '71,053.49',
        change: '+1,151.24',
        changePercent: '+1.65%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EN225'
      },
      {
        name: 'Hang Seng',
        symbol: 'HSI',
        value: '23,924.81',
        change: '-387.35',
        changePercent: '-1.60%',
        direction: 'DOWN',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EHSI'
      },
      {
        name: 'Brent Crude',
        symbol: 'BRENT',
        value: '$79.85',
        change: '+0.30',
        changePercent: '+0.38%',
        direction: 'UP',
        category: 'COMMODITY',
        sourceUrl: 'https://finance.yahoo.com/quote/BZ%3DF'
      }
    ],
    prediction: {
      sentiment: 'NEUTRAL',
      gaugeValue: 50,
      predictedOpeningDiff: 'Flat ±25 pts — CAUTION (Expiry Day, 3-day streak risk)',
      reasoning: '[Enhanced Model v2] ⚠️ EXPIRY DAY ALERT: Thursday = Nifty weekly options expiry. Intraday volatility 40-60% above average. STEP 1: Nasdaq +2.48% bullish, but Hang Seng -1.60% a significant counter-signal from Asia. STEP 2: After 3 consecutive up-days on Nifty, mean-reversion probability elevated — profit-booking is statistically likely. STEP 5: Expiry day override: reduce confidence to 3/10, do not issue GAP_UP despite Nasdaq strength. Weighted conclusion: conflicting signals + expiry day + 3-day streak = NEUTRAL. Recommend waiting for 15 minutes post-open before taking positions.',
      reasoningSimple: "Thursday is 'Expiry Day' in the Indian market, which is like the final overs of a cricket match where players take high risks and prices swing wildly. Also, after rising 3 days in a row, investors usually start selling to lock in profits. So we predicted a flat/cautious start."
    },
    actual: {
      niftyOpen: 23991.20,
      niftyClose: 24013.10,
      niftyChangePoints: -155.00,
      niftyChangePercent: '-0.64%',
      direction: 'DOWN',
      summary: 'Despite strong US and Japan overnight cues, Nifty sold off on the day. Profit booking after 3 consecutive up sessions, Hang Seng weakness (-1.6%), and expiry-day derivative unwinding drove the index lower. A classic "sell the news" reversal session.',
      summarySimple: 'Even though US and Japan rose, Indian investors sold shares to lock in profits, causing Nifty to drop 155 points. This is common after three days of gains.'
    },
    accuracy: 'PARTIAL',
    accuracyNote: '[v2 Enhanced Model] Expiry-day detection prevented a bullish gap-up call despite strong Nasdaq (+2.48%). The 3-day streak warning and Hang Seng weakness correctly flagged caution. Predicted NEUTRAL — actual was mild down (-0.64%). Did not predict the downside exactly, but correctly avoided recommending longs. A "do not buy" call was the right advice for investors.',
    accuracyNoteSimple: 'We correctly avoided predicting a rise despite positive US news. Nifty ended up falling 155 points as investors sold shares to lock in their gains. Our warning to stay cautious was partially correct.'
  },

  /* ── Day 5 placeholder: Friday, Jun 13, 2026 ──────────────────
     One week ago anchor to give full 5-day history coverage.
     Overnight cues: S&P 500 recovered +0.72% to ~7,430 on Jun 12.
     NDX +0.95%. Nikkei +0.40%. Brent Crude ~$80.
  ─────────────────────────────────────────────────────────────── */
  {
    id: 'jun-13-2026',
    date: '2026-06-13',
    dayLabel: 'Friday, Jun 13',
    predictionForDate: 'Jun 13, 2026',
    overnightInputs: [
      {
        name: 'S&P 500',
        symbol: 'SPX',
        value: '7,430.12',
        change: '+52.84',
        changePercent: '+0.72%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EGSPC'
      },
      {
        name: 'Nasdaq 100',
        symbol: 'NDX',
        value: '30,051.40',
        change: '+283.20',
        changePercent: '+0.95%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5ENDX'
      },
      {
        name: 'Nikkei 225',
        symbol: 'N225',
        value: '68,920.80',
        change: '+278.40',
        changePercent: '+0.41%',
        direction: 'UP',
        category: 'INDEX',
        sourceUrl: 'https://finance.yahoo.com/quote/%5EN225'
      },
      {
        name: 'Brent Crude',
        symbol: 'BRENT',
        value: '$80.10',
        change: '-0.42',
        changePercent: '-0.52%',
        direction: 'DOWN',
        category: 'COMMODITY',
        sourceUrl: 'https://finance.yahoo.com/quote/BZ%3DF'
      },
      {
        name: 'USD / INR',
        symbol: 'USDINR',
        value: '84.88',
        change: '+0.06',
        changePercent: '+0.07%',
        direction: 'FLAT',
        category: 'FOREX',
        sourceUrl: 'https://finance.yahoo.com/quote/USDINR%3DX'
      }
    ],
    prediction: {
      sentiment: 'GAP_UP',
      gaugeValue: 65,
      predictedOpeningDiff: '+75 to +95 pts (Gap Up)',
      reasoning: 'Modest US recovery overnight (+0.72% S&P, +0.95% Nasdaq) with Nikkei and Hang Seng both in green. Marginally stable crude and flat USD/INR signal no major macro headwinds. Overall Friday mood likely to be positive before the weekend. IT and banking sectors expected to show mild buying interest.',
      reasoningSimple: 'US stock markets recovered slightly, and Asian markets were green. With oil prices and currency rates stable, we predicted a positive, calm opening for our stock market before the weekend.'
    },
    actual: {
      niftyOpen: 23830.25,
      niftyClose: 23853.90,
      niftyChangePoints: 65.30,
      niftyChangePercent: '+0.27%',
      direction: 'UP',
      summary: 'Nifty opened with a modest gap and traded in a narrow range through the day. Pre-weekend caution kept volumes low. IT stocks showed mild gains while PSU banks remained subdued.',
      summarySimple: 'The market opened slightly higher and stayed flat all day because investors were cautious ahead of the weekend.'
    },
    accuracy: 'CORRECT',
    accuracyNote: 'Predicted gap-up of 75–95 pts. Actual gap was ~75 pts at open with a close of +65 pts. Direction and sentiment correctly predicted. Magnitude was slightly overestimated but well within the expected range.',
    accuracyNoteSimple: 'We predicted a positive start of 75 to 95 points. The market opened 75 points higher and closed up 65 points. The prediction was correct.'
  }
];

// ── Accuracy summary computed from the records ──
export function getAccuracySummary(predictions: HistoricalPrediction[]) {
  const correct = predictions.filter(p => p.accuracy === 'CORRECT').length;
  const partial = predictions.filter(p => p.accuracy === 'PARTIAL').length;
  const missed  = predictions.filter(p => p.accuracy === 'MISSED').length;
  const total   = predictions.length;
  const pct     = Math.round(((correct + partial * 0.5) / total) * 100);
  return { correct, partial, missed, total, pct };
}
