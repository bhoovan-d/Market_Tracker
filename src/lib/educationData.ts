export interface JargonDefinition {
  term: string;
  displayTerm: string;
  definition: string;
  analogy: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MacroConcept {
  id: string;
  dayOfWeek: number; // 1 = Monday, 5 = Friday, etc.
  title: string;
  subtitle: string;
  analogyTitle: string;
  conceptText: string;
  analogyText: string;
  whatToLookFor: string;
  quiz: QuizQuestion;
}

// Dictionary of jargon keywords to search for in AI notes and history.
// We use regex-friendly term strings to make client matching accurate.
export const jargonDictionary: JargonDefinition[] = [
  {
    term: 'FII',
    displayTerm: 'FII (Foreign Institutional Investor)',
    definition: 'Large foreign investment funds, such as American pension funds, sovereign wealth funds, or international banks, investing in Indian companies.',
    analogy: 'Think of FIIs as international guest stars in a local sports tournament. When they arrive with their star power and big funds, the game matches get huge and exciting (prices go up); when they pack up and leave, the stadium feels a bit empty.'
  },
  {
    term: 'FIIs',
    displayTerm: 'FIIs (Foreign Institutional Investors)',
    definition: 'Large foreign investment funds, such as American pension funds, sovereign wealth funds, or international banks, investing in Indian companies.',
    analogy: 'Think of FIIs as international guest stars in a local sports tournament. When they arrive with their star power and big funds, the game matches get huge and exciting (prices go up); when they pack up and leave, the stadium feels a bit empty.'
  },
  {
    term: 'DII',
    displayTerm: 'DII (Domestic Institutional Investor)',
    definition: 'Indian financial institutions like LIC, SBI Mutual Fund, or ICICI Prudential, which invest domestic savings into the Indian stock market.',
    analogy: 'Think of DIIs as the home team fans. When foreign players (FIIs) pull out or start selling, these local fans keep buying tickets and supporting the team, preventing the match from collapsing completely.'
  },
  {
    term: 'DIIs',
    displayTerm: 'DIIs (Domestic Institutional Investors)',
    definition: 'Indian financial institutions like LIC, SBI Mutual Fund, or ICICI Prudential, which invest domestic savings into the Indian stock market.',
    analogy: 'Think of DIIs as the home team fans. When foreign players (FIIs) pull out or start selling, these local fans keep buying tickets and supporting the team, preventing the match from collapsing completely.'
  },
  {
    term: 'India VIX',
    displayTerm: 'India VIX (Volatility Index)',
    definition: 'Often called the "Fear Index," it measures how much traders expect the Nifty 50 to swing up or down over the next 30 days based on option prices.',
    analogy: 'Think of VIX as a weather forecast for sea waves. A low VIX (below 12) means calm, predictable waters. A high VIX (above 16) warns of high stormy waves where prices can swing wildly in either direction.'
  },
  {
    term: 'VIX',
    displayTerm: 'VIX (Volatility Index)',
    definition: 'Often called the "Fear Index," it measures how much traders expect the Nifty 50 to swing up or down over the next 30 days based on option prices.',
    analogy: 'Think of VIX as a weather forecast for sea waves. A low VIX (below 12) means calm, predictable waters. A high VIX (above 16) warns of high stormy waves where prices can swing wildly in either direction.'
  },
  {
    term: 'GIFT Nifty',
    displayTerm: 'GIFT Nifty Futures',
    definition: 'Nifty 50 index contracts traded on the NSE International Exchange in GIFT City, Gujarat. It trades almost 21 hours a day, capturing global news before Indian markets open.',
    analogy: 'GIFT Nifty is like a movie trailer. Because it is active while we sleep, it gives us a sneak peek of the mood (positive or negative) that the Indian market will open in at 9:15 AM.'
  },
  {
    term: 'Brent Crude',
    displayTerm: 'Brent Crude Oil',
    definition: 'The global benchmark price for raw crude oil. India imports more than 80% of its oil, making this price highly critical to the Indian economy.',
    analogy: 'Since India imports almost all its oil, global oil prices are like your personal household fuel expenses. When oil prices drop, it saves our nation massive money and boosts paint, auto, and airline companies (which use oil to make paint/plastics/fuel).'
  },
  {
    term: 'Crude',
    displayTerm: 'Crude Oil',
    definition: 'The global benchmark price for raw crude oil. India imports more than 80% of its oil, making this price highly critical to the Indian economy.',
    analogy: 'Since India imports almost all its oil, global oil prices are like your personal household fuel expenses. When oil prices drop, it saves our nation massive money and boosts paint, auto, and airline companies (which use oil to make paint/plastics/fuel).'
  },
  {
    term: 'DXY',
    displayTerm: 'DXY (US Dollar Index)',
    definition: 'A benchmark index measuring the value of the US Dollar against a basket of six major global currencies (like the Euro and Yen).',
    analogy: 'Think of the Dollar Index as a global gravity scale. When US Dollar gravity is strong (high DXY), it pulls global money away from risky markets like India back to safe US bank accounts. When it is weak, money flows back to India.'
  },
  {
    term: 'Dollar Index',
    displayTerm: 'DXY (US Dollar Index)',
    definition: 'A benchmark index measuring the value of the US Dollar against a basket of six major global currencies (like the Euro and Yen).',
    analogy: 'Think of the Dollar Index as a global gravity scale. When US Dollar gravity is strong (high DXY), it pulls global money away from risky markets like India back to safe US bank accounts. When it is weak, money flows back to India.'
  },
  {
    term: 'Yield',
    displayTerm: 'US Treasury Yield',
    definition: 'The interest rate paid by the US government on its long-term debt securities (bonds), usually referenced by the US 10-Year Bond.',
    analogy: 'US bond yields are like a mega-bank raising interest rates on savings accounts. If safe US government deposits start paying high interest, foreign investors sell their volatile Indian shares and park their money in safe US bonds.'
  },
  {
    term: 'Yields',
    displayTerm: 'US Treasury Yields',
    definition: 'The interest rate paid by the US government on its long-term debt securities (bonds), usually referenced by the US 10-Year Bond.',
    analogy: 'US bond yields are like a mega-bank raising interest rates on savings accounts. If safe US government deposits start paying high interest, foreign investors sell their volatile Indian shares and park their money in safe US bonds.'
  },
  {
    term: 'Bond Yields',
    displayTerm: 'US Treasury Bond Yields',
    definition: 'The interest rate paid by the US government on its long-term debt securities (bonds), usually referenced by the US 10-Year Bond.',
    analogy: 'US bond yields are like a mega-bank raising interest rates on savings accounts. If safe US government deposits start paying high interest, foreign investors sell their volatile Indian shares and park their money in safe US bonds.'
  },
  {
    term: 'OMC',
    displayTerm: 'OMC (Oil Marketing Company)',
    definition: 'Indian government-owned oil refining and marketing companies like Indian Oil (IOC), Bharat Petroleum (BPCL), and Hindustan Petroleum (HPCL).',
    analogy: 'OMCs are like petrol pump distributors. When raw crude oil is cheap, their costs drop, but retail petrol prices stay stable, so their profit margins widen. If oil gets expensive, their costs rise, squeezing their margins.'
  },
  {
    term: 'OMCs',
    displayTerm: 'OMCs (Oil Marketing Companies)',
    definition: 'Indian government-owned oil refining and marketing companies like Indian Oil (IOC), Bharat Petroleum (BPCL), and Hindustan Petroleum (HPCL).',
    analogy: 'OMCs are like petrol pump distributors. When raw crude oil is cheap, their costs drop, but retail petrol prices stay stable, so their profit margins widen. If oil gets expensive, their costs rise, squeezing their margins.'
  },
  {
    term: 'Expiry Day',
    displayTerm: 'Weekly Options Expiry',
    definition: 'The day weekly Nifty derivative contracts expire (every Thursday). Option writers and buyers must settle their positions by 3:30 PM.',
    analogy: 'Expiry day is like the high-pressure final overs of a T20 cricket match. Traders are forced to settle their bets, causing sudden shifts in order books and high intraday swings that have nothing to do with long-term company value.'
  },
  {
    term: 'Expiry',
    displayTerm: 'Weekly Options Expiry',
    definition: 'The day weekly Nifty derivative contracts expire (every Thursday). Option writers and buyers must settle their positions by 3:30 PM.',
    analogy: 'Expiry day is like the high-pressure final overs of a T20 cricket match. Traders are forced to settle their bets, causing sudden shifts in order books and high intraday swings that have nothing to do with long-term company value.'
  },
  {
    term: 'Stop-loss',
    displayTerm: 'Stop-Loss Order',
    definition: 'A trading order placed with a broker to sell a stock automatically when it reaches a certain price to prevent severe losses.',
    analogy: 'A stop-loss is like a safety harness. If a stock falls unexpectedly, the harness catches you early, selling the stock so your losses are limited rather than letting your money drop to zero.'
  },
  {
    term: 'Stop-losses',
    displayTerm: 'Stop-Loss Orders',
    definition: 'A trading order placed with a broker to sell a stock automatically when it reaches a certain price to prevent severe losses.',
    analogy: 'A stop-loss is like a safety harness. If a stock falls unexpectedly, the harness catches you early, selling the stock so your losses are limited rather than letting your money drop to zero.'
  },
  {
    term: 'stop-losses',
    displayTerm: 'Stop-Loss Orders',
    definition: 'A trading order placed with a broker to sell a stock automatically when it reaches a certain price to prevent severe losses.',
    analogy: 'A stop-loss is like a safety harness. If a stock falls unexpectedly, the harness catches you early, selling the stock so your losses are limited rather than letting your money drop to zero.'
  },
  {
    term: 'Profit-booking',
    displayTerm: 'Profit Booking',
    definition: 'Selling shares that have recently risen to lock in gains and convert paper profits into actual cash.',
    analogy: 'Profit-booking is like taking your chips off the casino table. While a stock goes up, your profit is just numbers on a screen (paper profit). Selling it transfers that profit safely into your bank account.'
  },
  {
    term: 'profit-booking',
    displayTerm: 'Profit Booking',
    definition: 'Selling shares that have recently risen to lock in gains and convert paper profits into actual cash.',
    analogy: 'Profit-booking is like taking your chips off the casino table. While a stock goes up, your profit is just numbers on a screen (paper profit). Selling it transfers that profit safely into your bank account.'
  },
  {
    term: 'Gap Up',
    displayTerm: 'Gap Up Opening',
    definition: 'When Nifty opens at a price significantly higher than the previous day\'s closing price.',
    analogy: 'A gap-up is like a cricket team resuming their innings with the score already bumped up by penalty runs. The chart shows a physical blank space or "gap" where no trading happened.'
  },
  {
    term: 'Gap Down',
    displayTerm: 'Gap Down Opening',
    definition: 'When Nifty opens at a price significantly lower than the previous day\'s closing price.',
    analogy: 'A gap-down is like a batsman stepping onto the field to find his team already down by two wickets before he even faces a ball due to overnight penalties.'
  },
  {
    term: 'Mean-reversion',
    displayTerm: 'Mean Reversion',
    definition: 'The statistical tendency of stock prices to return back to their historical average after an extreme upward or downward movement.',
    analogy: 'Think of the market as an elastic rubber band. You can stretch it far in one direction (very high or very low), but eventually, the tension pulls it back to its rest position (the average).'
  },
  {
    term: 'mean-reversion',
    displayTerm: 'Mean Reversion',
    definition: 'The statistical tendency of stock prices to return back to their historical average after an extreme upward or downward movement.',
    analogy: 'Think of the market as an elastic rubber band. You can stretch it far in one direction (very high or very low), but eventually, the tension pulls it back to its rest position (the average).'
  }
];

// Daily macro concept card database.
export const dailyConcepts: MacroConcept[] = [
  {
    id: 'fii-dii-war',
    dayOfWeek: 1, // Monday
    title: 'FIIs vs DIIs',
    subtitle: 'The Foreign vs Local Tug of War',
    analogyTitle: 'Guest Stars vs Home Crowd fans',
    conceptText: 'FIIs (Foreign Institutional Investors) are foreign funds that bring massive global cash to India. DIIs (Domestic Institutional Investors) are Indian mutual funds and LIC. Historically, Indian markets rose and fell solely based on FII mood. Today, because millions of normal Indians invest monthly via SIPs, DIIs have accumulated huge cash reserves. When FIIs sell to panic-exit, DIIs step in to buy, stabilizing Nifty and shielding retail portfolios.',
    analogyText: 'Think of FIIs as big foreign guest players hired for local cricket clubs. When they perform well and invest effort, tickets sell out and the league rises. But if they get scared and fly home, the home team fans (DIIs) buy out all the seats and cheer the team, keeping the match alive and preventing a complete stadium washout.',
    whatToLookFor: 'Look at daily "FII / DII net flows" in financial news. If FIIs are selling (-₹2,000 Cr) but DIIs are buying (+₹2,200 Cr), the market remains healthy and stable.',
    quiz: {
      question: 'If foreign funds (FIIs) are selling heavily due to US panic, Nifty today will likely:',
      options: [
        'Crash by 10% automatically',
        'Hold relatively stable if Indian DIIs step in to buy the dip',
        'Double in value within minutes'
      ],
      correctIndex: 1,
      explanation: 'DIIs act as a sponge. Armed with your SIP mutual fund contributions, they buy shares when prices drop, countering FII selling pressure.'
    }
  },
  {
    id: 'fed-elevator',
    dayOfWeek: 2, // Tuesday
    title: 'US Fed Interest Rates',
    subtitle: 'The Global Cost of Capital Elevator',
    analogyTitle: 'Global Financial Gravity',
    conceptText: 'The US Federal Reserve (the Fed) is the most powerful central bank in the world. When the Fed raises interest rates, safe US government bonds start paying higher interest. As a result, global money becomes expensive. Foreign investors decide that volatile emerging markets like India are not worth the risk, so they sell Indian shares to buy safe US bonds. Conversely, when the Fed cuts rates, global capital floods back into India looking for higher returns.',
    analogyText: 'Think of US interest rates like global financial gravity. When interest rates are low, gravity is weak, and cash floats out easily to emerging markets like India. But when the Fed raises interest rates, gravity spikes, pulling all global capital back down into safe US Treasury vaults.',
    whatToLookFor: 'Watch US Federal Reserve rate announcements. A "rate cut" is highly bullish for emerging markets like India, while a "rate hike" creates bearish headwind.',
    quiz: {
      question: 'Why does a US Fed rate hike usually cause foreign investors to sell Indian stocks?',
      options: [
        'They are forced to by Indian law',
        'Safe US bonds start paying higher returns, making riskier stocks less attractive',
        'They prefer to keep money in cash drawers'
      ],
      correctIndex: 1,
      explanation: 'When safe US government bonds pay 4.5% to 5% interest, foreign funds prefer that low-risk yield over emerging market equities.'
    }
  },
  {
    id: 'crude-paints',
    dayOfWeek: 3, // Wednesday
    title: 'Brent Crude Oil',
    subtitle: 'The Indian Profit Margin Lubricant',
    analogyTitle: 'Your Household Petrol Expenses',
    conceptText: 'India imports more than 80% of its crude oil needs, paying in US dollars. When Brent Crude prices drop, India saves huge foreign currency reserves. More importantly, crude oil is the primary raw material for making paints, plastics, adhesives, and aviation fuel. Lower oil prices directly reduce production costs for paint companies (like Asian Paints) and airlines (like IndiGo), expanding their operating profit margins overnight.',
    analogyText: 'Think of crude oil as the price of petrol for your household vehicle. If petrol prices fall by 20%, you suddenly have thousands of rupees left over to spend on dining out or buying groceries. Similarly, companies that use oil derivatives save massive costs, leaving them with high profits.',
    whatToLookFor: 'Check overnight Brent Crude prices. If Brent falls below $80/barrel, it is generally bullish for paint, chemical, aviation, and automobile shares.',
    quiz: {
      question: 'Which sector stands to benefit the MOST when global crude oil prices drop by 5%?',
      options: [
        'IT / Software exporters (TCS, Infosys)',
        'Paint & Chemical companies (Asian Paints, Berger)',
        'Metal manufacturers (Tata Steel, Hindalco)'
      ],
      correctIndex: 1,
      explanation: 'Crude oil derivatives represent over 40% of the raw material cost for making paints. Lower oil = cheaper paint manufacturing = higher margins!'
    }
  },
  {
    id: 'expiry-overs',
    dayOfWeek: 4, // Thursday
    title: 'Weekly Options Expiry',
    subtitle: 'Intraday Noise vs Long-Term Value',
    analogyTitle: 'The T20 Cricket Death Overs',
    conceptText: 'Every Thursday, weekly derivative (options) contracts for the Nifty 50 expire. Traders who wrote options bets must settle their positions by 3:30 PM. This triggers massive automated trading algorithms, volume surges, and sudden price swings in the final hours of the session. These swings are purely technical adjustments and do not reflect any change in company fundamentals.',
    analogyText: 'Expiry day is like the final 4 overs of a T20 cricket match. Players take extreme risks, hitting wild shots and dropping wickets at double the normal rate. The action is intense and unpredictable, but it doesn\'t mean the batsmen have forgotten how to play standard cricket.',
    whatToLookFor: 'Avoid trading heavily between 2:00 PM and 3:30 PM on Thursdays. The price swings are often "noise" created by derivative settlement algorithms.',
    quiz: {
      question: 'A sudden 80-point drop in Nifty on Thursday afternoon without any bad news is likely due to:',
      options: [
        'A corporate bankruptcy',
        'Weekly options expiry settlement adjustments',
        'The US stock exchange catching fire'
      ],
      correctIndex: 1,
      explanation: 'Option writers wrapping up their bets trigger automated bulk trades, causing brief price swings that iron out by Friday morning.'
    }
  },
  {
    id: 'dxy-gravity',
    dayOfWeek: 5, // Friday
    title: 'US Dollar Index (DXY)',
    subtitle: 'The Currency Tug of War',
    analogyTitle: 'The Strength of the Global Currency Scale',
    conceptText: 'The US Dollar Index (DXY) tracks the value of the US Dollar against six global currencies. Because global trade and commodities (like oil) are priced in USD, a rising DXY means the dollar is getting stronger, making imports more expensive for emerging economies like India. It also puts pressure on the Indian Rupee (INR). A weaker Rupee reduces FII returns when converted back to USD, forcing them to sell Indian holdings.',
    analogyText: 'Think of the Dollar as the heavyweight champion on a global currency seesaw. When the Dollar index goes up, it weighs down currencies of developing countries like India, making their fuel and electronics imports expensive and pulling their markets down.',
    whatToLookFor: 'Watch the DXY index on the dashboard. A DXY falling below 103 indicates global funds are comfortable investing in emerging markets like Nifty.',
    quiz: {
      question: 'How does a rising US Dollar Index (DXY) affect the Indian Rupee (INR)?',
      options: [
        'It makes the Rupee stronger',
        'It puts pressure on the Rupee, making it weaker against the Dollar',
        'It has zero correlation with the Rupee'
      ],
      correctIndex: 1,
      explanation: 'A stronger USD means you need more Rupees to buy one Dollar, weakening the Rupee and making national imports (like crude) expensive.'
    }
  }
];

export function getConceptForDay(dateStr?: string): MacroConcept {
  // Determine day of the week (1-5)
  // If weekend, default to Friday (5) or Monday (1)
  const date = dateStr ? new Date(dateStr) : new Date();
  // Adjust to IST
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + 3600000 * 5.5);
  let day = istDate.getDay(); // 0 = Sunday, 1 = Monday, 6 = Saturday
  
  if (day === 0 || day === 6) {
    day = 1; // Default to Monday concept on weekends
  }
  
  return dailyConcepts.find(c => c.dayOfWeek === day) || dailyConcepts[0];
}
