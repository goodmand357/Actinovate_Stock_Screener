import React, { useEffect, useState } from 'react';
import {
  Download, ChevronDown, ChevronUp, Search, SlidersHorizontal, X,
  Bell, AlertTriangle, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Alert, AlertTitle, AlertDescription
} from '@/components/ui/alert';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

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

  const fetchScreener = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'].forEach(s => query.append('symbols', s));

    if (filters.peMax) query.append('pe_max', filters.peMax);
    if (filters.dividendMin) query.append('dividend_min', filters.dividendMin);
    if (filters.rsiMax) query.append('rsi_max', filters.rsiMax);
    if (filters.sector && filters.sector !== 'All') query.append('sector', filters.sector);

    const res = await fetch(`https://actinovatestockscreener-production.up.railway.app/api/screener?${query}`);
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
    <div className="screener-page">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Stock Screener</h1>
          <p className="text-muted-foreground">Powered by live backend data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleAlertsEnabled}>
            Alerts {alertsEnabled ? 'On' : 'Off'}
          </Button>
          <Button variant="outline" onClick={() => toast.success('Export coming soon')}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading stocks...</p>
      ) : (
        <>
          {alertsEnabled && alertedStocks.length > 0 && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Alert Configuration</AlertTitle>
              <AlertDescription>
                You have alerts set for {alertedStocks.length} stocks ({alertType}, {alertFrequency}, {alertThreshold}%)
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-1">Max P/E Ratio</label>
    <Input
      type="number"
      value={filters.peMax}
      onChange={(e) => setFilters({ ...filters, peMax: e.target.value })}
      placeholder="e.g. 25"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-1">Min Dividend Yield (%)</label>
    <Input
      type="number"
      value={filters.dividendMin}
      onChange={(e) => setFilters({ ...filters, dividendMin: e.target.value })}
      placeholder="e.g. 1.5"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-1">Max RSI</label>
    <Input
      type="number"
      value={filters.rsiMax}
      onChange={(e) => setFilters({ ...filters, rsiMax: e.target.value })}
      placeholder="e.g. 70"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-muted-foreground mb-1">Sector</label>
    <select
      className="w-full border rounded px-3 py-2 text-sm"
      value={filters.sector}
      onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
    >
      <option value="All">All</option>
      <option value="Technology">Technology</option>
      <option value="Healthcare">Healthcare</option>
      <option value="Financial Services">Financial Services</option>
      <option value="Consumer Cyclical">Consumer Cyclical</option>
      <option value="Energy">Energy</option>
    </select>
  </div>
</div>
          
          <div className="table-container overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th onClick={() => handleSort('symbol')} className="p-2 cursor-pointer text-left">
                    Symbol {getSortIcon('symbol')}
                  </th>
                  <th onClick={() => handleSort('sector')} className="p-2 cursor-pointer text-left">
                    Sector {getSortIcon('sector')}
                  </th>
                  <th onClick={() => handleSort('price')} className="p-2 cursor-pointer text-right">
                    Price {getSortIcon('price')}
                  </th>
                  <th onClick={() => handleSort('pe_ratio')} className="p-2 cursor-pointer text-right">
                    P/E {getSortIcon('pe_ratio')}
                  </th>
                  <th onClick={() => handleSort('dividend_yield')} className="p-2 cursor-pointer text-right">
                    Dividend Yield {getSortIcon('dividend_yield')}
                  </th>
                  <th onClick={() => handleSort('rsi')} className="p-2 cursor-pointer text-right">
                    RSI {getSortIcon('rsi')}
                  </th>
                  <th onClick={() => handleSort('score')} className="p-2 cursor-pointer text-right">
                    Score {getSortIcon('score')}
                  </th>
                  <th className="p-2 text-center">Alert</th>
                </tr>
              </thead>
              <tbody>
                {stocks
                  .filter(stock =>
                    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(stock => (
                    <tr key={stock.symbol} className="border-b hover:bg-secondary/20">
                      <td className="p-2">{stock.symbol}</td>
                      <td className="p-2">{stock.sector}</td>
                      <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                      <td className="p-2 text-right">{stock.pe_ratio?.toFixed(2)}</td>
                      <td className="p-2 text-right">{(stock.dividend_yield * 100).toFixed(2)}%</td>
                      <td className="p-2 text-right">{stock.rsi?.toFixed(2)}</td>
                      <td className="p-2 text-right font-bold text-blue-600">{stock.score?.toFixed(4)}</td>
                      <td className="p-2 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAlert(stock.symbol)}
                        >
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
        </>
      )}
    </div>
  );
};

export default Screener;
