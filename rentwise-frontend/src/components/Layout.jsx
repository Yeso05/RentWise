import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden lg:flex" />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 pb-20 w-full max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
