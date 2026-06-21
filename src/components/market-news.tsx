'use client';

import React, { useState, useEffect } from 'react';
import { useMode } from '@/context/ModeContext';
import { 
  Newspaper, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Sparkles, 
  Lightbulb, 
  Clock, 
  AlertCircle, 
  Tag, 
  Filter, 
  ChevronDown 
} from 'lucide-react';
import JargonWrapper from '@/components/jargon-wrapper';

interface NewsArticle {
  title: string;
  source: string;
  link: string;
  pubDate: string;
  category: string;
}

export default function MarketNews() {
  const { isSimple } = useMode();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Track AI translations in state: { [headline]: "explanation text" }
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  // Track loading state of each headline translation: { [headline]: boolean }
  const [explaining, setExplaining] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/market-news');
      if (!res.ok) throw new Error('Failed to retrieve news feed.');
      
      const json = await res.json();
      if (json.success && json.data) {
        setArticles(json.data);
      } else {
        throw new Error(json.error || 'Invalid news payload.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not connect to news server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const translateHeadline = async (headline: string, source: string) => {
    // If already translated, do nothing
    if (explanations[headline]) return;

    setExplaining(prev => ({ ...prev, [headline]: true }));
    try {
      const res = await fetch('/api/explain-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline, source })
      });
      
      if (!res.ok) throw new Error();
      const json = await res.json();
      if (json.success && json.data?.explanation) {
        setExplanations(prev => ({ ...prev, [headline]: json.data.explanation }));
      } else {
        throw new Error();
      }
    } catch (e) {
      setExplanations(prev => ({ 
        ...prev, 
        [headline]: "Could not load explanation. Check your network connection or API setup." 
      }));
    } finally {
      setExplaining(prev => ({ ...prev, [headline]: false }));
    }
  };

  // Helper to format raw dates into a human relative string (e.g. "2 hours ago")
  const formatRelativeTime = (dateStr: string) => {
    try {
      const now = new Date();
      const pub = new Date(dateStr);
      const diffMs = now.getTime() - pub.getTime();
      
      if (isNaN(pub.getTime())) return dateStr;

      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch (e) {
      return dateStr;
    }
  };

  // Get color configurations for categories
  const getCategoryStyles = (category: string) => {
    const configs: Record<string, { badge: string; border: string }> = {
      Policy: {
        badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
        border: 'hover:border-purple-500/30'
      },
      Market: {
        badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        border: 'hover:border-blue-500/30'
      },
      Corporate: {
        badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        border: 'hover:border-emerald-500/30'
      },
      Global: {
        badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        border: 'hover:border-orange-500/30'
      },
      Commodities: {
        badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        border: 'hover:border-amber-500/30'
      }
    };
    return configs[category] || {
      badge: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
      border: 'hover:border-slate-500/30'
    };
  };

  // Filter and search computation
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || art.category.toUpperCase() === selectedCategory.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'POLICY', 'MARKET', 'CORPORATE', 'GLOBAL', 'COMMODITIES'];

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-border bg-slate-950/40 p-4 sm:p-5 shadow-xl backdrop-blur-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Header */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-100">Live Indian Market News</h3>
              <p className="text-xs text-slate-400 font-mono">
                Real-time regulatory actions, corporate updates, and macroeconomic catalysts
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex w-full md:w-auto items-center gap-3">
            {/* Search Box */}
            <div className="relative flex-1 md:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines or sources..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-900 bg-slate-950/60 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => fetchNews(true)}
              disabled={loading || refreshing}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900/40 text-slate-300 hover:text-slate-100 text-sm transition-colors cursor-pointer disabled:opacity-40"
              title="Refresh live feeds"
            >
              <RefreshCw className={`h-4.5 w-4.5 text-violet-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 font-mono scrollbar-none border-t border-slate-900/60 pt-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-2 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            Filter:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                    : 'bg-slate-900/20 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                }`}
              >
                {cat === 'ALL' ? 'All News' : cat.toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl border border-slate-900 bg-slate-950/20 p-5 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-900 rounded w-16"></div>
                <div className="h-4 bg-slate-900 rounded w-24"></div>
              </div>
              <div className="h-10 bg-slate-900 rounded w-full"></div>
              <div className="h-4 bg-slate-900 rounded w-1/3 pt-2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-950/20 bg-rose-950/5 p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-rose-500 mx-auto" />
          <div>
            <h4 className="text-slate-200 font-bold">News Connection Interrupted</h4>
            <p className="text-sm text-slate-450 mt-1">{error}</p>
          </div>
          <button
            onClick={() => fetchNews()}
            className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl hover:bg-slate-850 hover:text-slate-100 text-sm font-semibold transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-12 text-center">
          <Newspaper className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-medium">No matching articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article, idx) => {
            const catStyles = getCategoryStyles(article.category);
            const relativeTime = formatRelativeTime(article.pubDate);
            const explanation = explanations[article.title];
            const isExplaining = explaining[article.title];

            return (
              <div 
                key={idx}
                className={`rounded-2xl border border-border bg-slate-950/40 p-5 shadow-md flex flex-col justify-between transition-all duration-205 ${catStyles.border} hover:shadow-lg relative overflow-hidden`}
              >
                {/* Visual accent color band */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent opacity-40" />

                <div className="space-y-4">
                  {/* Metadata Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    {/* Category tag */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${catStyles.badge}`}>
                      {article.category}
                    </span>

                    {/* Source & Date info */}
                    <div className="flex items-center gap-2.5 text-xs text-slate-400 font-mono">
                      <span className="font-semibold text-slate-300">{article.source}</span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {relativeTime}
                      </span>
                    </div>
                  </div>

                  {/* Headline Title */}
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-100 tracking-tight leading-snug font-sans group">
                      <JargonWrapper text={article.title} />
                    </h4>
                  </div>
                </div>

                {/* Translation display Block (if triggered in Simple Mode) */}
                {isSimple && (
                  <div className="mt-4 pt-3.5 border-t border-slate-900/60">
                    {explanation ? (
                      <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-mono uppercase tracking-wider mb-1.5">
                          <Lightbulb className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>Common Man Summary</span>
                        </div>
                        <p className="text-sm text-slate-200 leading-relaxed font-sans italic">
                          "{explanation}"
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => translateHeadline(article.title, article.source)}
                        disabled={isExplaining}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-amber-500/15 hover:border-amber-500/35 bg-amber-500/5 hover:bg-amber-500/10 text-amber-400 hover:text-amber-350 text-xs font-bold tracking-wide transition-all cursor-pointer disabled:opacity-40"
                      >
                        {isExplaining ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                            <span>Translating Finance Jargon...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                            <span>Translate to Common Man Language</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Action buttons footer */}
                <div className="mt-5 pt-3 border-t border-slate-900/60 flex items-center justify-between text-sm">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">
                    Feed source: Google News
                  </span>
                  
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors py-1 cursor-pointer"
                  >
                    <span>Read Full Article</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
