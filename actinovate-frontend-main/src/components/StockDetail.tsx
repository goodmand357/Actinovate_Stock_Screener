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
    change_percent: number;
    [key: string]: any; // allow flexible extra fields
  };
  onBack: () => void;
}

const StockDetail: React.FC<StockDetailProps> = ({ stock, onBack }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Back button + stock basic info */}
      <StockHeader stock={stock} onBack={onBack} />

      {/* Tabs */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="mb-6 flex gap-2 bg-muted/50 p-2 rounded-md">
          <TabsTrigger value="chart" className="px-4 py-2 rounded-md">Chart</TabsTrigger>
          <TabsTrigger value="financial" className="px-4 py-2 rounded-md">Financial</TabsTrigger>
          <TabsTrigger value="technical" className="px-4 py-2 rounded-md">Technical</TabsTrigger>
          <TabsTrigger value="news" className="px-4 py-2 rounded-md">News</TabsTrigger>
        </TabsList>

        {/* Tab contents */}
        <TabsContent value="chart">
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
