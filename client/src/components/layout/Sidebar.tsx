import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import useMobile from '@/hooks/use-mobile';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const isMobile = useMobile();
  const [location] = useLocation();

  // Close sidebar when clicking a link on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  // Dynamic CSS for mobile
  const sidebarClasses = cn(
    "bg-white border-r border-gray-200 flex-shrink-0 flex flex-col z-30",
    isMobile 
      ? `fixed top-0 bottom-0 left-0 w-64 transition-transform duration-300 transform ${open ? 'translate-x-0' : '-translate-x-full'}`
      : "w-64 hidden md:flex"
  );

  return (
    <>
      {/* Backdrop - only on mobile when sidebar is open */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="p-4 border-b flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <h1 className="font-semibold text-lg">SalesOps</h1>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Dashboard
          </div>
          <div className="px-2">
            <Link href="/">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === "/" 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn("mr-3 h-5 w-5", location === "/" ? "text-primary-500" : "text-gray-500")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Overview</span>
              </div>
            </Link>
          </div>
          
          <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sales Management
          </div>
          <div className="px-2">
            <Link href="/leads">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === "/leads" 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn("mr-3 h-5 w-5", location === "/leads" ? "text-primary-500" : "text-gray-500")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Leads</span>
              </div>
            </Link>
          </div>
          <div className="px-2">
            <Link href="/pipeline">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === "/pipeline" 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn("mr-3 h-5 w-5", location === "/pipeline" ? "text-primary-500" : "text-gray-500")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <span>Pipeline</span>
              </div>
            </Link>
          </div>
          <div className="px-2">
            <Link href="/social-media">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === "/social-media" 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn("mr-3 h-5 w-5", location === "/social-media" ? "text-primary-500" : "text-gray-500")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.9 4.9 15.2c-1.4-1.2-2.6-2.9-3.2-4.8-.5-1.7-.5-3.7 0-5.5C2.1 3.1 3.1 1.6 4.4.9 5.3.3 6.3 0 7.4 0c2.6 0 4.9 1.9 5.6 4.4 0 .1.1 0 .2 0 .1 0 .1.1.2 0 .7-2.4 3-4.3 5.6-4.3 1.1 0 2.1.3 3 .9 1.2.7 2.2 2.1 2.6 3.8.5 1.8.5 3.9 0 5.6-.6 1.9-1.8 3.6-3.2 4.8L12 20.9z" />
                </svg>
                <span>Social Media</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-blue-500 text-white">New</span>
              </div>
            </Link>
          </div>
          
          <div className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Analytics
          </div>
          <div className="px-2">
            <Link href="/team">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === "/team" 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn("mr-3 h-5 w-5", location === "/team" ? "text-primary-500" : "text-gray-500")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <span>Performance</span>
              </div>
            </Link>
          </div>
          <div className="px-2">
            <Link href="/forecasting">
              <div 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors cursor-pointer",
                  location === "/forecasting" 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={handleLinkClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={cn("mr-3 h-5 w-5", location === "/forecasting" ? "text-primary-500" : "text-gray-500")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20v-6M6 20V10M18 20V4"></path>
                </svg>
                <span>Forecasting</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-purple-500 text-white">AI</span>
              </div>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium">
              AS
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Alice Smith</p>
              <p className="text-xs text-gray-500">Sales Manager</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
