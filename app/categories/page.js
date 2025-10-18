import { db } from '../../lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

// Function to get all categories
async function getCategories() {
  const categoriesCollection = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCollection);
  return categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Shop by Category</h1>
      
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {categories.map(category => (
            <Link key={category.id} href={`/categories/${category.id}`} className="group text-center">
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-indigo-500 transition-all duration-300 transform group-hover:scale-105">
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h3 className="mt-4 font-semibold text-lg text-gray-800 group-hover:text-indigo-600">{category.name}</h3>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No categories found.</p>
      )}
    </main>
  );
}