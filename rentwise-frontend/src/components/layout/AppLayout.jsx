import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="rw-page font-sans flex flex-col">
      <Navbar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />
        
        <main className="flex-1 overflow-y-auto bg-transparent custom-scrollbar p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto w-full h-full relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
