import { NextResponse } from 'next/server';

export interface NewsArticle {
  title: string;
  source: string;
  link: string;
  pubDate: string;
  category: string;
}

// Fallback high-quality mock news if Google News RSS is down or empty
const fallbackNews: NewsArticle[] = [
  {
    title: "RBI keeps repo rate unchanged at 6.5%, maintains 'withdrawal of accommodation' stance",
    source: "Livemint",
    link: "https://www.livemint.com/market",
    pubDate: new Date(Date.now() - 2 * 3600000).toUTCString(), // 2 hours ago
    category: "Policy"
  },
  {
    title: "Nifty 50 approaches record high as foreign investors inject ₹1,432 Crore in a single session",
    source: "Moneycontrol",
    link: "https://www.moneycontrol.com/news/business/markets",
    pubDate: new Date(Date.now() - 4 * 3600000).toUTCString(), // 4 hours ago
    category: "Market"
  },
  {
    title: "Reliance Industries shares surge after telecom arm announces premium plans tariff hike",
    source: "The Economic Times",
    link: "https://economictimes.indiatimes.com/markets",
    pubDate: new Date(Date.now() - 6 * 3600000).toUTCString(), // 6 hours ago
    category: "Corporate"
  },
  {
    title: "US Federal Reserve hints at upcoming rate cuts, trigger global rally in technology shares",
    source: "Business Standard",
    link: "https://www.business-standard.com/category/finance",
    pubDate: new Date(Date.now() - 12 * 3600000).toUTCString(), // 12 hours ago
    category: "Global"
  },
  {
    title: "Brent Crude falls below $78/barrel, lowering import bill and boosting paint & chemical stocks",
    source: "CNBC-TV18",
    link: "https://www.cnbctv18.com/market",
    pubDate: new Date(Date.now() - 18 * 3600000).toUTCString(), // 18 hours ago
    category: "Commodities"
  },
  {
    title: "Tata Motors domestic passenger vehicle sales grow 8% YoY, driving stock to fresh 52-week high",
    source: "Financial Express",
    link: "https://www.financialexpress.com/market",
    pubDate: new Date(Date.now() - 24 * 3600000).toUTCString(), // 1 day ago
    category: "Corporate"
  }
];

const RENOWNED_SOURCES = [
  'The Economic Times', 'Economic Times', 'Moneycontrol', 'Livemint', 'Mint',
  'Business Standard', 'Financial Express', 'CNBC-TV18', 'NDTV Profit', 'Bloomberg',
  'Reuters', 'Business Line', 'Hindu Business Line', 'The Hindu Business Line',
  'Times of India', 'TOI', 'Hindustan Times', 'Indian Express'
];

export async function GET() {
  try {
    // 1. Refine Google News query to ensure it only retrieves articles from the last 24 hours (when:1d)
    const searchQuery = encodeURIComponent('("Indian stock market" OR "Nifty 50" OR "Sensex" OR "Indian equities" OR "Nifty shares") when:1d');
    const rssUrl = `https://news.google.com/rss/search?q=${searchQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

    const response = await fetch(rssUrl, {
      next: { revalidate: 300 } // Cache results for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Google News RSS returned status ${response.status}`);
    }

    const xml = await response.text();

    const articles: NewsArticle[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    // Extract up to 40 candidate articles for prioritization
    while ((match = itemRegex.exec(xml)) !== null && articles.length < 40) {
      const itemXml = match[1];

      const rawTitle = (itemXml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
      const link = (itemXml.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || '').trim();
      const pubDate = (itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || '').trim();
      const sourceTag = (itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/i)?.[1] || '').trim();

      if (!rawTitle || !link) continue;

      let title = rawTitle;
      let source = sourceTag || 'News';

      const lastHyphenIndex = rawTitle.lastIndexOf(' - ');
      if (lastHyphenIndex !== -1) {
        title = rawTitle.substring(0, lastHyphenIndex).trim();
        source = rawTitle.substring(lastHyphenIndex + 3).trim();
      }

      const deescape = (str: string) => {
        return str
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');
      };

      const cleanTitle = deescape(title);
      const cleanSource = deescape(source);

      // Simple heuristic categorizer based on keywords in title
      let category = 'Market';
      const titleLower = cleanTitle.toLowerCase();
      if (titleLower.includes('rbi') || titleLower.includes('policy') || titleLower.includes('rate') || titleLower.includes('tax') || titleLower.includes('budget')) {
        category = 'Policy';
      } else if (titleLower.includes('quarter') || titleLower.includes('q1') || titleLower.includes('q2') || titleLower.includes('q3') || titleLower.includes('q4') || titleLower.includes('profit') || titleLower.includes('sales') || titleLower.includes('shares rise') || titleLower.includes('shares fall') || titleLower.includes('ltd')) {
        category = 'Corporate';
      } else if (titleLower.includes('fed') || titleLower.includes('us') || titleLower.includes('global') || titleLower.includes('wall street') || titleLower.includes('nasdaq')) {
        category = 'Global';
      } else if (titleLower.includes('crude') || titleLower.includes('oil') || titleLower.includes('gold') || titleLower.includes('commodity') || titleLower.includes('metal')) {
        category = 'Commodities';
      }

      articles.push({
        title: cleanTitle,
        source: cleanSource,
        link,
        pubDate,
        category
      });
    }

    // 2. Sort articles to prioritize renowned financial publications first, and then sort by date (newest first)
    const getSourceScore = (sourceName: string) => {
      const lowerSrc = sourceName.toLowerCase();
      const isRenowned = RENOWNED_SOURCES.some(r => lowerSrc.includes(r.toLowerCase()));
      return isRenowned ? 1 : 0;
    };

    const getSafeTime = (dateStr: string) => {
      const parsed = Date.parse(dateStr);
      return isNaN(parsed) ? 0 : parsed;
    };

    const sortedArticles = articles.sort((a, b) => {
      const scoreA = getSourceScore(a.source);
      const scoreB = getSourceScore(b.source);

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Renowned sources first
      }
      return getSafeTime(b.pubDate) - getSafeTime(a.pubDate); // Recency fallback
    });

    // 3. Slice the top 10 best-match articles for presentation
    const finalArticles = sortedArticles.length > 0 ? sortedArticles.slice(0, 10) : fallbackNews;

    return NextResponse.json({
      success: true,
      data: finalArticles,
      provider: sortedArticles.length > 0 ? 'google-news-rss-prioritized' : 'fallback-mock',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Failed to fetch live market news:", error);
    // Graceful fallback to mock data on server error
    return NextResponse.json({
      success: true,
      data: fallbackNews,
      provider: 'fallback-mock-error',
      error: error.message || 'Fetch failed',
      timestamp: new Date().toISOString()
    });
  }
}
