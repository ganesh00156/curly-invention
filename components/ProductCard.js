import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const formattedPrice = product.price.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  const displayImage = Array.isArray(product.imageUrl) && product.imageUrl.length > 0 
    ? product.imageUrl[0] 
    : '/placeholder.png';

  return (
    <div className="group relative border rounded-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <Link href={`/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative w-full aspect-[3/4] bg-gray-50">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            className="p-4 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-gray-800 text-md">{product.brand}</h3>
          <p className="text-gray-500 text-sm h-10 overflow-hidden">{product.name}</p>
          <p className="font-semibold mt-auto pt-2 text-gray-900">{formattedPrice}</p>
        </div>
      </Link>
    </div>
  );
}