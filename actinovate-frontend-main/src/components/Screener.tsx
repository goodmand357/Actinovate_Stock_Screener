import React, { useState } from 'react';
import { Download, ChevronDown, ChevronUp, Search, SlidersHorizontal, X, Bell, BellOff, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

// Mock data for the screener
const mockStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    industry: "Consumer Electronics",
    price: 185.92,
    change: 2.45,
    changePercent: 1.32,
    marketCap: 2980000000000,
    pe: 31.42,
    eps: 5.91,
    dividendYield: 0.48,
    volume: 56780000,
    beta: 1.28,
    founded: 1976,
    netProfit: 99580000000,
    netProfitPercentage: 25.3,
    revenue: 394330000000,
    sma10: 183.56,
    sma20: 179.43,
    sma50: 175.29,
    sma200: 168.77,
    rsi: 68.2,
    relativeVolume: 1.2,
    psRatio: 8.1,
    pbRatio: 46.2,
    pcfRatio: 28.4,
    momentum: 6.5
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    industry: "Software",
    price: 328.79,
    change: 4.28,
    changePercent: 1.31,
    marketCap: 2450000000000,
    pe: 35.21,
    eps: 9.34,
    dividendYield: 0.73,
    volume: 22340000,
    beta: 0.92,
    founded: 1975,
    netProfit: 72360000000,
    netProfitPercentage: 36.8,
    revenue: 196520000000,
    sma10: 326.78,
    sma20: 319.45,
    sma50: 312.37,
    sma200: 287.89,
    rsi: 71.4,
    relativeVolume: 0.95,
    psRatio: 12.5,
    pbRatio: 15.8,
    pcfRatio: 26.2,
    momentum: 8.3
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    sector: "Technology",
    industry: "Internet Content & Information",
    price: 1450.16,
    change: -5.84,
    changePercent: -0.41,
    marketCap: 1840000000000,
    pe: 25.68,
    eps: 56.47,
    dividendYield: 0,
    volume: 14560000,
    beta: 1.06,
    founded: 1998,
    netProfit: 73800000000,
    netProfitPercentage: 21.6,
    revenue: 341820000000,
    sma10: 1448.32,
    sma20: 1417.89,
    sma50: 1389.45,
    sma200: 1298.76,
    rsi: 57.8,
    relativeVolume: 0.87,
    psRatio: 5.4,
    pbRatio: 6.3,
    pcfRatio: 17.9,
    momentum: 4.2
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    sector: "Consumer Cyclical",
    industry: "Internet Retail",
    price: 3120.50,
    change: 35.21,
    changePercent: 1.14,
    marketCap: 1560000000000,
    pe: 76.11,
    eps: 41.00,
    dividendYield: 0,
    volume: 17890000,
    beta: 1.19,
    founded: 1994,
    netProfit: 26263000000,
    netProfitPercentage: 5.1,
    revenue: 513983000000,
    sma10: 3087.67,
    sma20: 3002.45,
    sma50: 2945.78,
    sma200: 2738.91,
    rsi: 63.5,
    relativeVolume: 1.12,
    psRatio: 3.0,
    pbRatio: 12.7,
    pcfRatio: 24.6,
    momentum: 5.8
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    industry: "Semiconductors",
    price: 435.10,
    change: 15.45,
    changePercent: 3.68,
    marketCap: 1070000000000,
    pe: 112.83,
    eps: 3.86,
    dividendYield: 0.07,
    volume: 42560000,
    beta: 1.74,
    founded: 1993,
    netProfit: 9752000000,
    netProfitPercentage: 32.8,
    revenue: 29704000000,
    sma10: 412.34,
    sma20: 389.67,
    sma50: 367.21,
    sma200: 289.43,
    rsi: 78.4,
    relativeVolume: 1.34,
    psRatio: 36.0,
    pbRatio: 34.5,
    pcfRatio: 87.6,
    momentum: 15.7
  }
];

// Sectors
const sectors = [
  'All',
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Cyclical',
  'Industrials',
  'Communication Services',
  'Consumer Defensive',
  'Energy',
  'Basic Materials',
  'Real Estate',
  'Utilities'
];

// Industries
const industries = [
  'All',
  'Software',
  'Semiconductors',
  'Consumer Electronics',
  'Internet Content & Information',
  'Internet Retail',
  'Biotechnology',
  'Banks',
  'Insurance',
  'Aerospace & Defense',
  'Telecom'
];

const Screener = () => {
  const [stocks, setStocks] = useState(mockStocks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: 'marketCap',
    direction: 'desc'
  });
  const [alertedStocks, setAlertedStocks] = useState<string[]>([]);
  
  // Alert settings states
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertType, setAlertType] = useState<'price' | 'volume' | 'movement'>('price');
  const [alertThreshold, setAlertThreshold] = useState('5');
  const [alertFrequency, setAlertFrequency] = useState<'realtime' | 'daily' | 'weekly'>('realtime');
  
  // Filter states
  const [filters, setFilters] = useState({
    ticker: '',
    minPrice: '',
    maxPrice: '',
    sector: 'All',
    industry: '',
    foundedYear: '',
    netProfit: '',
    netProfitPercentage: '',
    revenue: '',
    pe: '',
    dividendYield: '',
    basicEPS: '',
    dilutedEPS: '',
    sma10: '',
    sma20: '',
    sma50: '',
    sma200: '',
    beta1Year: '',
    beta5Year: '',
    relativeVolume: '',
    psRatio: '',
    pbRatio: '',
    pcfRatio: '',
    rsi: '',
    momentum: ''
  });
  
  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const resetFilters = () => {
    setFilters({
      ticker: '',
      minPrice: '',
      maxPrice: '',
      sector: 'All',
      industry: '',
      foundedYear: '',
      netProfit: '',
      netProfitPercentage: '',
      revenue: '',
      pe: '',
      dividendYield: '',
      basicEPS: '',
      dilutedEPS: '',
      sma10: '',
      sma20: '',
      sma50: '',
      sma200: '',
      beta1Year: '',
      beta5Year: '',
      relativeVolume: '',
      psRatio: '',
      pbRatio: '',
      pcfRatio: '',
      rsi: '',
      momentum: ''
    });
    
    setStocks(mockStocks);
    toast.success("Filters have been reset");
  };
  
  const applyFilters = () => {
    let filteredStocks = [...mockStocks];
    
    // Apply ticker filter
    if (filters.ticker) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(filters.ticker.toLowerCase())
      );
    }
    
    // Apply price filters
    if (filters.minPrice) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.price >= parseFloat(filters.minPrice)
      );
    }
    
    if (filters.maxPrice) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.price <= parseFloat(filters.maxPrice)
      );
    }
    
    // Apply sector filter
    if (filters.sector && filters.sector !== 'All') {
      filteredStocks = filteredStocks.filter(stock => 
        stock.sector === filters.sector
      );
    }
    
    // Apply industry filter
    if (filters.industry && filters.industry !== 'All') {
      filteredStocks = filteredStocks.filter(stock => 
        stock.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }
    
    setStocks(filteredStocks);
    toast.success(`Found ${filteredStocks.length} stocks matching your criteria`);
  };
  
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedStocks = [...stocks].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setStocks(sortedStocks);
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="sort-icon h-4 w-4 opacity-50" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="sort-icon h-4 w-4" />
      : <ChevronDown className="sort-icon h-4 w-4" />;
  };
  
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Symbol', 'Name', 'Sector', 'Price', 'Change', 'Change %', 'Market Cap', 'P/E', 'Dividend Yield'];
    const csvContent = [
      headers.join(','),
      ...stocks.map(stock => [
        stock.symbol,
        `"${stock.name}"`,
        `"${stock.sector}"`,
        stock.price,
        stock.change,
        stock.changePercent,
        stock.marketCap,
        stock.pe,
        stock.dividendYield
      ].join(','))
    ].join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'stock_screener_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV file exported successfully');
  };
  
  const formatMarketCap = (value) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const toggleAlert = (symbol: string) => {
    if (alertedStocks.includes(symbol)) {
      setAlertedStocks(alertedStocks.filter(s => s !== symbol));
      toast.success(`Alert removed for ${symbol}`);
    } else {
      setAlertedStocks([...alertedStocks, symbol]);
      toast.success(`Alert set for ${symbol} (${alertFrequency} frequency)`);
    }
  };
  
  const toggleAlertsEnabled = () => {
    setAlertsEnabled(!alertsEnabled);
    toast.success(alertsEnabled ? 'Alerts disabled' : 'Alerts enabled');
  };
  
  return (
    <div className="screener-page">
      <div className="header-section flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Stock Screener</h1>
          <p className="text-muted-foreground">Find and filter stocks based on your criteria</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleFilter} className="mobile-filter-toggle">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" onClick={exportToCSV} className="export-btn">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="screener-layout flex relative">
        {/* Filter Sidebar */}
        <div 
          className={cn(
            "filter-sidebar w-64 border-r border-border p-4 transition-all duration-300 overflow-hidden bg-background",
            filterVisible ? "block absolute md:relative z-20 h-[calc(100vh-8rem)] md:h-auto overflow-y-auto" : "hidden md:hidden"
          )}
        >
          <div className="filter-sidebar-header flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Filters</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={toggleFilter}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="filter-sidebar-content space-y-4">
            {/* Filter groups */}
            <div className="filter-group">
              <label className="text-sm mb-1 block text-muted-foreground">Search Ticker:</label>
              <Input 
                className="w-full" 
                placeholder="Enter Ticker Symbol" 
                name="ticker"
                value={filters.ticker}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Price Range:</label>
              <div className="filter-row">
                <Input 
                  className="filter-input-half" 
                  placeholder="Min Price" 
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  type="number"
                />
                <Input 
                  className="filter-input-half" 
                  placeholder="Max Price" 
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  type="number"
                />
              </div>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Sector:</label>
              <select 
                className="filter-select" 
                name="sector"
                value={filters.sector}
                onChange={handleFilterChange}
              >
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Industry:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Industry" 
                name="industry"
                value={filters.industry}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Founded Year:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Founded Year" 
                name="foundedYear"
                value={filters.foundedYear}
                onChange={handleFilterChange}
                type="number"
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Net Profit:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Net Profit" 
                name="netProfit"
                value={filters.netProfit}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Net Profit (%):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Net Profit %" 
                name="netProfitPercentage"
                value={filters.netProfitPercentage}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Revenue:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Revenue" 
                name="revenue"
                value={filters.revenue}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Price/Earning (P/E):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter P/E" 
                name="pe"
                value={filters.pe}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Dividend Yield:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Dividend Yield" 
                name="dividendYield"
                value={filters.dividendYield}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Basic EPS:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Basic EPS" 
                name="basicEPS"
                value={filters.basicEPS}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Diluted EPS:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Diluted EPS" 
                name="dilutedEPS"
                value={filters.dilutedEPS}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">SMA (10):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter SMA (10)" 
                name="sma10"
                value={filters.sma10}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">SMA (20):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter SMA (20)" 
                name="sma20"
                value={filters.sma20}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">SMA (50):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter SMA (50)" 
                name="sma50"
                value={filters.sma50}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">SMA (200):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter SMA (200)" 
                name="sma200"
                value={filters.sma200}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Beta (1 Year):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Beta (1 Year)" 
                name="beta1Year"
                value={filters.beta1Year}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Beta (5 Year):</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Beta (5 Year)" 
                name="beta5Year"
                value={filters.beta5Year}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Relative Volume:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Relative Volume" 
                name="relativeVolume"
                value={filters.relativeVolume}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">P/S Ratio:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter P/S Ratio" 
                name="psRatio"
                value={filters.psRatio}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">P/B Ratio:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter P/B Ratio" 
                name="pbRatio"
                value={filters.pbRatio}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">P/CF Ratio:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter P/CF Ratio" 
                name="pcfRatio"
                value={filters.pcfRatio}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">RSI:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter RSI" 
                name="rsi"
                value={filters.rsi}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="filter-group">
              <label className="filter-label">Momentum:</label>
              <Input 
                className="filter-input" 
                placeholder="Enter Momentum" 
                name="momentum"
                value={filters.momentum}
                onChange={handleFilterChange}
              />
            </div>
            
            <div className="mt-6 space-y-2">
              <Button onClick={applyFilters} className="w-full">
                Apply Filters
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        <div className="results-section flex-1 overflow-hidden">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Search by symbol or company name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="results-header mb-2 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{stocks.length} stocks found</span>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Alerts:</span>
                <Switch 
                  checked={alertsEnabled} 
                  onCheckedChange={toggleAlertsEnabled} 
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
              
              {alertsEnabled && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-2 ml-2">
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                      Alert Settings
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-3">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Alert Type</h4>
                        <RadioGroup 
                          value={alertType} 
                          onValueChange={(value) => setAlertType(value as 'price' | 'volume' | 'movement')}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="price" id="alert-price" />
                            <label htmlFor="alert-price" className="text-sm">Price Change</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="volume" id="alert-volume" />
                            <label htmlFor="alert-volume" className="text-sm">Volume Spike</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="movement" id="alert-movement" />
                            <label htmlFor="alert-movement" className="text-sm">Price Movement</label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Threshold (%)</h4>
                        <Input 
                          type="number" 
                          value={alertThreshold} 
                          onChange={(e) => setAlertThreshold(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Frequency</h4>
                        <RadioGroup 
                          value={alertFrequency} 
                          onValueChange={(value) => setAlertFrequency(value as 'realtime' | 'daily' | 'weekly')}
                          className="flex flex-col gap-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="realtime" id="alert-realtime" />
                            <label htmlFor="alert-realtime" className="text-sm">Real-time</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="daily" id="alert-daily" />
                            <label htmlFor="alert-daily" className="text-sm">Daily</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="weekly" id="alert-weekly" />
                            <label htmlFor="alert-weekly" className="text-sm">Weekly</label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => toast.success(`Alert settings saved (${alertType} at ${alertThreshold}%, ${alertFrequency} frequency)`)}
                      >
                        Save Settings
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          {alertsEnabled && alertedStocks.length > 0 && (
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700 dark:text-blue-300">Alert Configuration</AlertTitle>
              <AlertDescription className="text-blue-600 dark:text-blue-400">
                You have set alerts for {alertedStocks.length} stocks. 
                You will be notified {alertFrequency === 'realtime' ? 'in real-time' : 
                alertFrequency === 'daily' ? 'daily' : 'weekly'} when {alertType === 'price' ? 'price changes' : 
                alertType === 'volume' ? 'volume spikes' : 'price movements'} exceed {alertThreshold}%.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="table-container overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th onClick={() => handleSort('symbol')} className="p-2 text-left cursor-pointer">
                    <div className="flex items-center gap-1 group">
                      Symbol
                      {getSortIcon('symbol')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('name')} className="p-2 text-left cursor-pointer">
                    <div className="flex items-center gap-1 group">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('sector')} className="p-2 text-left cursor-pointer">
                    <div className="flex items-center gap-1 group">
                      Sector
                      {getSortIcon('sector')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('price')} className="p-2 text-right cursor-pointer">
                    <div className="flex items-center justify-end gap-1 group">
                      Price
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('changePercent')} className="p-2 text-right cursor-pointer">
                    <div className="flex items-center justify-end gap-1 group">
                      Change %
                      {getSortIcon('changePercent')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('marketCap')} className="p-2 text-right cursor-pointer">
                    <div className="flex items-center justify-end gap-1 group">
                      Market Cap
                      {getSortIcon('marketCap')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('pe')} className="p-2 text-right cursor-pointer">
                    <div className="flex items-center justify-end gap-1 group">
                      P/E
                      {getSortIcon('pe')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('dividendYield')} className="p-2 text-right cursor-pointer">
                    <div className="flex items-center justify-end gap-1 group">
                      Div Yield
                      {getSortIcon('dividendYield')}
                    </div>
                  </th>
                  <th className="p-2 text-center">
                    <div className="flex items-center justify-center gap-1 group">
                      Alert
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {stocks
                  .filter(stock => 
                    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((stock) => (
                    <tr key={stock.symbol} className="border-b border-border hover:bg-secondary/20">
                      <td className="p-2 font-medium">{stock.symbol}</td>
                      <td className="p-2">{stock.name}</td>
                      <td className="p-2">{stock.sector}</td>
                      <td className="p-2 text-right">${stock.price.toFixed(2)}</td>
                      <td className={`p-2 text-right ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </td>
                      <td className="p-2 text-right">{formatMarketCap(stock.marketCap)}</td>
                      <td className="p-2 text-right">{stock.pe.toFixed(2)}</td>
                      <td className="p-2 text-right">{(stock.dividendYield * 100).toFixed(2)}%</td>
                      <td className="p-2 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAlert(stock.symbol);
                          }}
                        >
                          {alertedStocks.includes(stock.symbol) ? (
                            <Bell className="h-4 w-4 text-primary" fill="currentColor" />
                          ) : (
                            <Bell className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {filterVisible && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden"
          onClick={toggleFilter}
        ></div>
      )}
    </div>
  );
};

export default Screener;
