
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
          <Input
            placeholder="Search Ticker"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
          <select
            className="w-full px-3 py-2 rounded text-sm"
            value={filters.sector}
            onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
          >
            <option value="All">All Sectors</option>
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
          <select
            className="w-full px-3 py-2 rounded text-sm"
            value={filters.industry}
            onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
          >
            <option value="All">All Industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <Input
            type="number"
            placeholder="Enter Net Profit"
            value={filters.netProfit}
            onChange={(e) => setFilters({ ...filters, netProfit: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Enter Net Profit %"
            value={filters.netProfitPercent}
            onChange={(e) => setFilters({ ...filters, netProfitPercent: e.target.value })}
          />
          <Button onClick={fetchScreener} className="w-full">Apply Filters</Button>
        </div>
      </aside>
      {/* Main content remains unchanged */}
      {/* ... */}
    </div>
  );
};

export default Screener;

