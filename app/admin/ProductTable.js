'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase/config'; // CORRECTED PATH
import { doc, deleteDoc } from 'firebase/firestore';

export default function ProductTable({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setError('');
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error removing document: ", err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow">
      {error && <p className="p-4 text-red-500">{error}</p>}
      <table className="w-full text-left">
        <thead className="border-b border-gray-700">
          <tr>
            <th className="p-4">Image</th>
            <th className="p-4">Name</th>
            <th className="p-4">Price</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const imageUrl = product.imageUrl?.[0]?.startsWith('http') ? product.imageUrl[0] : null;

            return (
              <tr key={product.id} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50">
                <td className="p-4">
                  {imageUrl ? (
                    <Image src={imageUrl} alt={product.name} width={60} height={60} className="rounded object-contain bg-white p-1" />
                  ) : (
                    <div className="w-[60px] h-[60px] flex items-center justify-center bg-gray-700 rounded text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="p-4 space-x-4">
                  <Link href={`/admin/edit-product/${product.id}`} className="text-blue-400 hover:text-blue-500 font-semibold">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 font-semibold">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}