import React, { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import StockDetail from './StockDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock stock data
const stocksData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.68,
    change: 1.23,
    changePercent: 0.67,
    volume: "52.4M",
    marketCap: "2.89T",
    peRatio: "28.5",
    revenue: "$394.3B",
    nextReportDate: "Apr 25, 2024",
    rsi: "56.78",
    movingAverage50: "$178.45",
    news: [
      {
        title: 'Apple Announces New Product Line',
        timeAgo: '2 hours ago'
      },
      {
        title: 'Q1 Earnings Beat Expectations',
        timeAgo: '1 day ago'
      }
    ]
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 328.79,
    change: 4.23,
    changePercent: 1.30,
    volume: "35.2M",
    marketCap: "2.45T",
    peRatio: "32.1",
    revenue: "$211.9B",
    nextReportDate: "May 2, 2024",
    rsi: "62.34",
    movingAverage50: "$315.21",
    news: [
      {
        title: 'Microsoft Cloud Revenue Surges',
        timeAgo: '5 hours ago'
      },
      {
        title: 'New AI Features Announced for Office Suite',
        timeAgo: '3 days ago'
      }
    ]
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 134.99,
    change: -0.98,
    changePercent: -0.72,
    volume: "28.1M",
    marketCap: "1.70T",
    peRatio: "25.7",
    revenue: "$307.4B",
    nextReportDate: "May 10, 2024",
    rsi: "48.92",
    movingAverage50: "$138.75",
    news: [
      {
        title: 'Google Search Updates Algorithm',
        timeAgo: '1 day ago'
      },
      {
        title: 'YouTube Premium Subscribers Reach New Milestone',
        timeAgo: '4 days ago'
      }
    ]
  }
];

// Enhanced stock performance data for a more realistic chart
const performanceData = [
  { year: '2019', value: 100 },
  { year: '2020', value: 120 },
  { year: '2021', value: 180 },
  { year: '2022', value: 150 },
  { year: '2023', value: 200 },
];

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleBackClick = () => {
    setSelectedStock(null);
  };

  const filteredStocks = stocksData.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a stock is selected, show the detailed view
  if (selectedStock) {
    return (
      <div className="animate-fadeIn">
        <StockDetail stock={selectedStock} onBack={handleBackClick} />
      </div>
    );
  }

  // Main stocks list view
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
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

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
            {filteredStocks.map((stock) => (
              <tr
                key={stock.symbol}
                onClick={() => handleStockSelect(stock)}
                className="cursor-pointer hover:bg-muted/50 border-b border-border transition-colors"
              >
                <td className="px-4 py-4 font-medium">{stock.symbol}</td>
                <td className="px-4 py-4 text-muted-foreground">{stock.name}</td>
                <td className="px-4 py-4 text-right">${stock.price.toFixed(2)}</td>
                <td className={`px-4 py-4 text-right ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                  {' '}
                  ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </td>
                <td className="px-4 py-4 text-right text-muted-foreground">{stock.volume}</td>
                <td className="px-4 py-4 text-right text-muted-foreground">{stock.marketCap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stocks;
