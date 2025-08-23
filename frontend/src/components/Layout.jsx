import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// import Footer from './Footer';

function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;