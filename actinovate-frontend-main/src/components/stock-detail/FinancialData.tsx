import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Layers } from 'lucide-react';

interface FinancialDataProps {
  stock: any;
}

const FinancialData: React.FC<FinancialDataProps> = ({ stock }) => {
  if (!stock) return <p>Loading financial data...</p>;

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
      <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        Financial Information for {stock.symbol}
      </h3>

      <Section title="Company Overview" icon={<Layers className="h-4 w-4 text-blue-400" />}>
        <OverviewItem label="Ticker" value={stock.symbol} />
        <OverviewItem label="Price" value={`$${stock.price?.toFixed(2)}`} />
        <OverviewItem label="Sector" value={stock.sector || 'N/A'} />
        <OverviewItem label="Industry" value={stock.industry || 'N/A'} />
        <OverviewItem label="Founded" value={stock.foundedYear || 'N/A'} />
        <OverviewItem label="Market Cap" value={stock.marketCap || 'N/A'} />
        <OverviewItem label="Next Report" value={stock.nextReportDate || 'N/A'} />
      </Section>

      {/* Add more sections if needed */}
    </div>
  );
};

export default FinancialData;

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="mb-6">
    <h4 className="text-lg font-semibold mb-3 dark:text-white flex items-center gap-2">
      {icon} {title}
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
      {children}
    </div>
  </div>
);

const OverviewItem = ({ label, value }: { label: string; value: string }) => (
  <div className="transition-transform duration-300 hover:scale-105">
    <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
    <p className="text-xl font-semibold dark:text-white">{value}</p>
  </div>
);
