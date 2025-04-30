
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import StockDetail from './StockDetail';
import StockList from './StockList';

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const functionsUrl = `${baseUrl}/functions/v1`;

  useEffect(() => {
    fetchTopStocks();
  }, []);

  const fetchTopStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${functionsUrl}/get-stocks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setStocks(data);
      } else {
        setStocks([]);
      }
    } catch (err) {
      console.error('Error fetching top stocks:', err);
      setError('Failed to fetch stocks.');
      setStocks([]);
    }
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    if (!query) return;
    const upperQuery = query.trim().toUpperCase();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${functionsUrl}/get-financial-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({ symbol: upperQuery })
      });

      const data = await res.json();

      if (data && (data.symbol || data.ticker)) {
        // Apply basic defaults if key fields are missing
        const safeData = {
          ...data,
          price: typeof data.price === 'number' ? data.price : 0,
          change: typeof data.change === 'number' ? data.change : 0,
          change_percent: typeof data.change_percent === 'number' ? data.change_percent : 0,
          symbol: data.symbol || data.ticker || upperQuery,
          name: data.name || 'Unknown Company',
        };

        setSelectedStock(safeData);
      } else {
        setStocks([]);
        setError(`No stock found for "${upperQuery}".`);
      }
    } catch (err) {
      console.error('Error searching stock:', err);
      setError('Failed to search stock.');
      setStocks([]);
    }

    setLoading(false);
  };

  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock);
  };

  const handleBack = () => {
    setSelectedStock(null);
    fetchTopStocks();
  };

  if (selectedStock) {
    return (
      <div className="animate-fadeIn">
        <StockDetail stock={selectedStock} onBack={handleBack} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Stocks</h1>
        <p className="text-muted-foreground mt-1">Track and analyze stocks</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search by symbol (e.g., TSLA)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e.currentTarget.value);
            }
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          disabled={loading}
        />
      </div>

      {/* Loading / Error / List */}
      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : stocks.length > 0 ? (
        <>
          <p className="text-muted-foreground font-semibold mb-2">Trending Tickers</p>
          <StockList stocks={stocks} onSelect={handleSelectStock} />
        </>
      ) : (
        <p className="text-muted-foreground">No stocks to show.</p>
      )}
    </div>
  );
};

export default Stocks;
