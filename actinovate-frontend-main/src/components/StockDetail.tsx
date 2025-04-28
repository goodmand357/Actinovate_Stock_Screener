import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockHeader from './stock-detail/StockHeader';
import StockChart from './stock-detail/StockChart';
import FinancialData from './stock-detail/FinancialData';
import TechnicalData from './stock-detail/TechnicalData';
import NewsData from './stock-detail/NewsData';

interface StockDetailProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume?: string;
    marketCap?: string;
    peRatio?: number;
    revenue?: string;
    sector?: string;
    industry?: string;
    performanceData?: any[];
    news?: { title: string; timeAgo: string }[];
    // You can add more fields depending on what you pass down!
  };
  onBack: () => void;
}

const StockDetail: React.FC<StockDetailProps> = ({ stock, onBack }) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <StockHeader stock={stock} onBack={onBack} />

      <Tabs defaultValue="chart">
        <TabsList className="mb-6 p-1 bg-gray-50 dark:bg-slate-900 inline-flex rounded-md border border-gray-100 dark:border-slate-700">
          <TabsTrigger value="chart" className="rounded-md">Chart</TabsTrigger>
          <TabsTrigger value="financial" className="rounded-md">Financial</TabsTrigger>
          <TabsTrigger value="technical" className="rounded-md">Technical</TabsTrigger>
          <TabsTrigger value="news" className="rounded-md">News</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="block">
          <StockChart stock={stock} />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialData stock={stock} />
        </TabsContent>

        <TabsContent value="technical">
          <TechnicalData stock={stock} />
        </TabsContent>

        <TabsContent value="news">
          <NewsData stock={stock} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockDetail;
