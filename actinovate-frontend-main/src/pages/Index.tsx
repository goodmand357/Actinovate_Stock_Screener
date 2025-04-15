
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  TrendingUp, 
  Briefcase,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';

// Import our pages
import Dashboard from '@/components/Dashboard';
import Portfolio from '@/components/Portfolio';
import Screener from '@/components/Screener';
import Stocks from '@/components/Stocks';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileHidden, setMobileHidden] = useState(window.innerWidth < 1024);
  const [activePage, setActivePage] = useState('stocks');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setMobileHidden(true);
      } else {
        setMobileHidden(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobile = () => {
    setMobileHidden(!mobileHidden);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    if (window.innerWidth < 1024) {
      setMobileHidden(true);
    }
  };

  return (
    <div className="app-container flex min-h-screen">
      {/* Sidebar */}
      <div 
        className={cn(
          "sidebar w-[250px] border-r border-border transition-all duration-300 overflow-hidden z-30 bg-background fixed h-screen",
          sidebarCollapsed && "w-16",
          mobileHidden && "transform -translate-x-full"
        )}
      >
        <div className="sidebar-header flex items-center justify-between h-16 px-4 border-b border-border">
          {!sidebarCollapsed ? (
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/204e8886-d222-41d6-9b9c-9a9de2ac3da9.png" 
                alt="ACTINOVATE" 
                className="h-8 w-auto"
              />
              <span className="font-bold text-lg bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                ACTINOVATE
              </span>
            </div>
          ) : (
            <img 
              src="/lovable-uploads/204e8886-d222-41d6-9b9c-9a9de2ac3da9.png" 
              alt="ACTINOVATE" 
              className="h-8 w-auto"
            />
          )}
          <button 
            className="toggle-btn text-muted-foreground p-2 rounded-md transition-colors hover:bg-secondary hover:text-foreground"
            onClick={toggleSidebar}
          >
            <ChevronLeft className={cn("transition-transform duration-300", sidebarCollapsed && "rotate-180")} size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav flex flex-col gap-1 p-2">
          <Link 
            to="#dashboard" 
            className={cn(
              "sidebar-item flex items-center gap-3 py-2 px-3 text-muted-foreground rounded-md transition-colors hover:text-foreground",
              activePage === 'dashboard' && "bg-secondary text-foreground"
            )}
            onClick={() => handleNavigation('dashboard')}
          >
            <LayoutDashboard size={20} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </Link>
          
          <Link 
            to="#screener" 
            className={cn(
              "sidebar-item flex items-center gap-3 py-2 px-3 text-muted-foreground rounded-md transition-colors hover:text-foreground",
              activePage === 'screener' && "bg-secondary text-foreground"
            )}
            onClick={() => handleNavigation('screener')}
          >
            <Search size={20} />
            {!sidebarCollapsed && <span>Screener</span>}
          </Link>
          
          <Link 
            to="#stocks" 
            className={cn(
              "sidebar-item flex items-center gap-3 py-2 px-3 text-muted-foreground rounded-md transition-colors hover:text-foreground",
              activePage === 'stocks' && "bg-secondary text-foreground"
            )}
            onClick={() => handleNavigation('stocks')}
          >
            <TrendingUp size={20} />
            {!sidebarCollapsed && <span>Stocks</span>}
          </Link>
          
          <Link 
            to="#portfolio" 
            className={cn(
              "sidebar-item flex items-center gap-3 py-2 px-3 text-muted-foreground rounded-md transition-colors hover:text-foreground",
              activePage === 'portfolio' && "bg-secondary text-foreground"
            )}
            onClick={() => handleNavigation('portfolio')}
          >
            <Briefcase size={20} />
            {!sidebarCollapsed && <span>Portfolio</span>}
          </Link>
        </nav>
        
        {!sidebarCollapsed && (
          <div className="absolute bottom-6 left-0 right-0 px-4">
            <ThemeToggle />
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className={cn(
        "main-content flex-1 overflow-x-hidden transition-all duration-300",
        !sidebarCollapsed && !mobileHidden && "ml-[250px]",
        sidebarCollapsed && !mobileHidden && "ml-16"
      )}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="sm:hidden">
            <button 
              className="p-2 rounded-md hover:bg-secondary" 
              onClick={toggleMobile}
            >
              <Menu size={20} />
            </button>
          </div>
          <div className="flex-1 sm:hidden"></div>
          <ThemeToggle />
        </div>
        
        {/* Page content */}
        <div className="max-w-7xl mx-auto px-6 py-6 animate-fadeIn">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'screener' && <Screener />}
          {activePage === 'stocks' && <Stocks />}
          {activePage === 'portfolio' && <Portfolio />}
        </div>
      </div>
      
      {/* Mobile toggle */}
      <div className="mobile-toggle fixed bottom-4 right-4 z-50 md:hidden">
        <button 
          className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
          onClick={toggleMobile}
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
};

export default Index;
