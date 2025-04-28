
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import StockDetail from './StockDetail'; // You have this file already

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch top 5 stocks on page load
  useEffect(() => {
    fetchTopStocks();
  }, []);

  const fetchTopStocks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/top-stocks`); // <-- you need to create this API
      const data = await res.json();
      setStocks(data);
    } catch (error) {
      console.error('Error fetching top stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search specific stock
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = e.currentTarget.value.trim().toUpperCase();
      if (!query) return;
      
      setLoading(true);
      try {
        const res = await fetch(`${baseUrl}/api/financial-data?symbol=${query}`);
        const data = await res.json();
        if (data && data.ticker) {
          setStocks([data]);
        } else {
          setStocks([]);
        }
      } catch (error) {
        console.error('Error fetching stock:', error);
        setStocks([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStockClick = (stock: any) => {
    setSelectedStock(stock);
  };

  // When stock is selected, show StockDetail tabs
  if (selectedStock) {
    return <StockDetail stock={selectedStock} onBack={() => setSelectedStock(null)} />;
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
          onKeyDown={handleSearch}
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="table-container overflow-x-auto">
          <table className="stock-table w-full rounded-lg overflow-hidden">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Symbol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr
                  key={stock.ticker}
                  onClick={() => handleStockClick(stock)}
                  className="cursor-pointer hover:bg-muted/50 border-b border-border transition-colors"
                >
                  <td className="px-4 py-4 font-medium">{stock.ticker}</td>
                  <td className="px-4 py-4 text-muted-foreground">{stock.name}</td>
                  <td className="px-4 py-4 text-right">${Number(stock.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right">{formatMarketCap(stock.market_cap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stocks;

const formatMarketCap = (value: number | undefined) => {
  if (!value) return 'N/A';
  if (value > 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value > 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value > 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toString();
};

