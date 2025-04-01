import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu,
  HelpCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import useMobile from '@/hooks/use-mobile';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const isMobile = useMobile();
  const [timeframe, setTimeframe] = useState('today');

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="text-gray-500 focus:outline-none mr-3"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        
        <div className="ml-4 bg-gray-100 rounded-md p-1 hidden md:flex">
          <button
            onClick={() => setTimeframe('today')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'today' 
                ? 'bg-white shadow-sm text-gray-800 font-medium' 
                : 'text-gray-600'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'week' 
                ? 'bg-white shadow-sm text-gray-800 font-medium' 
                : 'text-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'month' 
                ? 'bg-white shadow-sm text-gray-800 font-medium' 
                : 'text-gray-600'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('quarter')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'quarter' 
                ? 'bg-white shadow-sm text-gray-800 font-medium' 
                : 'text-gray-600'
            }`}
          >
            Quarter
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative md:w-64">
          <Input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-10"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
        </div>
        
        <button className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
