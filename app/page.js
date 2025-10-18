import { db } from '../lib/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import ProductCard from '../components/ProductCard';

async function getProducts() {
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, orderBy('createdAt', 'desc'));
  const productsSnapshot = await getDocs(q);
  return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hottest Deals Section */}
      <section id="deals" className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Today's Hottest Deals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}