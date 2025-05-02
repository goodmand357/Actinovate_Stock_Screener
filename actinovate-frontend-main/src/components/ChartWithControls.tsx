import React, { useState } from 'react';
import PriceChart from './PriceChart';

const baseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const functionsUrl = `${baseUrl}/functions/v1`;

interface Props {
  symbol: string;
}

const ChartWithControls: React.FC<Props> = ({ symbol }) => {
  const [period, setPeriod] = useState("6mo");

  const periods = ["1mo", "3mo", "6mo", "1y", "2y", "5y"];

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="mb-4 flex gap-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1 rounded ${
              period === p ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <PriceChart key={`${symbol}-${period}`} symbol={symbol} period={period} />
    </div>
  );
};

export default ChartWithControls;
