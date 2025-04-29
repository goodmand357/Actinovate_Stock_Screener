
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import StockDetail from './StockDetail'; // ✅ correct import
import StockList from './StockList'; // ✅ correct import

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL; 
  const functionsUrl = `${baseUrl}/functions/v1`;

  // Fetch Top 5 stocks on page load
  useEffect(() => {
    fetchTopStocks();
  }, []);

const fetchTopStocks = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${functionsUrl}/get-stocks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` // 🛠 ADD THIS
      }
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      setStocks(data.slice(0, 5));
    } else {
      setStocks([]);
    }
  } catch (error) {
    console.error('Error fetching top stocks:', error);
    setStocks([]);
  }
  setLoading(false);
};

const handleSearch = async (query: string) => {
  if (!query) return;
  setLoading(true);
  try {
    const res = await fetch(`${functionsUrl}/get-financial-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` // 🛠 ADD THIS
      },
      body: JSON.stringify({ symbol: query })
    });
    const data = await res.json();
    if (data && data.ticker) {
      setStocks([data]);
    } else {
      setStocks([]);
    }
  } catch (error) {
    console.error('Error searching stock:', error);
    setStocks([]);
  }
  setLoading(false);
};

  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock);
  };

  const handleBack = () => {
    setSelectedStock(null);
    fetchTopStocks(); // refresh top stocks when you go back
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

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder="Search by symbol (e.g., TSLA)"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e.currentTarget.value.trim().toUpperCase());
            }
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : stocks.length > 0 ? (
        <StockList stocks={stocks} onSelect={handleSelectStock} />
      ) : (
        <p className="text-muted-foreground">No stocks to show.</p>
      )}
    </div>
  );
};

export default Stocks;
