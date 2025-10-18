import { db } from '../lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';

async function getCategories() {
  const categoriesCollection = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCollection);
  return categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function CategoryNav() {
  const categories = await getCategories();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-center space-x-8 overflow-x-auto py-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link href={`/categories/${category.id}`} className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap">
                {category.name.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}