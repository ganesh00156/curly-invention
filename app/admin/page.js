import { db } from '../../lib/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import Image from 'next/image';

async function getProducts() {
  const productsCollection = collection(db, 'products');
  const q = query(productsCollection, orderBy('createdAt', 'desc'));
  const productsSnapshot = await getDocs(q);
  return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export default async function AdminDashboard() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      <div className="bg-gray-800 rounded-lg shadow">
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
              // **ROBUSTNESS FIX:** Check if the first image URL is valid before rendering.
              // It ensures the URL is a string and starts with 'http'.
              const imageUrl = product.imageUrl && 
                               product.imageUrl.length > 0 && 
                               typeof product.imageUrl[0] === 'string' && 
                               product.imageUrl[0].startsWith('http')
                ? product.imageUrl[0]
                : null; // Set to null if the URL is invalid.

              return (
                <tr key={product.id} className="border-b border-gray-700 last:border-b-0">
                  <td className="p-4">
                    {/* Render the image only if the URL is valid */}
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={product.name} 
                        width={60} 
                        height={60} 
                        className="rounded object-contain bg-white p-1"
                      />
                    ) : (
                      // Display a placeholder if the URL is invalid or missing
                      <div className="w-[60px] h-[60px] flex items-center justify-center bg-gray-700 rounded text-xs text-gray-400">
                        Invalid Image
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <button className="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}