import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: string;
  market_cap: string;
}

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchInitialStocks = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/get-stocks`);
        const data = await response.json();
        setStocks(data.slice(0, 5)); // Top 5 only
      } catch (err) {
        setError('Failed to fetch stocks.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStocks();
  }, [baseUrl]);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = (e.target as HTMLInputElement).value.trim().toUpperCase();
      if (!query) return;

      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/api/financial-data?symbol=${query}`);
        const data = await response.json();
        if (data && data.ticker) {
          setStocks([data]); // Display the searched stock
        } else {
          setStocks([]);
          setError('No stock found.');
        }
      } catch (err) {
        setError('Failed to search stock.');
      } finally {
        setLoading(false);
      }
    }
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
          onKeyDown={handleSearch}
        />
      </div>

      {/* Loading and Error Messages */}
      {loading ? (
        <p className="text-muted-foreground">Loading stocks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : stocks.length > 0 ? (
        <div className="table-container overflow-x-auto">
          <table className="w-full rounded-lg overflow-hidden">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Symbol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Change</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Volume</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol} className="border-b border-border">
                  <td className="px-4 py-4 font-medium">{stock.symbol}</td>
                  <td className="px-4 py-4 text-muted-foreground">{stock.name || 'N/A'}</td>
                  <td className="px-4 py-4 text-right">${stock.price?.toFixed(2)}</td>
                  <td
                    className={`px-4 py-4 text-right ${
                      stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stock.change?.toFixed(2)} ({stock.change_percent?.toFixed(2)}%)
                  </td>
                  <td className="px-4 py-4 text-right">{stock.volume || 'N/A'}</td>
                  <td className="px-4 py-4 text-right">{stock.market_cap || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground">No stocks found.</p>
      )}
    </div>
  );
};

export default StockList;
