import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Side: Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-extrabold text-gray-800 tracking-tight">
            AffiliateAvenue
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/deals" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Deals</Link>
            <Link href="/categories" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">Categories</Link>
            <Link href="/about" className="font-semibold text-gray-600 hover:text-blue-600 transition-colors">About</Link>
          </nav>
        </div>

        {/* Right Side: Search */}
        <div className="flex items-center gap-6">
          <div className="relative hidden sm:block">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="bg-gray-100 rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
      </div>
    </header>
  );
}