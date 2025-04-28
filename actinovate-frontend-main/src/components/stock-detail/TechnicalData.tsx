
import React from 'react';
import { Activity } from 'lucide-react';

interface TechnicalDataProps {
  stock: any;
}

const TechnicalData: React.FC<TechnicalDataProps> = ({ stock }) => {
  if (!stock) return <p>No technical data available.</p>;

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-500" />
        Technical Indicators
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
        <OverviewItem label="RSI" value={stock.rsi || 'N/A'} />
        <OverviewItem label="SMA 50" value={stock.movingAverage50 || 'N/A'} />
        <OverviewItem label="Momentum" value={stock.momentum || 'N/A'} />
        <OverviewItem label="Volatility (30D)" value={stock.volatility || 'N/A'} />
      </div>
    </div>
  );
};

export default TechnicalData;

const OverviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="transition-transform duration-300 hover:scale-105">
    <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
    <p className="text-xl font-semibold dark:text-white">{value}</p>
  </div>
);
