import { db } from '../../../lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import ProductImageGallery from '../../../components/ProductImageGallery';

// **UPDATED:** Now fetches both product and its category name
async function getProductAndCategory(id) {
  const productRef = doc(db, 'products', id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return { product: null, category: null };
  }
  
  const product = { id: productSnap.id, ...productSnap.data() };
  
  let category = null;
  // Check if there is a category ID to fetch
  if (product.category) {
    const categoryRef = doc(db, 'categories', product.category);
    const categorySnap = await getDoc(categoryRef);
    if (categorySnap.exists()) {
      category = { id: categorySnap.id, ...categorySnap.data() };
    }
  }

  return { product, category };
}

export default async function ProductPage({ params }) {
  const { product, category } = await getProductAndCategory(params.id);

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

  const imageUrls = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];
  const amazonLink = Array.isArray(product.amazonLink) ? product.amazonLink[0] : product.amazonLink;
  const flipkartLink = Array.isArray(product.flipkartLink) ? product.flipkartLink[0] : product.flipkartLink;

  return (
    <main className="bg-white">
      <div className="container mx-auto px-4 py-8">
          {/* **UPDATED BREADCRUMBS** */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-800">Home</Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/categories/${category.id}`} className="hover:text-gray-800">
                  {category.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="font-semibold text-gray-700">{product.name}</span>
          </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex justify-center items-start">
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
                className="text-center w-full bg-yellow-400 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-yellow-500 transition-colors uppercase tracking-wider"
              >
                Buy on Amazon
              </Link>
              <Link 
                href={flipkartLink || '#'}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-center w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-600 transition-colors uppercase tracking-wider"
              >
                Buy on Flipkart
              </Link>
            </div>

            <div className="mt-10 pt-6 border-t">
                 <h3 className="font-bold text-lg text-gray-800 mb-3">Product Details</h3>
                 <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}