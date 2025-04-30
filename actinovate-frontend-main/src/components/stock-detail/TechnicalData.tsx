
import React from 'react';
import { Activity } from 'lucide-react';

interface TechnicalDataProps {
  stock: {
    technicals?: {
      rsi?: number | string;
      sma_50?: number | string;
      momentum?: number | string;
      volatility?: number | string;
    };
  };
}

const TechnicalData: React.FC<TechnicalDataProps> = ({ stock }) => {
  const { technicals } = stock || {};
  if (!technicals) return <p>No technical data available.</p>;

  const formatValue = (val: any) => {
    if (val === null || val === undefined || isNaN(Number(val))) return 'N/A';
    return typeof val === 'number' ? val.toFixed(2) : val;
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-500" />
        Technical Indicators
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
        <OverviewItem label="RSI" value={formatValue(technicals.rsi)} />
        <OverviewItem label="SMA 50" value={formatValue(technicals.sma_50)} />
        <OverviewItem label="Momentum" value={formatValue(technicals.momentum)} />
        <OverviewItem label="Volatility (30D)" value={formatValue(technicals.volatility)} />
      </div>
    </div>
  );
};

export default TechnicalData;

const OverviewItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="transition-transform duration-300 hover:scale-105">
    <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
    <p className="text-xl font-semibold dark:text-white">{value}</p>
  </div>
);
