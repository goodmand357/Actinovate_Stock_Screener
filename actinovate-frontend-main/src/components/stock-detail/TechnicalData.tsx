
import React from 'react';
import {
  Activity,
  TrendingUp,
  Thermometer,
  BarChart2,
  LineChart,
  Zap,
  PieChart
} from 'lucide-react';

interface TechnicalDataProps {
  stock: {
    technicals?: {
      sma_10?: number;
      sma_20?: number;
      sma_50?: number;
      sma_200?: number;
      rsi?: number;
      macd_signal?: number;
      momentum?: number;
      volatility_30d?: number;
    };
    beta?: number;
    beta_5y?: number;
    relative_volume?: number;
    price_to_sales?: number;
    price_to_book?: number;
    price_to_cash_flow?: number;
  };
}

const TechnicalData: React.FC<TechnicalDataProps> = ({ stock }) => {
  const { technicals = {} } = stock;

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

      <Section title="Moving Averages" icon={<TrendingUp className="text-yellow-400 h-4 w-4" />}>
        <OverviewItem label="SMA (10)" value={formatValue(technicals.sma_10)} />
        <OverviewItem label="SMA (20)" value={formatValue(technicals.sma_20)} />
        <OverviewItem label="SMA (50)" value={formatValue(technicals.sma_50)} />
        <OverviewItem label="SMA (200)" value={formatValue(technicals.sma_200)} />
      </Section>

      <Section title="Momentum & Risk" icon={<Thermometer className="text-pink-400 h-4 w-4" />}>
        <OverviewItem label="RSI (14)" value={formatValue(technicals.rsi)} />
        <OverviewItem label="MACD Signal" value={formatValue(technicals.macd_signal)} />
        <OverviewItem label="Momentum" value={formatValue(technicals.momentum)} />
        <OverviewItem label="Volatility (30D)" value={`${formatValue(technicals.volatility_30d)}%`} />
      </Section>

      <Section title="Risk Metrics" icon={<Zap className="text-red-500 h-4 w-4" />}>
        <OverviewItem label="Beta (1 Year)" value={formatValue(stock.beta)} />
        <OverviewItem label="Beta (5 Year)" value={formatValue(stock.beta_5y)} />
        <OverviewItem label="Relative Volume" value={formatValue(stock.relative_volume)} />
      </Section>

      <Section title="Valuation Ratios" icon={<PieChart className="text-purple-400 h-4 w-4" />}>
        <OverviewItem label="Price to Sales (P/S)" value={formatValue(stock.price_to_sales)} />
        <OverviewItem label="Price to Book (P/B)" value={formatValue(stock.price_to_book)} />
        <OverviewItem label="Price to Cash (P/CF)" value={formatValue(stock.price_to_cash_flow)} />
      </Section>
    </div>
  );
};

export default TechnicalData;

const Section = ({
  title,
  icon,
  children
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h4 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
      {icon} {title}
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
      {children}
    </div>
  </div>
);

const OverviewItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="transition-transform duration-300 hover:scale-105">
    <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
    <p className="text-xl font-semibold dark:text-white">{value}</p>
  </div>
);

