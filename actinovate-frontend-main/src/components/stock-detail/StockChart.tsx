
import React from 'react';
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

interface PerformanceEntry {
  year: string | number;
  price: number;
  volume: number;
}

interface StockChartProps {
  stock: {
    performanceData?: PerformanceEntry[];
    [key: string]: any;
  };
}

const StockChart: React.FC<StockChartProps> = ({ stock }) => {
  const data: PerformanceEntry[] = Array.isArray(stock?.performanceData)
    ? stock.performanceData.filter(
        (d) =>
          typeof d.price === 'number' &&
          typeof d.volume === 'number' &&
          (typeof d.year === 'string' || typeof d.year === 'number')
      )
    : [];

  if (data.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-300">
        No chart data available.
      </p>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-6 dark:text-white">Stock Performance</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              yAxisId="left"
              label={{
                value: 'Price',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Volume',
                angle: 90,
                position: 'insideRight',
              }}
            />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
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
