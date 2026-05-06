import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="rw-page flex flex-col min-h-screen font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden lg:flex" />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8 pb-20 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
