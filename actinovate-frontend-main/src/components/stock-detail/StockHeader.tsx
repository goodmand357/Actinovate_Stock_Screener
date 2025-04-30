
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StockHeaderProps {
  stock: {
    symbol: string;
    name?: string;
    price?: number;
    change?: number;
    changePercent?: number;
  };
  onBack: () => void;
}

const StockHeader: React.FC<StockHeaderProps> = ({ stock, onBack }) => {
  const {
    symbol,
    name = 'Unknown Company',
    price = 0,
    change = 0,
    changePercent = 0
  } = stock;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="flex items-center mb-6">
      <button 
        onClick={onBack}
        className="mr-4 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mr-4">
        <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-300 font-semibold">
          {symbol.substring(0, 1)}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold dark:text-white">{symbol}</h1>
        <p className="text-gray-600 dark:text-gray-300">{name}</p>
      </div>

      <div className="ml-auto text-right">
        <div className="text-3xl font-bold dark:text-white">{formatCurrency(price)}</div>
        <div
          className={`${
            changePercent >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
          } text-sm font-medium`}
        >
          {change >= 0 ? '+' : ''}
          {change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}
          {changePercent.toFixed(2)}%)
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
