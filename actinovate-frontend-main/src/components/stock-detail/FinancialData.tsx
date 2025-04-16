import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, BarChart2, Layers } from 'lucide-react';

const FinancialData: React.FC = () => {
  const [financialData, setFinancialData] = useState<any>(null);
  const [ticker, setTicker] = useState("AAPL");
  const [loading, setLoading] = useState(true);

  // 👇 Pull your API base URL from environment variables
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLoading(true);
    fetch(`${baseUrl}/api/financial-data?symbol=${ticker}`)
      .then(res => res.json())
      .then(data => {
        setFinancialData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching financial data:", err);
        setLoading(false);
      });
  }, [ticker]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).ticker.value.trim().toUpperCase();
    if (input) setTicker(input);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-2">
        <input
          name="ticker"
          placeholder="Enter a stock symbol (e.g. MSFT)"
          className="p-2 border rounded dark:bg-slate-700 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <h3 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-500" />
        Financial Information for {ticker}
      </h3>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-white">Loading financial data...</p>
      ) : financialData ? (
        <>
          <Section title="Company Overview" icon={<Layers className="h-4 w-4 text-blue-400" />}>
            <OverviewItem label="Ticker" value={financialData.ticker} />
            <OverviewItem label="Price" value={`$${financialData.price?.toFixed(2)}`} />
            <OverviewItem label="Sector" value={financialData.sector} />
            <OverviewItem label="Industry" value={financialData.industry} />
            <OverviewItem label="Founded" value={financialData.foundedYear || 'N/A'} />
            <OverviewItem label="Market Cap" value={formatBillion(financialData.market_cap)} />
            <OverviewItem label="Next Report" value={financialData.nextReportDate || 'N/A'} />
          </Section>

          <Section title="Revenue & Profit" icon={<BarChart2 className="h-4 w-4 text-purple-400" />}>
            <OverviewItem label="Revenue (TTM)" value={formatBillion(financialData.revenue)} />
            <OverviewItem label="Net Profit" value={formatBillion(financialData.net_profit)} />
            <OverviewItem label="Net Profit Margin" value={financialData.netProfitMargin || 'N/A'} />
            <OverviewItem label="2023 Revenue" value={financialData.revenue2023 || 'N/A'} />
            <OverviewItem label="2024 Revenue" value={financialData.revenue2024 || 'N/A'} />
            <OverviewItem label="2025 Revenue (est.)" value={financialData.revenue2025 || 'N/A'} />
          </Section>

          <Section title="Growth Metrics" icon={<TrendingUp className="h-4 w-4 text-green-400" />}>
            <OverviewItem label="Revenue Growth (YoY) - Y1" value={percent(financialData.revenue_growth_y1)} />
            <OverviewItem label="Revenue Growth (YoY) - Y2" value={percent(financialData.revenue_growth_y2)} />
            <OverviewItem label="Revenue Growth (YoY) - Y3" value={percent(financialData.revenue_growth_y3)} />
          </Section>

          <Section title="Investor Metrics" icon={<DollarSign className="h-4 w-4 text-amber-400" />}>
            <OverviewItem label="P/E Ratio" value={financialData.pe_ratio?.toFixed(2)} />
            <OverviewItem label="Dividend Yield" value={percent(financialData.dividend_yield)} />
            <OverviewItem label="Basic EPS" value={financialData.eps} />
            <OverviewItem label="Diluted EPS" value={financialData.dilutedEPS || 'N/A'} />
          </Section>
        </>
      ) : (
        <p className="text-center text-red-500">No data found for "{ticker}".</p>
      )}
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

const formatBillion = (value: number | undefined) => {
  if (!value) return "N/A";
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  return `$${(value / 1_000_000_000).toFixed(2)}B`;
};

const percent = (value: number | undefined) => {
  if (value === null || value === undefined) return "N/A";
  return `${(value * 100).toFixed(1)}%`;
};
