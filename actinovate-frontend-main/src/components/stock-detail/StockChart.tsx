
import React from 'react';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

// Enhanced stock performance data for a more realistic chart with volume data
const performanceData = [
  { year: '2019', value: 100, volume: 1500 },
  { year: '2020', value: 120, volume: 2200 },
  { year: '2021', value: 180, volume: 3100 },
  { year: '2022', value: 150, volume: 2600 },
  { year: '2023', value: 200, volume: 3800 },
];

const StockChart: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-6 dark:text-white">Stock Performance</h3>
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={performanceData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              ticks={['2019', '2020', '2021', '2022', '2023']}
              stroke="#888888"
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false}
              domain={[0, 'dataMax + 20']}
              ticks={[0, 50, 100, 150, 200]}
              stroke="#2563eb"
              label={{ value: 'Price', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 500']}
              stroke="#4f46e5"
              label={{ value: 'Volume', angle: 90, position: 'insideRight', style: { textAnchor: 'middle' } }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'value') return [`$${value}`, 'Price'];
                if (name === 'volume') return [value, 'Volume'];
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="value"
              name="Price"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 6, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2 }}
              animationDuration={1500}
            />
            <Bar
              yAxisId="right"
              dataKey="volume"
              name="Volume"
              fill="#4f46e5"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              fillOpacity={0.8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
