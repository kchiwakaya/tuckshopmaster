import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export async function fetchInventory() {
  const inventoryCollection = collection(db, "products");
  const inventorySnapshot = await getDocs(inventoryCollection);
  return inventorySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    sku: doc.data().sku,
    category: doc.data().category,
    quantity: doc.data().quantity,
    price: doc.data().price,
  }));
} 