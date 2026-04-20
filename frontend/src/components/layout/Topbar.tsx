import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass, HiOutlineBars3 } from 'react-icons/hi2';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Topbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 right-0 lg:left-60 left-0 h-16 bg-white border-b border-[#D3D1C7] flex items-center justify-between px-4 md:px-8 z-40">
      <div className="flex items-center space-x-4 overflow-hidden">
        <button 
          onClick={onMenuClick}
          className="p-2 text-neutral hover:bg-neutral-light rounded-lg lg:hidden"
        >
          <HiOutlineBars3 className="text-2xl" />
        </button>

        <div className="hidden sm:flex items-center space-x-2 text-xs md:text-sm text-neutral font-medium">
          <span>Dashboard</span>
          {pathnames.map((name) => (
            <div key={name} className="flex items-center space-x-2">
              <span className="text-neutral-300">/</span>
              <span className="capitalize text-primary truncate max-w-[100px]">{name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral text-lg" />
          <input 
            type="text" 
            placeholder="Search projects, tasks, files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-neutral-light border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <NotificationDropdown />
        
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold group-hover:text-primary transition-colors">Admin Menu</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-light flex items-center justify-center group-hover:bg-primary-light transition-colors">
            <div className="w-2 h-2 bg-neutral-dark rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
