import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where
} from 'firebase/firestore';

export const itemService = {
  // Get all items
  async getAllItems() {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting items:', error);
      throw error;
    }
  },

  // Get items by category
  async getItemsByCategory(category) {
    try {
      const q = query(
        collection(db, 'items'),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting items by category:', error);
      throw error;
    }
  },

  // Add new item
  async addItem(itemData) {
    try {
      const docRef = await addDoc(collection(db, 'items'), itemData);
      return { id: docRef.id, ...itemData };
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  },

  // Update item
  async updateItem(itemId, itemData) {
    try {
      const itemRef = doc(db, 'items', itemId);
      await updateDoc(itemRef, itemData);
      return { id: itemId, ...itemData };
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete item
  async deleteItem(itemId) {
    try {
      await deleteDoc(doc(db, 'items', itemId));
      return itemId;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
}; 