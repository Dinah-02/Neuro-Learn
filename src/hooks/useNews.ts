import { useState, useEffect, useCallback } from 'react';
import { Article, Category, FilterState, Source } from '@/types/news';

// Mock data for demonstration
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'React 19 Introduces Revolutionary Compiler Technology',
    content: 'The React team has announced groundbreaking compiler improvements that will change how we build applications...',
    summary: 'React 19 brings automatic memoization, improved server components, and a new compiler that eliminates the need for useMemo and useCallback in most cases.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=1',
    author: 'Dan Abramov',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readingTime: 5,
    impact: 'high',
    sentiment: 'positive',
    category: 'Frontend',
    tags: ['React', 'JavaScript', 'Compiler'],
    engagementScore: 95,
  },
  {
    id: '2',
    title: 'GitHub Copilot X: The Future of AI-Assisted Development',
    content: 'GitHub unveils the next generation of Copilot with unprecedented capabilities...',
    summary: 'Copilot X introduces chat-based AI assistance, pull request summaries, and context-aware documentation generation.',
    source: 'github',
    sourceUrl: 'https://github.blog/copilot-x',
    author: 'GitHub Team',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    impact: 'high',
    sentiment: 'positive',
    category: 'AI',
    tags: ['AI', 'GitHub', 'Productivity'],
    engagementScore: 89,
  },
  {
    id: '3',
    title: 'TypeScript 5.4 Beta Released with Major Performance Improvements',
    content: 'Microsoft releases TypeScript 5.4 beta featuring significant compilation speed improvements...',
    summary: 'TypeScript 5.4 delivers 40% faster compilation, improved type inference, and new utility types for better developer experience.',
    source: 'devto',
    sourceUrl: 'https://dev.to/typescript-5-4',
    author: 'TypeScript Team',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    readingTime: 6,
    impact: 'medium',
    sentiment: 'positive',
    category: 'Languages',
    tags: ['TypeScript', 'JavaScript', 'Performance'],
    engagementScore: 76,
  },
  {
    id: '4',
    title: 'Critical Security Vulnerability Found in Popular npm Package',
    content: 'Security researchers discover a critical vulnerability affecting millions of projects...',
    summary: 'A severe remote code execution vulnerability has been identified in a widely-used npm package. Immediate update recommended.',
    source: 'reddit',
    sourceUrl: 'https://reddit.com/r/programming/security',
    author: 'SecurityResearcher',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    readingTime: 4,
    impact: 'high',
    sentiment: 'negative',
    category: 'Security',
    tags: ['Security', 'npm', 'Vulnerability'],
    engagementScore: 92,
  },
  {
    id: '5',
    title: 'Deno 2.0 Aims for Full Node.js Compatibility',
    content: 'Deno announces major milestone towards Node.js compatibility...',
    summary: 'Deno 2.0 will support npm packages natively and offer seamless migration path from Node.js projects.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=5',
    author: 'Ryan Dahl',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    readingTime: 7,
    impact: 'medium',
    sentiment: 'positive',
    category: 'Runtime',
    tags: ['Deno', 'Node.js', 'JavaScript'],
    engagementScore: 68,
  },
  {
    id: '6',
    title: 'The State of WebAssembly in 2024',
    content: 'A comprehensive look at WebAssembly adoption and future directions...',
    summary: 'WebAssembly gains traction with new proposals for garbage collection, threads, and improved JavaScript interop.',
    source: 'devto',
    sourceUrl: 'https://dev.to/webassembly-2024',
    author: 'Lin Clark',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    readingTime: 10,
    impact: 'medium',
    sentiment: 'neutral',
    category: 'WebAssembly',
    tags: ['WebAssembly', 'Performance', 'Web'],
    engagementScore: 54,
  },
  {
    id: '7',
    title: 'Rust Foundation Announces New Governance Model',
    content: 'The Rust Foundation unveils updated governance structure for the project...',
    summary: 'New governance model aims to increase community participation and ensure long-term sustainability of the Rust ecosystem.',
    source: 'reddit',
    sourceUrl: 'https://reddit.com/r/rust/governance',
    author: 'RustFoundation',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 5,
    impact: 'low',
    sentiment: 'neutral',
    category: 'Languages',
    tags: ['Rust', 'Open Source', 'Governance'],
    engagementScore: 42,
  },
  {
    id: '8',
    title: 'Next.js 15 Introduces Partial Prerendering',
    content: 'Vercel announces Next.js 15 with revolutionary partial prerendering feature...',
    summary: 'Partial prerendering combines static and dynamic rendering for optimal performance without sacrificing interactivity.',
    source: 'hackernews',
    sourceUrl: 'https://news.ycombinator.com/item?id=8',
    author: 'Guillermo Rauch',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    readingTime: 6,
    impact: 'high',
    sentiment: 'positive',
    category: 'Frontend',
    tags: ['Next.js', 'React', 'Performance'],
    engagementScore: 87,
  },
];

const mockCategories: Category[] = [
  { id: 'frontend', name: 'Frontend', count: 24 },
  { id: 'ai', name: 'AI & ML', count: 18 },
  { id: 'security', name: 'Security', count: 12 },
  { id: 'languages', name: 'Languages', count: 15 },
  { id: 'devops', name: 'DevOps', count: 9 },
  { id: 'webassembly', name: 'WebAssembly', count: 6 },
  { id: 'runtime', name: 'Runtime', count: 8 },
];

const mockSources: Source[] = [
  { id: 'hackernews', name: 'Hacker News', icon: 'Y', count: 42 },
  { id: 'devto', name: 'Dev.to', icon: 'D', count: 35 },
  { id: 'github', name: 'GitHub', icon: 'G', count: 28 },
  { id: 'reddit', name: 'Reddit', icon: 'R', count: 22 },
];

export const useNews = (filters: FilterState) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [topNews, setTopNews] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let filteredArticles = [...mockArticles];

      // Apply filters
      if (filters.source) {
        filteredArticles = filteredArticles.filter(a => a.source === filters.source);
      }
      if (filters.sentiment) {
        filteredArticles = filteredArticles.filter(a => a.sentiment === filters.sentiment);
      }
      if (filters.impact) {
        filteredArticles = filteredArticles.filter(a => a.impact === filters.impact);
      }
      if (filters.category) {
        filteredArticles = filteredArticles.filter(
          a => a.category.toLowerCase() === filters.category?.toLowerCase()
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredArticles = filteredArticles.filter(
          a =>
            a.title.toLowerCase().includes(searchLower) ||
            a.summary.toLowerCase().includes(searchLower) ||
            a.tags.some(t => t.toLowerCase().includes(searchLower))
        );
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'impact':
          const impactOrder = { high: 0, medium: 1, low: 2 };
          filteredArticles.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
          break;
        case 'engagement':
          filteredArticles.sort((a, b) => b.engagementScore - a.engagementScore);
          break;
        case 'latest':
        default:
          filteredArticles.sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
      }

      setArticles(filteredArticles);
      setTopNews(mockArticles.filter(a => a.impact === 'high').slice(0, 3));
      setCategories(mockCategories);
      setSources(mockSources);
    } catch (err) {
      setError('Failed to fetch news. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refresh = useCallback(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { articles, topNews, categories, sources, loading, error, refresh };
};
