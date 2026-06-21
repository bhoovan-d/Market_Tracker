export interface MarketTicker {
  id: string;
  name: string;
  symbol: string;
  value: string;
  change: string;
  changePercent: string;
  direction: 'UP' | 'DOWN' | 'FLAT';
  category: 'INDEX' | 'COMMODITY' | 'FOREX' | 'BOND';
  time: string;
  sparkline: number[];
  sourceUrl?: string;
  explainer?: string; // Plain-English description for Common Man Mode
}

export type SentimentType = 'STRONG_GAP_DOWN' | 'GAP_DOWN' | 'NEUTRAL' | 'GAP_UP' | 'STRONG_GAP_UP';

export interface SectorImpact {
  name: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  reason: string;
}

export interface CompanyImpact {
  symbol: string;
  name: string;
  effect: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  reason: string;
  actionableGuidance: string;
}

export interface SuggestedAction {
  strategy: string;
  strategySimple?: string;      // Common Man version
  sectorFocus: string;
  riskWarning: string;
  riskWarningSimple?: string;   // Common Man version
}

export interface BulletTrend {
  title: string;
  globalTrend: string;          // Expert version
  globalTrendSimple?: string;   // Common Man version — plain language with analogies
  indianImpact: string;         // Expert version
  indianImpactSimple?: string;  // Common Man version — what it means for your money
  companiesAffected: CompanyImpact[];
}

export interface SentimentNote {
  sentiment: SentimentType;
  gaugeValue: number;
  predictedOpeningDiff: string;
  confidenceScore?: number;    // 1–10: how confident the model is in this prediction
  confidenceNote?: string;     // One-sentence explanation of confidence level
  bullets: BulletTrend[];
  sectors: SectorImpact[];
  companies?: CompanyImpact[]; // keep optional for backwards compatibility
  suggestedAction: SuggestedAction;
  lastUpdated: string;
}

export const mockSentimentData: SentimentNote = {
  sentiment: 'GAP_UP',
  gaugeValue: 72,
  predictedOpeningDiff: '+145 pts (Gap Up)',
  confidenceScore: 8,
  confidenceNote: 'GIFT Nifty up +0.62% with Nasdaq and S&P both positive; India VIX at a calm 13.4 — signals are aligned and clear.',
  lastUpdated: 'Today, 08:30 AM IST',
  bullets: [
    {
      title: 'US Technology Stocks Rally',
      globalTrend: 'Overnight in New York, major tech stocks rallied, causing the Nasdaq 100 index to rise 1.40% to 19,845.75.',
      globalTrendSimple: 'Last night in America, companies like Apple, Google and Microsoft saw their share prices go up. This is measured by something called the Nasdaq index, which rose 1.4% — think of it like a scoreboard for US tech companies.',
      indianImpact: 'Because Indian IT companies (like TCS and Infosys) earn more than 50% of their revenue from US corporate clients, a US tech rally directly boosts buyer sentiment and suggests strong opening gains for Indian IT shares.',
      indianImpactSimple: 'Companies like TCS and Infosys do most of their work for American companies. So when US tech does well, these Indian companies are expected to get more business and earn more money. This is why their stock prices go up when America\'s tech stocks go up.',
      companiesAffected: [
        {
          symbol: 'TCS',
          name: 'Tata Consultancy Services Ltd.',
          effect: 'POSITIVE',
          reason: 'Strong Nasdaq tech buying improves export pipeline confidence. The stock is expected to open with a gap up.',
          actionableGuidance: 'Do not chase the opening gap. Wait for a pullback towards ₹3,820-₹3,830 levels to accumulate shares safely.'
        },
        {
          symbol: 'INFY',
          name: 'Infosys Ltd.',
          effect: 'POSITIVE',
          reason: 'ADR gains in US markets signal immediate demand on domestic exchanges at the market open.',
          actionableGuidance: 'Hold existing positions. Buy fresh only if it sustains above its first resistance level of ₹1,510.'
        }
      ]
    },
    {
      title: 'Cheaper Crude Oil Prices',
      globalTrend: 'Brent Crude oil prices fell 1.20% overnight to $78.42 per barrel, continuing its downward trend.',
      globalTrendSimple: 'The price of oil in the world market fell last night. Oil is priced in US dollars, and the global benchmark price dropped to $78.42 per barrel.',
      indianImpact: 'India imports over 80% of its crude oil requirements. Falling prices lower our national trade deficit, reduce domestic raw material inflation, and directly expand profit margins for oil users like paints, chemicals, and aviation.',
      indianImpactSimple: 'India buys most of its oil from other countries. When global oil prices fall, India spends less money on imports. This is like your household spending less on petrol — you have more money left for other things. Companies that use oil to make products (like paint) also profit because their raw material becomes cheaper.',
      companiesAffected: [
        {
          symbol: 'ASIANPAINT',
          name: 'Asian Paints Ltd.',
          effect: 'POSITIVE',
          reason: 'Crude derivatives constitute over 40% of paint production cost. Lower oil prices boost operating profit margins.',
          actionableGuidance: 'Attractive entry point if the stock maintains support above ₹2,890 in the first hour of trading.'
        }
      ]
    },
    {
      title: 'GIFT Nifty Signals Strong Open',
      globalTrend: 'GIFT Nifty futures are trading 145.50 points higher at 23,610.50, reflecting positive global index cues.',
      globalTrendSimple: 'GIFT Nifty is like a sneak peek of what our stock market will do when it opens at 9:15 AM. Right now it\'s showing a positive number (+145 points), which means the market is likely to open higher today.',
      indianImpact: 'Acts as the primary early indicator for Nifty 50 opening session. The strong premium signals that domestic indices will experience an initial gap-up opening.',
      indianImpactSimple: 'Think of GIFT Nifty like a trailer before a movie. It shows us what mood the Indian stock market is in before trading officially begins. A positive GIFT Nifty means more buyers than sellers are ready, so prices will likely open higher.',
      companiesAffected: [
        {
          symbol: 'RELIANCE',
          name: 'Reliance Industries Ltd.',
          effect: 'POSITIVE',
          reason: 'As the highest-weighted stock in Nifty 50, overall index momentum will pull Reliance prices upward at the bell.',
          actionableGuidance: 'Wait for Nifty index volatility to cool off before entering. Maintain a strict trading stop-loss at ₹2,910.'
        }
      ]
    }
  ],
  sectors: [
    { 
      name: 'Information Technology (IT)', 
      sentiment: 'BULLISH', 
      reason: 'Strong positive cues from US Nasdaq tech gainers overnight, which typically translates to opening buying interest in large-cap Indian tech stocks.' 
    },
    { 
      name: 'Automobiles & Paints', 
      sentiment: 'BULLISH', 
      reason: 'Direct beneficiaries of falling crude oil prices. Lower oil prices decrease raw material costs (like plastic and chemical solvents), improving profit expectations.' 
    },
    { 
      name: 'Banking & Financials', 
      sentiment: 'NEUTRAL', 
      reason: 'Trading is expected to consolidate ahead of the RBI monetary policy review. Bank indices are likely to move sideways with low volatility.' 
    },
    { 
      name: 'Metals & Mining', 
      sentiment: 'BEARISH', 
      reason: 'Global metal prices cooled overnight due to soft industrial activity data from China. This puts short-term downward pressure on steel and aluminum producers.' 
    }
  ],
  companies: [], // kept empty as they are now nested inside bullets
  suggestedAction: {
    strategy: 'Nifty is expected to open with a gap of 130 to 150 points. Do not rush to buy stocks in the first 15 minutes (9:15 - 9:30 AM) when prices are highly volatile. Let the initial gap settle and look to buy quality stocks if the index dips back to test support levels.',
    strategySimple: 'The market looks like it will open much higher today. But here\'s the thing — the first 15 minutes after 9:15 AM are the most chaotic. Prices jump around wildly. The smart move is to wait, watch, and only buy if the market comes down a little from the opening high. Don\'t be the one rushing in at the most expensive price of the day.',
    sectorFocus: 'Look for buying opportunities in IT and Auto sectors on minor intraday pullbacks. Avoid taking heavy positions in metals.',
    riskWarning: 'Chasing a high gap-up opening carries the risk of early profit-booking. Keep stop-losses tight, especially if trading Nifty weekly options.',
    riskWarningSimple: 'When the market opens very high, many people who bought earlier will sell to make a quick profit. This can cause prices to fall after the opening. So do not put all your money in right when the market opens. Be patient, and never invest money you cannot afford to lose.'
  }
};

export const mockTickersData: MarketTicker[] = [
  {
    id: 'gift-nifty',
    name: 'GIFT Nifty',
    symbol: 'GIFNIF',
    value: '23,610.50',
    change: '+145.50',
    changePercent: '+0.62%',
    direction: 'UP',
    category: 'INDEX',
    time: '08:15 AM',
    sparkline: [23440, 23480, 23510, 23490, 23540, 23580, 23610.5],
    sourceUrl: 'https://finance.yahoo.com/quote/%5ENSEI',
    explainer: 'This is Indian Nifty 50 futures traded in GIFT City before our market opens at 9:15 AM. Think of it as a preview — if this number is positive, the market will likely open higher today.'
  },
  {
    id: 'nasdaq-100',
    name: 'Nasdaq 100',
    symbol: 'NDX',
    value: '19,845.75',
    change: '+275.12',
    changePercent: '+1.40%',
    direction: 'UP',
    category: 'INDEX',
    time: 'Closing',
    sparkline: [19550, 19600, 19620, 19580, 19690, 19740, 19845.75],
    sourceUrl: 'https://finance.yahoo.com/quote/%5ENDX',
    explainer: 'An index of the top 100 US technology companies (Apple, Google, Microsoft, etc.). When this rises, Indian IT companies like TCS and Infosys usually follow. Think of it as the “pulse” of American tech business.'
  },
  {
    id: 'sp-500',
    name: 'S&P 500',
    symbol: 'SPX',
    value: '5,473.17',
    change: '+45.85',
    changePercent: '+0.84%',
    direction: 'UP',
    category: 'INDEX',
    time: 'Closing',
    sparkline: [5420, 5435, 5430, 5425, 5450, 5462, 5473.17],
    sourceUrl: 'https://finance.yahoo.com/quote/%5EGSPC',
    explainer: 'An index tracking the 500 largest US companies. It represents the overall health of the American economy. When it goes up, global investor confidence is high — which is good for India too.'
  },
  {
    id: 'dow-jones',
    name: 'Dow Jones',
    symbol: 'DJI',
    value: '42,580.15',
    change: '+312.40',
    changePercent: '+0.74%',
    direction: 'UP',
    category: 'INDEX',
    time: 'Closing',
    sparkline: [42200, 42250, 42280, 42320, 42400, 42510, 42580.15],
    sourceUrl: 'https://finance.yahoo.com/quote/%5EDJI',
    explainer: 'Tracks 30 large US industrial companies like Boeing, Caterpillar, and Goldman Sachs. It reflects the health of traditional industries — when it rises, global trade sentiment is positive.'
  },
  {
    id: 'nikkei-225',
    name: 'Nikkei 225',
    symbol: 'N225',
    value: '38,620.40',
    change: '+310.80',
    changePercent: '+0.81%',
    direction: 'UP',
    category: 'INDEX',
    time: 'Live',
    sparkline: [38250, 38320, 38290, 38400, 38450, 38550, 38620.4],
    sourceUrl: 'https://finance.yahoo.com/quote/%5EN225',
    explainer: 'Japan\'s main stock market index. Since Japan\'s market closes a few hours before India\'s opens, a rising Nikkei is often a positive signal for Indian markets that morning.'
  },
  {
    id: 'hang-seng',
    name: 'Hang Seng',
    symbol: 'HSI',
    value: '17,892.50',
    change: '-122.10',
    changePercent: '-0.68%',
    direction: 'DOWN',
    category: 'INDEX',
    time: 'Live',
    sparkline: [18100, 18050, 18090, 17950, 17990, 17920, 17892.5],
    sourceUrl: 'https://finance.yahoo.com/quote/%5EHSI',
    explainer: 'Hong Kong\'s stock market index, heavily influenced by China. When China\'s economy slows, the Hang Seng usually falls — and this can put pressure on Indian metal and commodity stocks.'
  },
  {
    id: 'india-vix',
    name: 'India VIX',
    symbol: 'INDIAVIX',
    value: '13.42',
    change: '-0.85',
    changePercent: '-5.96%',
    direction: 'DOWN',
    category: 'INDEX',
    time: 'Prev Close',
    sparkline: [15.2, 14.8, 14.5, 14.2, 13.9, 13.65, 13.42],
    sourceUrl: 'https://finance.yahoo.com/quote/%5EINDIAVIX',
    explainer: 'India\'s "fear index." A low VIX (below 15) means the market is calm — like smooth weather. A high VIX (above 20) means the market is fearful and volatile — like a storm. Lower is better for investors.'
  },
  {
    id: 'brent-crude',
    name: 'Brent Crude Oil',
    symbol: 'BRENT',
    value: '$78.42',
    change: '-0.95',
    changePercent: '-1.20%',
    direction: 'DOWN',
    category: 'COMMODITY',
    time: 'Live',
    sparkline: [79.6, 79.4, 79.1, 79.3, 78.8, 78.6, 78.42],
    sourceUrl: 'https://finance.yahoo.com/quote/BZ%3DF',
    explainer: 'The price of oil that India imports from overseas. India imports over 80% of its oil needs. When oil prices rise, Indian companies pay more to run factories, deliver goods, and fuel vehicles — which can hurt profits and cause inflation.'
  },
  {
    id: 'gold',
    name: 'Gold (COMEX)',
    symbol: 'GCF',
    value: '$2,342.10',
    change: '-8.40',
    changePercent: '-0.36%',
    direction: 'DOWN',
    category: 'COMMODITY',
    time: 'Live',
    sparkline: [2368, 2360, 2355, 2350, 2348, 2345, 2342.10],
    sourceUrl: 'https://finance.yahoo.com/quote/GC%3DF',
    explainer: 'Gold is a "safe haven" asset. When global investors are scared or uncertain, they buy gold and sell stocks. So rising gold often means global fear is increasing — which is usually bad news for the stock market.'
  },
  {
    id: 'usd-inr',
    name: 'USD / INR',
    symbol: 'USDINR',
    value: '83.42',
    change: '-0.08',
    changePercent: '-0.10%',
    direction: 'DOWN',
    category: 'FOREX',
    time: 'Live',
    sparkline: [83.55, 83.52, 83.50, 83.47, 83.49, 83.45, 83.42],
    sourceUrl: 'https://finance.yahoo.com/quote/USDINR%3DX',
    explainer: 'How many Indian Rupees you need to buy 1 US Dollar. When this number goes up (e.g. ₹84 → ₹85), the Rupee is weakening — imports become more expensive. Foreign investors also tend to pull money out when the Rupee weakens.'
  },
  {
    id: 'dollar-index',
    name: 'US Dollar Index',
    symbol: 'DXY',
    value: '104.32',
    change: '-0.18',
    changePercent: '-0.17%',
    direction: 'DOWN',
    category: 'FOREX',
    time: 'Live',
    sparkline: [104.80, 104.70, 104.60, 104.55, 104.50, 104.40, 104.32],
    sourceUrl: 'https://finance.yahoo.com/quote/DX-Y.NYB',
    explainer: 'Measures how strong the US Dollar is against other major currencies. When the Dollar strengthens, foreign investors bring money back to the US — which means they sell Indian stocks. A falling DXY is good for Indian markets.'
  },
  {
    id: 'us-10y-bond',
    name: 'US 10Y Yield',
    symbol: 'US10Y',
    value: '4.215%',
    change: '-0.035',
    changePercent: '-0.82%',
    direction: 'DOWN',
    category: 'BOND',
    time: 'Live',
    sparkline: [4.27, 4.26, 4.25, 4.24, 4.23, 4.22, 4.215],
    sourceUrl: 'https://finance.yahoo.com/quote/%5ETNX',
    explainer: 'The return (interest) that investors get from US government bonds (10-year). When this rises above 4.5%, it attracts money away from Indian stocks (since bonds become a safer, better-paying option). Falling yields are good for stocks.'
  }
];
