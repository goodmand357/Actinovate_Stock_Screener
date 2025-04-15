
import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data
const performanceData = [
  { month: 'Jan', value: 12500 },
  { month: 'Feb', value: 15700 },
  { month: 'Mar', value: 16800 },
  { month: 'Apr', value: 18200 },
  { month: 'May', value: 19100 },
  { month: 'Jun', value: 22400 },
  { month: 'Jul', value: 24300 },
  { month: 'Aug', value: 26700 },
  { month: 'Sep', value: 29500 },
  { month: 'Oct', value: 31200 },
  { month: 'Nov', value: 33600 },
  { month: 'Dec', value: 35133 }
];

const allocationData = [
  { name: 'Technology', value: 65 },
  { name: 'Healthcare', value: 15 },
  { name: 'Finance', value: 10 },
  { name: 'Consumer', value: 5 },
  { name: 'Energy', value: 5 }
];

const COLORS = ['#8884d8', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

const topPerformers = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 435.10,
    change: 106.94
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 297.80,
    change: 52.16
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 328.79,
    change: 39.64
  }
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Portfolio Value</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className="text-2xl font-bold">$35,133.28</div>
          )}
        </div>
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Total Profit/Loss</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className="text-2xl font-bold text-success">+$7,451.44</div>
          )}
        </div>
        <div className="stat-card">
          <div className="text-sm text-muted-foreground mb-2">Day Change</div>
          {loading ? (
            <div className="h-8 w-3/4 shimmer-effect rounded"></div>
          ) : (
            <div className="text-2xl font-bold text-success">+$523.80</div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full w-full shimmer-effect rounded"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Value']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                    dot={{ stroke: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sector Allocation</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full w-full shimmer-effect rounded"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={allocationData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontalPoints={[]} />
                  <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="p-4 h-24 shimmer-effect"></div>
                </div>
              ))
            ) : (
              topPerformers.map((stock) => (
                <div key={stock.symbol} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-3 flex justify-between items-center">
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-success">+{stock.change.toFixed(2)}%</div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground mb-2">{stock.name}</div>
                    <div className="text-xl font-bold">${stock.price.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
