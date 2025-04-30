
// src/components/StockList.tsx
import React from 'react';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  market_cap: number;
}

interface StockListProps {
  stocks: Stock[];
  onSelect: (stock: Stock) => void;
}

const StockList: React.FC<StockListProps> = ({ stocks, onSelect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3 text-left">Symbol</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Change</th>
            <th className="px-4 py-3 text-right">Volume</th>
            <th className="px-4 py-3 text-right">Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.symbol}
              className="hover:bg-muted/20 cursor-pointer border-b border-border"
              onClick={() => onSelect(stock)}
            >
              <td className="px-4 py-3 font-medium">{stock.ticker}</td>
              <td className="px-4 py-3">{stock.name || 'N/A'}</td>
              <td className="px-4 py-3 text-right">${Number(stock.price).toFixed(2)}</td>
              <td
                className={`px-4 py-3 text-right ${
                  stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stock.change >= 0 ? '+' : ''}
                {stock.change.toFixed(2)} ({stock.change_percent.toFixed(2)}%)
              </td>
              <td className="px-4 py-3 text-right">{formatVolume(stock.volume)}</td>
              <td className="px-4 py-3 text-right">{formatMarketCap(stock.market_cap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatMarketCap = (value: number | undefined) => {
  if (!value) return 'N/A';
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  return value.toString();
};

const formatVolume = (value: number | undefined) => {
  if (!value) return 'N/A';
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

export default StockList;
