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
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-700 last:border-b-0">
                <td className="p-4">
                  {/* We now safely access the first image of the array */}
                  {product.imageUrl && product.imageUrl.length > 0 && (
                    <Image 
                      src={product.imageUrl[0]} 
                      alt={product.name} 
                      width={60} 
                      height={60} 
                      className="rounded object-contain bg-white p-1"
                    />
                  )}
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4">₹{product.price.toLocaleString('en-IN')}</td>
                <td className="p-4">
                  {/* Future actions like Edit/Delete can go here */}
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}