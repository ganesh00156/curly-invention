import { db } from '../../../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import ProductImageGallery from '../../../components/ProductImageGallery';

// Server-side function to get a single product by its ID
async function getProduct(id) {
  const docRef = doc(db, 'products', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold">Product not found</h1>
         <p className="mt-4">
          <Link href="/" className="text-indigo-600 hover:underline">
            &larr; Back to all deals
          </Link>
        </p>
      </main>
    );
  }

  const formattedPrice = product.price.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // **FIX:** This logic ensures the props are always in the correct format.
  const imageUrls = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];
  const amazonLink = Array.isArray(product.amazonLink) ? product.amazonLink[0] : product.amazonLink;
  const flipkartLink = Array.isArray(product.flipkartLink) ? product.flipkartLink[0] : product.flipkartLink;

  return (
    <main className="bg-white">
      <div className="container mx-auto px-4 py-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-800">Home</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-gray-700">{product.name}</span>
          </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex justify-center items-start">
             {/* We now pass the sanitized imageUrls array */}
             <ProductImageGallery images={imageUrls} />
          </div>

          <div className="pt-4">
            <h1 className="text-3xl font-bold text-gray-800">{product.brand}</h1>
            <h2 className="text-2xl text-gray-500 mt-1">{product.name}</h2>
            
            <hr className="my-6" />

            <div>
              <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
              <p className="text-sm font-semibold text-green-600 mt-2">inclusive of all taxes</p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href={amazonLink || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-center w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors uppercase tracking-wider"
              >
                Buy on Amazon
              </Link>
              <Link 
                href={flipkartLink || '#'}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-center w-full border-2 border-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-gray-100 transition-colors uppercase tracking-wider"
              >
                Buy on Flipkart
              </Link>
            </div>

            <div className="mt-10 pt-6 border-t">
                 <h3 className="font-bold text-lg text-gray-800 mb-3">Product Details</h3>
                 <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}