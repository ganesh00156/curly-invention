import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const formattedPrice = product.price.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  // **FIX:** This logic now handles both strings and arrays for images and links.
  const getFirstItem = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      return value[0]; // If it's an array, return the first item
    }
    if (typeof value === 'string' && value) {
      return value; // If it's a string, return the whole string
    }
    return null; // Return null if it's empty or invalid
  };

  const displayImage = getFirstItem(product.imageUrl) || '/placeholder.png'; // Use a fallback image if none
  const amazonLink = getFirstItem(product.amazonLink) || '#';
  const flipkartLink = getFirstItem(product.flipkartLink) || '#';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-2xl transition-shadow duration-300 ease-in-out flex flex-col overflow-hidden group">
      {/* Link wraps the main content of the card */}
      <Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative w-full h-64">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            className="p-5 transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5 border-t border-gray-200 flex flex-col flex-grow">
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">{product.brand}</p>
          <h3 className="font-semibold text-lg leading-tight h-14 overflow-hidden text-gray-800 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-2xl font-bold my-4 mt-auto pt-2 text-gray-900">{formattedPrice}</p>
        </div>
      </Link>

      {/* Affiliate links are kept separate at the bottom */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-3">
        <Link href={amazonLink} target="_blank" rel="noopener noreferrer"
          className="text-center w-full bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          Amazon
        </Link>
        <Link href={flipkartLink} target="_blank" rel="noopener noreferrer"
          className="text-center w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          Flipkart
        </Link>
      </div>
    </div>
  );
}