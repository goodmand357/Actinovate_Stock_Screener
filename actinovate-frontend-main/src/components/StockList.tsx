
// src/components/Stocks.tsx
import React, { useEffect, useState } from 'react';
import StockList from './StockList'; // ✅ your StockList component
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
}

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL; 
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const fetchTopStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/functions/v1/get-stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });
      const data = await res.json();
      setStocks(data.slice(0, 5)); // Top 5 stocks
    } catch (error) {
      console.error(error);
      setError('Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  const searchStock = async (symbol: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/functions/v1/get-financial-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ symbol }),
      });
      const data = await res.json();
      if (data && data.ticker) {
        setStocks([{
          symbol: data.ticker,
          name: data.name,
          price: data.price,
          change: data.change,
          change_percent: data.change_percent,
          volume: data.volume,
          market_cap: data.market_cap,
        }]);
      } else {
        setStocks([]);
        setError('No stock found');
      }
    } catch (error) {
      console.error(error);
      setError('Error searching stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopStocks();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const symbol = (e.target as HTMLInputElement).value.trim().toUpperCase();
      if (symbol) {
        searchStock(symbol);
      }
    }
  };

  const handleSelectStock = (stock: Stock) => {
    console.log('Selected stock:', stock);
    // Later we will navigate to detailed view!
  };

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
          onKeyDown={handleKeyDown}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stock Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <StockList stocks={stocks} onSelect={handleSelectStock} />
      )}
    </div>
  );
};

export default Stocks;
