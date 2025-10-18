'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase/config'; // CORRECTED PATH
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!categoryName) {
      setError('Category name is required.');
      setIsLoading(false);
      return;
    }

    try {
      const categoryData = { name: categoryName };
      if (imageUrl.trim() !== '') {
        categoryData.image = imageUrl;
      }

      await addDoc(collection(db, 'categories'), categoryData);
      
      router.push('/admin');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Category</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg mx-auto">
        <div className="space-y-6">
          <input 
            value={categoryName} 
            onChange={(e) => setCategoryName(e.target.value)} 
            placeholder="Category Name" 
            required 
            className="w-full bg-gray-700 p-3 rounded"
          />
          <input 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="Image URL (Optional)" 
            type="url"
            className="w-full bg-gray-700 p-3 rounded"
          />
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <button type="submit" disabled={isLoading} className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded disabled:bg-gray-500">
          {isLoading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
}