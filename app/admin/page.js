import { db } from '../../lib/firebase/config';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import ProductTable from './ProductTable'; // Import the new client component

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
      <ProductTable initialProducts={products} />
    </div>
  );
}