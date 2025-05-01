
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

interface Stock {
  symbol: string;
  name?: string;
  sector: string;
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
    sector: 'All'
  });

  const fetchScreener = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      query.append('limit', '10');
      query.append('page', page.toString());

      if (searchTerm) query.append('search', searchTerm);
      if (filters.peMax) query.append('pe_max', filters.peMax);
      if (filters.dividendMin) query.append('dividend_min', filters.dividendMin);
      if (filters.rsiMax) query.append('rsi_max', filters.rsiMax);
      if (filters.sector && filters.sector !== 'All') query.append('sector', filters.sector);

      const res = await fetch(`/api/screener?${query}`);
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
          <Input placeholder="Search Ticker" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Input type="number" placeholder="Max P/E" value={filters.peMax} onChange={(e) => setFilters({ ...filters, peMax: e.target.value })} />
          <Input type="number" placeholder="Min Div Yield (%)" value={filters.dividendMin} onChange={(e) => setFilters({ ...filters, dividendMin: e.target.value })} />
          <Input type="number" placeholder="Max RSI" value={filters.rsiMax} onChange={(e) => setFilters({ ...filters, rsiMax: e.target.value })} />
          <select className="w-full px-3 py-2 rounded text-sm" value={filters.sector} onChange={(e) => setFilters({ ...filters, sector: e.target.value })}>
            <option value="All">All Sectors</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Consumer Cyclical">Consumer Cyclical</option>
          </select>
          <Button onClick={() => fetchScreener(1)} className="w-full">Apply Filters</Button>
        </div>
      </aside>

      <main className="lg:col-span-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Stock Screener</h1>
            <p className="text-muted-foreground text-sm">Live screener with dynamic filters</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={toggleAlertsEnabled} variant="outline">Alerts {alertsEnabled ? 'On' : 'Off'}</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export</Button>
          </div>
        </div>

        {alertsEnabled && alertedStocks.length > 0 && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Alerts Active</AlertTitle>
            <AlertDescription>
              {alertedStocks.length} stocks tracked — {alertType}, {alertThreshold}%
            </AlertDescription>
          </Alert>
        )}

        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted text-left">
                <th className="p-2">Symbol</th>
                <th className="p-2">Name</th>
                <th className="p-2">Sector</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Change %</th>
                <th className="p-2 text-right">Market Cap</th>
                <th className="p-2 text-right">P/E</th>
                <th className="p-2 text-right">Div Yield</th>
                <th className="p-2 text-center">Alert</th>
              </tr>
            </thead>
            <tbody>
              {stocks.filter(stock => stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())).map(stock => (
                <tr key={stock.symbol} className="border-b hover:bg-muted/10">
                  <td className="p-2 font-medium">{stock.symbol}</td>
                  <td className="p-2">{stock.name || 'N/A'}</td>
                  <td className="p-2">{stock.sector}</td>
                  <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                  <td className="p-2 text-right">
                    <span className={cn('font-semibold', stock.changePercent! > 0 ? 'text-green-500' : 'text-red-500')}>
                      {stock.changePercent?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-2 text-right">{formatMarketCap(stock.market_cap)}</td>
                  <td className="p-2 text-right">{stock.pe_ratio?.toFixed(2)}</td>
                  <td className="p-2 text-right">{(stock.dividend_yield * 100).toFixed(2)}%</td>
                  <td className="p-2 text-center">
                    <Button variant="ghost" size="icon" onClick={() => toggleAlert(stock.symbol)}>
                      {alertedStocks.includes(stock.symbol)
                        ? <Bell className="h-4 w-4 text-blue-500 fill-current" />
                        : <Bell className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">🔮 AI Model Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border p-4">
              <h3 className="font-medium text-lg mb-2">Breakout Forecast</h3>
              <p className="text-muted-foreground text-sm">Predicted breakout potential for selected stocks.</p>
            </div>
            <div className="rounded-md border p-4">
              <h3 className="font-medium text-lg mb-2">Risk Score</h3>
              <p className="text-muted-foreground text-sm">AI-based volatility and downside risk evaluation.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Screener;
