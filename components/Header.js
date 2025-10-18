import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          AffiliateAvenue
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/" className="text-gray-600 hover:text-gray-800">Home</Link></li>
            <li><Link href="/deals" className="text-gray-600 hover:text-gray-800">Deals</Link></li>
            <li><Link href="/categories" className="text-gray-600 hover:text-gray-800">Categories</Link></li>
            <li><Link href="/about" className="text-gray-600 hover:text-gray-800">About</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}