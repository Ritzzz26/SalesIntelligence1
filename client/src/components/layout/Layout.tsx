import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import useMobile from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Hidden on mobile unless toggled */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={toggleSidebar} />
        
        <div className="flex-1 overflow-y-auto bg-gray-50 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
};

import { useState } from 'react';
export default Layout;
