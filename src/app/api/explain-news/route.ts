import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Local heuristic translations for offline/no-API-key fallback
function getHeuristicExplanation(headline: string): string {
  const hLower = headline.toLowerCase();
  
  if (hLower.includes('repo rate') || hLower.includes('rbi') || hLower.includes('monetary policy')) {
    return "The central bank (RBI) kept its baseline interest rates unchanged. For you, this means home, car, and personal loan EMIs will likely remain steady, and fixed deposit (FD) interest rates won't drop either.";
  }
  if (hLower.includes('reliance') || hLower.includes('jio') || hLower.includes('tariff')) {
    return "Jio/Reliance is charging more for its mobile plans. While this increases your monthly phone bill slightly, it makes the company more profitable, which typically makes its stock price rise.";
  }
  if (hLower.includes('crude') || hLower.includes('oil') || hLower.includes('brent')) {
    return "Global oil prices fell. Since India buys 80% of its oil from abroad, cheaper oil acts like getting a discount on a household budget—lowering overall costs for fuel, transport, and paints.";
  }
  if (hLower.includes('foreign') || hLower.includes('fpi') || hLower.includes('fii')) {
    return "Foreign institutional investors are buying Indian stocks. Think of it like wealthy foreign guests entering a local market; their massive buying power raises stock prices across the board.";
  }
  if (hLower.includes('fed') || hLower.includes('rate cut') || hLower.includes('interest rate')) {
    return "The US central bank is discussing interest rate cuts. When interest rates in the US fall, foreign money tends to travel to growing economies like India in search of higher returns, boosting our markets.";
  }
  if (hLower.includes('tata motors') || hLower.includes('auto') || hLower.includes('sales')) {
    return "Tata Motors reported higher car sales. This shows that more Indian families are buying cars, signaling a healthy economy and growing profits for automotive manufacturers.";
  }
  
  return "This news signals shifting dynamics in the market. For your money, it indicates that key sectors are adjusting to global cues, and holding steady with a long-term mutual fund or stock portfolio is the best way to handle this volatility.";
}

export async function POST(request: Request) {
  try {
    let body = { headline: '', source: '' };
    try {
      body = await request.json();
    } catch (e) {}

    const { headline, source } = body;

    if (!headline) {
      return NextResponse.json({
        success: false,
        error: 'Headline is required'
      }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    // If Gemini key is not configured, immediately use the fallback engine
    if (!geminiKey || geminiKey === 'your_gemini_key_here') {
      const explanation = getHeuristicExplanation(headline);
      return NextResponse.json({
        success: true,
        data: {
          explanation,
          provider: 'heuristic-local'
        }
      });
    }

    const systemInstruction = `
You are a senior financial analyst and educator for Nifty Pulse, India's plain-English market education platform.
Your audience: first-generation Indian retail investors who do not understand financial jargon.

Given a stock market news headline, explain in 1 or 2 sentences max:
1. What does it actually mean?
2. How does it affect a normal Indian retail investor's pocket (Nifty index, share prices, mutual funds, EMIs, or cost of living)?

CRITICAL RULES:
- Use simple, everyday terms.
- Use a relatable daily analogy (e.g., household budget, petrol prices, cricket runs, family savings, weather) to make it easy to grasp.
- Keep it extremely brief (maximum 2 sentences).
- Do NOT use financial jargon (like "aggregate demand", "repo rate cuts transmission", "liquidity injections") without translating it.
- Maintain a warm, friendly, mentor-like tone.
- Output ONLY the plain explanation. Do not include markdown formatting like blockquotes, or introductory phrases like "Here is the explanation:".
`;

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      systemInstruction: systemInstruction
    });

    const prompt = `Headline: "${headline}"\nSource: "${source || 'News'}"\nGenerate the plain-English explanation:`;

    const response = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const explanation = response.response.text().trim();

    return NextResponse.json({
      success: true,
      data: {
        explanation,
        provider: 'gemini-flash'
      }
    });

  } catch (error: any) {
    console.error('Error generating headline translation:', error);
    // Graceful fallback to heuristic database on failure
    try {
      const body = await request.clone().json();
      const explanation = getHeuristicExplanation(body.headline || '');
      return NextResponse.json({
        success: true,
        data: {
          explanation,
          provider: 'heuristic-local-fallback'
        }
      });
    } catch (e) {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate explanation.'
      }, { status: 500 });
    }
  }
}
