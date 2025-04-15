
import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Technical indicators with expanded data
const technicalData = {
  rsi: "56.78",
  movingAverage50: "$178.45",
  macdSignal: "2.34",
  volatility: "1.8%",
  sma10: "$182.34",
  sma20: "$180.56",
  sma50: "$178.45",
  sma200: "$164.21",
  beta1y: "1.18",
  beta5y: "1.24",
  relativeVolume: "1.2",
  priceToSales: "7.8",
  priceToBook: "16.4",
  priceToCash: "20.3",
  momentum: "0.84%"
};

// Helper function to determine if an indicator is bullish/bearish/neutral
const getIndicatorStatus = (indicator: string, type: 'rsi' | 'macd'): 'bullish' | 'bearish' | 'neutral' => {
  const value = parseFloat(indicator.replace('$', ''));
  
  if (type === 'rsi') {
    if (value > 70) return 'bearish';
    if (value < 30) return 'bullish';
    return 'neutral';
  } else { // macd
    if (value > 0) return 'bullish';
    if (value < 0) return 'bearish';
    return 'neutral';
  }
};

const TechnicalData: React.FC = () => {
  const rsiStatus = getIndicatorStatus(technicalData.rsi, 'rsi');
  const macdStatus = getIndicatorStatus(technicalData.macdSignal, 'macd');
  
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-500" />
        Technical Indicators
      </h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-white">Moving Averages</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">SMA (10)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.sma10}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Short-term trend</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">SMA (20)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.sma20}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Short-medium trend</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">SMA (50)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.sma50}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Medium-term trend</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">SMA (200)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.sma200}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Long-term trend</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-white">Momentum & Risk</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">RSI (14)</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold dark:text-white">{technicalData.rsi}</p>
              {rsiStatus === 'bullish' && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
              {rsiStatus === 'bearish' && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {rsiStatus === 'bullish' ? 'Oversold - Potential buy signal' : 
                rsiStatus === 'bearish' ? 'Overbought - Potential sell signal' : 
                'Neutral momentum'}
            </p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">MACD Signal</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold dark:text-white">{technicalData.macdSignal}</p>
              {macdStatus === 'bullish' && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
              {macdStatus === 'bearish' && (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {macdStatus === 'bullish' ? 'Bullish crossover' : 
                macdStatus === 'bearish' ? 'Bearish crossover' : 
                'Neutral trend'}
            </p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Momentum</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.momentum}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Recent price change</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Volatility (30D)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.volatility}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Historical price fluctuation</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-white">Risk Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Beta (1 Year)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.beta1y}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Market correlation</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Beta (5 Year)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.beta5y}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Long-term market correlation</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Relative Volume</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.relativeVolume}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Compared to average</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-3 dark:text-white">Valuation Ratios</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Price to Sales (P/S)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.priceToSales}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Revenue valuation</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Price to Book (P/B)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.priceToBook}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Asset valuation</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Price to Cash (P/CF)</p>
            <p className="text-xl font-semibold dark:text-white">{technicalData.priceToCash}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Cash flow valuation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalData;
