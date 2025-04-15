
import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Layers } from 'lucide-react';

// Financial metrics with expanded data
const financialData = {
  // Company Info
  tickerName: "AAPL",
  price: "$182.68",
  marketCap: "$2.89T",
  sector: "Technology",
  industry: "Consumer Electronics",
  foundedYear: "1976",
  
  // Core Financials
  revenue: "$394.3B",
  netProfit: "$96.9B",
  netProfitMargin: "24.6%",
  peRatio: "28.5",
  priceToSales: "7.8",
  dividendYield: "0.48%",
  
  // Growth
  revenueGrowthY1: "8.4%",
  revenueGrowthY2: "6.9%",
  revenueGrowthY3: "5.5%",
  
  // Historical Revenue
  revenue2023: "$383.3B",
  revenue2024: "$394.3B",
  revenue2025: "$412.6B (est.)",
  
  // EPS
  basicEPS: "$6.13",
  dilutedEPS: "$6.08",
  
  // Dates
  nextReportDate: "Apr 25, 2024"
};

const FinancialData: React.FC = () => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        Financial Information
      </h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue-400" />
          Company Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Ticker</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.tickerName}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Price</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.price}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Sector</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.sector}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Industry</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.industry}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Founded</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.foundedYear}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Market Cap</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.marketCap}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Next Report</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.nextReportDate}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-purple-400" />
          Revenue & Profit
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue (TTM)</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.revenue}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Net Profit</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.netProfit}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Net Profit Margin</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.netProfitMargin}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">2023 Revenue</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.revenue2023}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">2024 Revenue</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.revenue2024}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">2025 Revenue (est.)</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.revenue2025}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-400" />
          Growth Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue Growth (YoY) - Y1</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.revenueGrowthY1}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue Growth (YoY) - Y2</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.revenueGrowthY2}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue Growth (YoY) - Y3</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.revenueGrowthY3}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-amber-400" />
          Investor Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">P/E Ratio</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.peRatio}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Dividend Yield</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.dividendYield}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Basic EPS</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.basicEPS}</p>
          </div>
          
          <div className="transition-transform duration-300 hover:scale-105">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Diluted EPS</p>
            <p className="text-xl font-semibold dark:text-white">{financialData.dilutedEPS}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialData;
