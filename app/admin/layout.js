// app/admin/layout.js

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Login from './Login';

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // When the component loads, check session storage for our login flag
  useEffect(() => {
    const isAuth = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  // If the user is not authenticated, render the Login component
  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // If authenticated, render the normal admin layout and its children (the pages)
  return (
    <section className="bg-gray-900 text-white min-h-screen">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="text-2xl font-bold">Admin Panel</Link>
            <div>
              <Link href="/admin/add-product" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Product
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </section>
  );
}