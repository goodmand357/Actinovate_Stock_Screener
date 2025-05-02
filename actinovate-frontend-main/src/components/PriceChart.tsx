import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const baseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const functionsUrl = `${baseUrl}/functions/v1`;

interface Props {
  symbol: string;
  period?: string;
}

const PriceChart: React.FC<Props> = ({ symbol, period = "6mo" }) => {
  const [data, setData] = useState<{ date: string; close: number }[]>([]);

useEffect(() => {
  fetch(`/api/history/${symbol}?period=${period}`)
    .then((res) => res.json())
    .then(setData)
    .catch(console.error);
}, [symbol, period]);

if (!data.length) return <div className="p-4">Loading chart...</div>;

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: `${symbol} Price`,
        data: data.map(d => d.close),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }
    ]
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-semibold mb-2">{symbol} Price Chart</h3>
      <Line data={chartData} />
    </div>
  );
};

export default PriceChart;
