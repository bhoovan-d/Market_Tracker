import { NextResponse } from 'next/server';
import { mockTickersData, MarketTicker } from '@/lib/mockData';

// Map of internal ticker IDs to Yahoo Finance tickers
const yahooTickerMap = [
  { id: 'gift-nifty',    symbol: '^NSEI'     },  // Nifty 50 (GIFT Nifty proxy)
  { id: 'nasdaq-100',   symbol: '^NDX'      },  // NASDAQ-100
  { id: 'sp-500',       symbol: '^GSPC'     },  // S&P 500
  { id: 'dow-jones',    symbol: '^DJI'      },  // Dow Jones Industrial Average
  { id: 'nikkei-225',   symbol: '^N225'     },  // Nikkei 225
  { id: 'hang-seng',    symbol: '^HSI'      },  // Hang Seng
  { id: 'india-vix',    symbol: '^INDIAVIX' },  // India VIX (fear gauge)
  { id: 'brent-crude',  symbol: 'BZ=F'      },  // Brent Crude Oil Futures
  { id: 'gold',         symbol: 'GC=F'      },  // COMEX Gold Futures
  { id: 'usd-inr',      symbol: 'INR=X'     },  // USD/INR Exchange Rate
  { id: 'dollar-index', symbol: 'DX-Y.NYB'  },  // US Dollar Index (DXY)
  { id: 'us-10y-bond',  symbol: '^TNX'      },  // US 10-Year Bond Yield
];

export async function GET() {
  try {
    // Clear out mock pricing details to ensure we only display live fetched data
    const updatedTickers: MarketTicker[] = mockTickersData.map(ticker => ({
      ...ticker,
      value: 'N/A',
      change: '—',
      changePercent: '—',
      direction: 'FLAT',
      time: 'Offline',
      sparkline: []
    }));

    // Helper to query Yahoo Finance public chart API
    const fetchYahooQuote = async (id: string, symbol: string) => {
      try {
        const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=15m`, {
          next: { revalidate: 120 } // Cache requests for 120 seconds
        });
        
        if (!res.ok) return null;
        const json = await res.json();
        
        const meta = json?.chart?.result?.[0]?.meta;
        const quotes = json?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
        
        if (!meta) return null;

        const currentVal = meta.regularMarketPrice;
        const prevClose = meta.previousClose || currentVal;
        
        // Clean nulls from the close prices array
        const sparklinePoints: number[] = quotes
          ? quotes.filter((q: any) => typeof q === 'number' && !isNaN(q))
          : [prevClose, currentVal];

        // Ensure we have at least 7 points for a nice sparkline visualization
        while (sparklinePoints.length < 7) {
          sparklinePoints.unshift(prevClose);
        }
        const recentSparkline = sparklinePoints.slice(-7);

        return {
          id,
          currentVal,
          prevClose,
          sparkline: recentSparkline
        };
      } catch (err) {
        console.error(`Yahoo fetch failed for ${symbol}:`, err);
        return null;
      }
    };

    // Trigger all fetches in parallel
    const promises = yahooTickerMap.map(({ id, symbol }) => fetchYahooQuote(id, symbol));
    const results = await Promise.all(promises);

    // Map responses back to updatedTickers array
    results.forEach((result) => {
      if (!result) return;

      const { id, currentVal, prevClose, sparkline } = result;
      const tickerIdx = updatedTickers.findIndex(t => t.id === id);
      
      if (tickerIdx !== -1) {
        const change = currentVal - prevClose;
        const changePercent = prevClose === 0 ? 0 : (change / prevClose) * 100;
        const direction = change > 0 ? 'UP' : change < 0 ? 'DOWN' : 'FLAT';
        
        // Custom formatting options for retail presentation
        let formattedVal = '';
        let formattedChange = '';
        let formattedPercent = (change >= 0 ? '+' : '') + changePercent.toFixed(2) + '%';

        if (id === 'brent-crude') {
          formattedVal = `$${currentVal.toFixed(2)}`;
          formattedChange = (change >= 0 ? '+' : '') + change.toFixed(2);
        } else if (id === 'gold') {
          formattedVal = `$${currentVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          formattedChange = (change >= 0 ? '+' : '') + change.toFixed(2);
        } else if (id === 'usd-inr') {
          formattedVal = currentVal.toFixed(2);
          formattedChange = (change >= 0 ? '+' : '') + change.toFixed(2);
        } else if (id === 'dollar-index') {
          formattedVal = currentVal.toFixed(2);
          formattedChange = (change >= 0 ? '+' : '') + change.toFixed(2);
        } else if (id === 'us-10y-bond') {
          formattedVal = `${currentVal.toFixed(3)}%`;
          formattedChange = (change >= 0 ? '+' : '') + change.toFixed(3);
        } else if (id === 'india-vix') {
          formattedVal = currentVal.toFixed(2);
          formattedChange = (change >= 0 ? '+' : '') + change.toFixed(2);
        } else {
          // Indices
          formattedVal = currentVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          formattedChange = (change >= 0 ? '+' : '') + change.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        updatedTickers[tickerIdx] = {
          ...updatedTickers[tickerIdx],
          value: formattedVal,
          change: formattedChange,
          changePercent: formattedPercent,
          direction,
          time: 'Live (Yahoo)',
          sparkline
        };
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedTickers,
      provider: 'yahoo-live',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error fetching global telemetry:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve live market data. Service is currently offline.',
      data: null
    }, { status: 503 });
  }
}
