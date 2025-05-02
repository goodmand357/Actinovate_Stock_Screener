
import React, { useEffect, useState } from 'react';
import {
  Download, ChevronDown, ChevronUp, Bell, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Alert, AlertTitle, AlertDescription
} from '@/components/ui/alert';

const baseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const functionsUrl = `${baseUrl}/functions/v1`;

interface Stock {
  symbol: string;
  name?: string;
  sector: string;
  industry?: string;
  price: number;
  change?: number;
  change_percent?: number;
  market_cap: number;
  volume?: number;
  pe_ratio?: number;
  trailingPE?: number;
  forwardPE?: number;
  pegRatio?: number;
  priceToBook?: number;
  returnOnEquity?: number;
  dividendYield?: number;
  dividend_yield?: number;
  beta?: number;
  eps?: number;
  revenue?: number;
  grossProfits?: number;
  net_profit?: number;
  net_profit_percent?: number;
}

const Screener = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [alertedStocks, setAlertedStocks] = useState<string[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sector: 'All',
    industry: 'All',
    netProfit: '',
    netProfitPercent: ''
  });

  const [sectors, setSectors] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  const fetchScreener = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("limit", "10");
      query.append("page", "1");
      if (filters.minPrice) query.append('min_price', filters.minPrice);
      if (filters.maxPrice) query.append('max_price', filters.maxPrice);
      if (filters.netProfit) query.append('net_profit', filters.netProfit);
      if (filters.netProfitPercent) query.append('net_profit_percent', filters.netProfitPercent);
      if (filters.sector && filters.sector !== 'All') query.append('sector', filters.sector);
      if (filters.industry && filters.industry !== 'All') query.append('industry', filters.industry);
      if (searchTerm.trim()) query.append('search', searchTerm.trim().toUpperCase());

      const res = await fetch(`${functionsUrl}/get-stocks?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
      const data = await res.json();
      setStocks(data);

      const allSectors = Array.from(new Set(data.map((s: Stock) => s.sector))).sort();
      const allIndustries = Array.from(new Set(data.map((s: Stock) => s.industry))).sort();
      setSectors(allSectors);
      setIndustries(allIndustries);
    } catch (err) {
      console.error('Error loading screener data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreener();
  }, []);

  const formatMarketCap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <aside className="lg:col-span-1 space-y-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="space-y-3">
          <Input placeholder="Search Ticker" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') fetchScreener();
            }}
          />
          <Input type="number" placeholder="Min Price" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <Input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          <select className="w-full px-3 py-2 rounded text-sm" value={filters.sector} onChange={(e) => setFilters({ ...filters, sector: e.target.value })}>
            <option value="All">All Sectors</option>
            {sectors.map(sector => <option key={sector} value={sector}>{sector}</option>)}
          </select>
          <select className="w-full px-3 py-2 rounded text-sm" value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })}>
            <option value="All">All Industries</option>
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
          <Input type="number" placeholder="Enter Net Profit" value={filters.netProfit} onChange={(e) => setFilters({ ...filters, netProfit: e.target.value })} />
          <Input type="number" placeholder="Enter Net Profit %" value={filters.netProfitPercent} onChange={(e) => setFilters({ ...filters, netProfitPercent: e.target.value })} />
          <Button onClick={fetchScreener} className="w-full">Apply Filters</Button>
        </div>
      </aside>

      <section className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Stock Screener</h1>
            <p className="text-sm text-muted-foreground">Live screener with dynamic filters</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline">Alerts Off</Button>
            <Button variant="outline">Export</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-4">Symbol</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Sector</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Change</th>
                <th className="py-2 px-4">Market Cap</th>
                <th className="py-2 px-4">P/E</th>
                <th className="py-2 px-4">Div Yield</th>
                <th className="py-2 px-4">Alert</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <tr key={stock.symbol} className="border-b hover:bg-muted">
                  <td className="py-2 px-4 font-medium">{stock.symbol}</td>
                  <td className="py-2 px-4">{stock.name || 'N/A'}</td>
                  <td className="py-2 px-4">{stock.sector || 'N/A'}</td>
                  <td className="py-2 px-4">${stock.price.toFixed(2)}</td>
                  <td
                    className={`py-2 px-4 text-right ${
                      stock.change_percent !== undefined
                        ? stock.change_percent > 0
                          ? 'text-green-500'
                          : stock.change_percent < 0
                          ? 'text-red-500'
                          : 'text-gray-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {(typeof stock.change === 'number' && typeof stock.change_percent === 'number') ? (
                      <>
                        {stock.change > 0 ? '+' : ''}
                        {stock.change.toFixed(2)} ({stock.change_percent.toFixed(2)}%)
                      </>
                    ) : 'N/A'}
                  </td>
                  <td className="py-2 px-4">{formatMarketCap(stock.market_cap)}</td>
                  <td className="py-2 px-4">
                    {typeof stock.pe_ratio === 'number'
                      ? stock.pe_ratio.toFixed(2)
                      : (typeof stock.trailingPE === 'number' ? stock.trailingPE.toFixed(2) : 'N/A')}
                  </td>
                  <td className="py-2 px-4">
                    {(typeof stock.dividend_yield === 'number' || typeof stock.dividendYield === 'number') ? (
                      <>
                        {(stock.dividend_yield ?? stock.dividendYield).toFixed(2)}%
                      </>
                    ) : 'N/A'}
                  </td>
                  <td className="py-2 px-4 text-center">
                    <Button variant="ghost" size="sm">
                      <Bell className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" /> AI Model Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-muted p-4 rounded-lg shadow">
              <h4 className="text-base font-medium mb-1">Breakout Forecast</h4>
              <p className="text-sm text-muted-foreground">Predicted breakout potential for selected stocks.</p>
            </div>
            <div className="bg-muted p-4 rounded-lg shadow">
              <h4 className="text-base font-medium mb-1">Risk Score</h4>
              <p className="text-sm text-muted-foreground">AI-based volatility and downside risk evaluation.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Screener;

