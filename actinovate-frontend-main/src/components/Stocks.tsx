
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import StockDetail from './StockDetail'; // adjust if your path is different

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState<any>(null);

  const baseUrl = import.meta.env.VITE_SUPABASE_URL; // your Supabase project URL

  // Load top 5 stocks when page loads
  useEffect(() => {
    fetch(`${baseUrl}/functions/v1/get-stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStocks(data);
        } else {
          setStocks([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching top stocks:', error);
        setStocks([]);
        setLoading(false);
      });
  }, []);

  // Handle search (fetch single stock)
  const handleSearch = async (query: string) => {
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/functions/v1/get-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: query }),
      });
      const data = await res.json();
      if (data && data.symbol) {
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
              const query = e.currentTarget.value.trim().toUpperCase();
              setSearchQuery(query);
              handleSearch(query);
            }
          }}
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : stocks.length > 0 ? (
        <div className="table-container overflow-x-auto">
          <table className="stock-table w-full rounded-lg overflow-hidden">
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
                <tr
                  key={stock.symbol}
                  onClick={() => handleSelectStock(stock)}
                  className="cursor-pointer hover:bg-muted/50 border-b border-border transition-colors"
                >
                  <td className="px-4 py-4 font-medium">{stock.symbol}</td>
                  <td className="px-4 py-4 text-muted-foreground">{stock.name || 'N/A'}</td>
                  <td className="px-4 py-4 text-right">${Number(stock.price || 0).toFixed(2)}</td>
                  <td
                    className={`px-4 py-4 text-right ${
                      stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stock.change >= 0 ? '+' : ''}
                    {Number(stock.change).toFixed(2)} ({Number(stock.change_percent).toFixed(2)}%)
                  </td>
                  <td className="px-4 py-4 text-right">{stock.volume}</td>
                  <td className="px-4 py-4 text-right">{stock.market_cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : searchQuery ? (
        <p className="text-muted-foreground">No results for "{searchQuery}".</p>
      ) : (
        <p className="text-muted-foreground">No stocks to show.</p>
      )}
    </div>
  );
};

export default Stocks;

