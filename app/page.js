import { db } from '../lib/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';

// This is our server-side function to get products
async function getProducts() {
  const productsCollection = collection(db, 'products');
  // We create a query to order products by their creation date, descending
  const q = query(productsCollection, orderBy('createdAt', 'desc'));

  const productsSnapshot = await getDocs(q);

  // We map over the documents and shape the data, including the document ID
  const productsList = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return productsList;
}

// Our homepage is now an async component, so it can await the data
export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4">Find Your Next Favorite Thing</h1>
          <p className="text-xl mb-8">Curated deals and top products, just for you.</p>
          <a href="#deals" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">
            Explore Deals
          </a>
        </div>
      </section>

      <div id="deals" className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-10">Today's Hottest Deals</h2>

        {/* Grid layout for the product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}