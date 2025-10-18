import { db } from '../../../lib/firebase/config';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import ProductCard from '../../../components/ProductCard';
import Link from 'next/link';

// Function to get a specific category's details
async function getCategory(id) {
  const docRef = doc(db, 'categories', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// Function to get products filtered by category ID
async function getProductsByCategory(categoryId) {
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, where('category', '==', categoryId));
  const productsSnapshot = await getDocs(q);
  return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function CategoryPage({ params }) {
  const { id } = params;
  const category = await getCategory(id);
  const products = await getProductsByCategory(id);

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold">Category not found</h1>
        <p className="mt-4">
          <Link href="/" className="text-indigo-600 hover:underline">
            &larr; Back to all deals
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-700">{category.name}</span>
      </nav>
      
      <h1 className="text-4xl font-bold text-center mb-10">
        Products in: <span className="text-indigo-600">{category.name}</span>
      </h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products found in this category yet.</p>
      )}
    </main>
  );
}