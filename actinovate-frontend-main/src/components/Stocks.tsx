import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) return;

    setLoading(true);
    fetch(`/api/financial-data?symbol=${searchQuery.toUpperCase()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.ticker) {
          setStocks([data]); // wrap in array for table display
        } else {
          setStocks([]); // clear if not found
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stock:', err);
        setStocks([]);
        setLoading(false);
      });
  }, [searchQuery]);

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
              setSearchQuery(e.currentTarget.value.trim().toUpperCase());
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
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">P/E</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map(stock => (
                <tr key={stock.ticker} className="border-b border-border">
                  <td className="px-4 py-4 font-medium">{stock.ticker}</td>
                  <td className="px-4 py-4 text-muted-foreground">{stock.name || stock.industry}</td>
                  <td className="px-4 py-4 text-right">${Number(stock.price || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right">{Number(stock.pe_ratio || 0).toFixed(2)}</td>
                  <td className="px-4 py-4 text-right">{formatMarketCap(stock.market_cap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : searchQuery ? (
        <p className="text-muted-foreground">No data found for "{searchQuery}"</p>
      ) : null}
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
