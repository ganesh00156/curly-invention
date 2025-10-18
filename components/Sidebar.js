import { db } from '../lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';

// Function to get all categories
async function getCategories() {
  const categoriesCollection = collection(db, 'categories');
  const categoriesSnapshot = await getDocs(categoriesCollection);
  return categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function Sidebar() {
  const categories = await getCategories();

  return (
    <aside className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Categories</h2>
      <nav>
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              <Link 
                href={`/categories/${category.id}`} 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-indigo-50 group transition-colors"
              >
                <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-indigo-600">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}