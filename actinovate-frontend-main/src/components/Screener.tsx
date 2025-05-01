return (
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
    {/* Sidebar Filters */}
    <aside className="lg:col-span-1 space-y-4">
      <h2 className="text-lg font-semibold">Filters</h2>

      <div className="space-y-3">
        <Input
          placeholder="Search Ticker"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Max P/E"
          value={filters.peMax}
          onChange={(e) => setFilters({ ...filters, peMax: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Min Div Yield (%)"
          value={filters.dividendMin}
          onChange={(e) => setFilters({ ...filters, dividendMin: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Max RSI"
          value={filters.rsiMax}
          onChange={(e) => setFilters({ ...filters, rsiMax: e.target.value })}
        />

        <select
          className="w-full px-3 py-2 rounded text-sm"
          value={filters.sector}
          onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
        >
          <option value="All">All Sectors</option>
          <option value="Technology">Technology</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Consumer Cyclical">Consumer Cyclical</option>
        </select>

        <Button onClick={fetchScreener} className="w-full">Apply Filters</Button>
      </div>
    </aside>

    {/* Screener Table & Visuals */}
    <main className="lg:col-span-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Stock Screener</h1>
          <p className="text-muted-foreground text-sm">Live screener with dynamic filters</p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={toggleAlertsEnabled} variant="outline">
            Alerts {alertsEnabled ? 'On' : 'Off'}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>
      </div>

      {alertsEnabled && alertedStocks.length > 0 && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Alerts Active</AlertTitle>
          <AlertDescription>
            {alertedStocks.length} stocks tracked — {alertType}, {alertThreshold}%
          </AlertDescription>
        </Alert>
      )}

      {/* Stock Table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted text-left">
              <th className="p-2">Symbol</th>
              <th className="p-2">Name</th>
              <th className="p-2">Sector</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Change %</th>
              <th className="p-2 text-right">Market Cap</th>
              <th className="p-2 text-right">P/E</th>
              <th className="p-2 text-right">Div Yield</th>
              <th className="p-2 text-center">Alert</th>
            </tr>
          </thead>
          <tbody>
            {stocks.filter(stock =>
              stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(stock => (
              <tr key={stock.symbol} className="border-b hover:bg-muted/10">
                <td className="p-2 font-medium">{stock.symbol}</td>
                <td className="p-2">{stock.name || 'N/A'}</td>
                <td className="p-2">{stock.sector}</td>
                <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                <td className="p-2 text-right">
                  <span className={cn(
                    'font-semibold',
                    stock.changePercent! > 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {stock.changePercent?.toFixed(2)}%
                  </span>
                </td>
                <td className="p-2 text-right">{formatMarketCap(stock.market_cap)}</td>
                <td className="p-2 text-right">{stock.pe_ratio?.toFixed(2)}</td>
                <td className="p-2 text-right">{(stock.dividend_yield * 100).toFixed(2)}%</td>
                <td className="p-2 text-center">
                  <Button variant="ghost" size="icon" onClick={() => toggleAlert(stock.symbol)}>
                    {alertedStocks.includes(stock.symbol)
                      ? <Bell className="h-4 w-4 text-blue-500 fill-current" />
                      : <Bell className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Predictive Visuals Placeholder */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">AI Prediction Insights</h2>
        <div className="border rounded p-4 text-muted-foreground text-sm">
          Coming soon: price trend forecast, risk scoring, and breakout probability chart.
        </div>
      </div>
    </main>
  </div>
);
