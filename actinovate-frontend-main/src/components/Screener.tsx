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
  changePercent?: number;
  market_cap: number;
  pe_ratio: number;
  dividend_yield: number;
  rsi: number;
  score: number;
}

const Screener = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [alertedStocks, setAlertedStocks] = useState<string[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertType, setAlertType] = useState<'price' | 'volume' | 'movement'>('price');
  const [alertThreshold, setAlertThreshold] = useState('5');
  const [alertFrequency, setAlertFrequency] = useState<'realtime' | 'daily' | 'weekly'>('realtime');

  const [filters, setFilters] = useState({
    peMax: '40',
    dividendMin: '0',
    rsiMax: '80',
    sector: 'All',
    industry: 'All'
  });

  const fetchScreener = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append("limit", "10");
      query.append("page", "1");
      if (filters.peMax) query.append('pe_max', filters.peMax);
      if (filters.dividendMin) query.append('dividend_min', filters.dividendMin);
      if (filters.rsiMax) query.append('rsi_max', filters.rsiMax);
      if (filters.sector && filters.sector !== 'All') query.append('sector', filters.sector);
      if (filters.industry && filters.industry !== 'All') query.append('industry', filters.industry);

      const res = await fetch(`${functionsUrl}/get-stocks?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      console.error('Error loading screener data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreener();
  }, []);

  const handleSort = (key: keyof Stock) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...stocks].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === 'asc' ? -1 : 1;
      if (a[key]! > b[key]!) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setStocks(sorted);
  };

  const getSortIcon = (key: keyof Stock) => {
    if (sortConfig.key !== key) return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const toggleAlert = (symbol: string) => {
    if (alertedStocks.includes(symbol)) {
      setAlertedStocks(alertedStocks.filter(s => s !== symbol));
      toast.success(`Alert removed for ${symbol}`);
    } else {
      setAlertedStocks([...alertedStocks, symbol]);
      toast.success(`Alert set for ${symbol}`);
    }
  };

  const toggleAlertsEnabled = () => {
    setAlertsEnabled(!alertsEnabled);
    toast.success(alertsEnabled ? 'Alerts disabled' : 'Alerts enabled');
  };

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
          <Input
            placeholder="Search Ticker"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max P/E"
            value={filters.peMax}
            onChange={(e) => setFilters({ ...filters, peMax: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Min Div Yield (%)"
            value={filters.dividendMin}
            onChange={(e) => setFilters({ ...filters, dividendMin: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max RSI"
            value={filters.rsiMax}
            onChange={(e) => setFilters({ ...filters, rsiMax: e.target.value })}
          />
          <select
            className="w-full px-3 py-2 rounded text-sm"
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
          >
            <option value="All">All Sectors</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Consumer Cyclical">Consumer Cyclical</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Energy">Energy</option>
          </select>
          <select
            className="w-full px-3 py-2 rounded text-sm"
            value={filters.industry}
            onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
          >
            <option value="All">All Industries</option>
            <option value="Software">Software</option>
            <option value="Semiconductors">Semiconductors</option>
            <option value="Biotechnology">Biotechnology</option>
            <option value="Retail">Retail</option>
            <option value="Oil & Gas">Oil & Gas</option>
          </select>
          <Button onClick={fetchScreener} className="w-full">Apply Filters</Button>
        </div>
      </aside>
      {/* Main content remains unchanged */}
      {/* ... */}
    </div>
  );
};

export default Screener;

