
import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StockChartProps {
  stock: {
    symbol: string;
    balance_sheet?: Record<string, any>;
  };
}

const metricOptions = {
  'Stockholders Equity': 'Stockholders Equity',
  'Total Assets': 'Total Assets',
  'Cash And Cash Equivalents': 'Cash And Cash Equivalents',
  'Total Debt': 'Total Debt',
  'Working Capital': 'Working Capital',
  'Net PPE': 'Net PPE',
};

const StockChart: React.FC<StockChartProps> = ({ stock }) => {
  const [selectedMetric, setSelectedMetric] = useState<keyof typeof metricOptions>('Stockholders Equity');

  const formatMetric = (value: number | null | undefined) =>
    typeof value === 'number' ? parseFloat((value / 1_000_000_000).toFixed(2)) : null;

  const data = stock?.balance_sheet
    ? Object.entries(stock.balance_sheet).map(([dateStr, values]: [string, any]) => {
        const year = new Date(dateStr).getFullYear();
        return {
          year,
          price: formatMetric(values?.[selectedMetric]) ?? 0,
          volume: formatMetric(values?.['Cash And Cash Equivalents']) ?? 0, // Always use cash as "volume"
        };
      }).filter((entry) => typeof entry.price === 'number' && typeof entry.volume === 'number')
    : [];

  if (data.length === 0) {
    return <p className="text-gray-600 dark:text-gray-300">No chart data available.</p>;
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-white">Stock Performance</h3>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as keyof typeof metricOptions)}
          className="border dark:border-slate-600 rounded px-2 py-1 bg-white dark:bg-slate-700 text-sm dark:text-white"
        >
          {Object.entries(metricOptions).map(([label, value]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              yAxisId="left"
              label={{
                value: `${selectedMetric} (B USD)`,
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Cash (B USD)',
                angle: 90,
                position: 'insideRight',
              }}
            />
            <Tooltip
              formatter={(value: any) => `${value} B`}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
            <Bar yAxisId="right" dataKey="volume" fill="#82ca9d" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
