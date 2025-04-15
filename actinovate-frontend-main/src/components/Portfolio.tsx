
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

// Mock portfolio data
const portfolioStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 25,
    avgPrice: 145.75,
    currentPrice: 185.92,
    totalValue: 4648.00,
    profitLoss: 1004.25,
    profitLossPercent: 27.56
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 15,
    avgPrice: 235.45,
    currentPrice: 328.79,
    totalValue: 4931.85,
    profitLoss: 1400.10,
    profitLossPercent: 39.64
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 10,
    avgPrice: 1290.35,
    currentPrice: 1450.16,
    totalValue: 14501.60,
    profitLoss: 1598.10,
    profitLossPercent: 12.38
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    shares: 8,
    avgPrice: 2860.75,
    currentPrice: 3120.50,
    totalValue: 24964.00,
    profitLoss: 2078.00,
    profitLossPercent: 9.08
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    shares: 20,
    avgPrice: 235.65,
    currentPrice: 273.58,
    totalValue: 5471.60,
    profitLoss: 758.60,
    profitLossPercent: 16.09
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    shares: 12,
    avgPrice: 210.25,
    currentPrice: 435.10,
    totalValue: 5221.20,
    profitLoss: 2698.20,
    profitLossPercent: 106.94
  },
  {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    shares: 18,
    avgPrice: 195.72,
    currentPrice: 297.80,
    totalValue: 5360.40,
    profitLoss: 1837.44,
    profitLossPercent: 52.16
  }
];

const portfolioSummary = {
  totalValue: 35133.28,
  totalProfitLoss: 7451.44,
  dayChange: 523.80
};

const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const handleAddPosition = () => {
    toast.info('Add position feature coming soon!');
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground mt-1">Track your investments</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddPosition}>
          <Plus className="h-4 w-4" />
          Add Position
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Total Value</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalValue)}</div>
          )}
        </div>
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Total Profit/Loss</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className={`text-2xl font-bold ${portfolioSummary.totalProfitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {portfolioSummary.totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.totalProfitLoss)}
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Day Change</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className={`text-2xl font-bold ${portfolioSummary.dayChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {portfolioSummary.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.dayChange)}
            </div>
          )}
        </div>
      </div>
      
      <div className="table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Avg Price</th>
              <th className="text-right">Current Price</th>
              <th className="text-right">Total Value</th>
              <th className="text-right">Profit/Loss</th>
              <th className="text-right">P/L %</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton loading state
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <td key={cellIndex}>
                      <div className="h-5 w-full shimmer-effect rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              portfolioStocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td className="font-medium">{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td className="text-right">{stock.shares}</td>
                  <td className="text-right">{formatCurrency(stock.avgPrice)}</td>
                  <td className="text-right">{formatCurrency(stock.currentPrice)}</td>
                  <td className="text-right">{formatCurrency(stock.totalValue)}</td>
                  <td className={`text-right ${stock.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stock.profitLoss >= 0 ? '+' : ''}{formatCurrency(stock.profitLoss)}
                  </td>
                  <td className={`text-right ${stock.profitLossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatPercent(stock.profitLossPercent)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
