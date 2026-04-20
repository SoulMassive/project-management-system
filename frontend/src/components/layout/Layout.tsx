import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="lg:ml-60 pt-16 p-4 md:p-8 bg-neutral-light min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
