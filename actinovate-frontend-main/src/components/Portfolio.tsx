
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ✅ Import the shared Supabase client
import { supabase } from '@/lib/supabaseClient';

const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: 0,
    totalProfitLoss: 0,
    dayChange: 0
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession();

        if (!session) {
          toast.error("You must be logged in.");
          return;
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/portfolio`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const data = await res.json();

        if (res.status !== 200) {
          throw new Error(data.error || "Failed to fetch portfolio");
        }

        setPortfolioStocks(data.stocks || []);
        setPortfolioSummary({
          totalValue: data.totalValue || 0,
          totalProfitLoss: data.totalProfitLoss || 0,
          dayChange: data.dayChange || 0
        });
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        toast.error("Failed to load portfolio.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const formatPercent = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

  const handleAddPosition = () => {
    toast.info('Add position feature coming soon!');
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground mt-1">Track your investments</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddPosition}>
          <Plus className="h-4 w-4" />
          Add Position
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Total Value</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className="text-2xl font-bold">{formatCurrency(portfolioSummary.totalValue)}</div>
          )}
        </div>
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Total Profit/Loss</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className={`text-2xl font-bold ${portfolioSummary.totalProfitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
              {portfolioSummary.totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.totalProfitLoss)}
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Day Change</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className={`text-2xl font-bold ${portfolioSummary.dayChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {portfolioSummary.dayChange >= 0 ? '+' : ''}{formatCurrency(portfolioSummary.dayChange)}
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Avg Price</th>
              <th className="text-right">Current Price</th>
              <th className="text-right">Total Value</th>
              <th className="text-right">Profit/Loss</th>
              <th className="text-right">P/L %</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <td key={cellIndex}>
                      <div className="h-5 w-full shimmer-effect rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              portfolioStocks.map((stock: any) => (
                <tr key={stock.symbol}>
                  <td className="font-medium">{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td className="text-right">{stock.shares}</td>
                  <td className="text-right">{formatCurrency(stock.avgPrice)}</td>
                  <td className="text-right">{formatCurrency(stock.currentPrice)}</td>
                  <td className="text-right">{formatCurrency(stock.totalValue)}</td>
                  <td className={`text-right ${stock.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stock.profitLoss >= 0 ? '+' : ''}{formatCurrency(stock.profitLoss)}
                  </td>
                  <td className={`text-right ${stock.profitLossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatPercent(stock.profitLossPercent)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
