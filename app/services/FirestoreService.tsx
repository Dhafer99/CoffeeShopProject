import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { BaristaSales } from '../models/baristasales';

import { User } from '../models/user';


export const fetchUserDataByUid = async (uid:any) => {
  try {
    const usersCollection = collection(FIRESTORE_DB, 'Users');
    const userQuery = query(usersCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); // Assuming uid is unique, take the first matching document
    } else {
      console.error('No user found with this uid');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const usersCollection = collection(FIRESTORE_DB, 'Users');

export const addUser = async (user: Omit<User, 'id'>): Promise<void> => {
  try {
    await addDoc(usersCollection, user);
  } catch (error) {
    console.error('Error adding user: ', error);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(usersCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  } catch (error) {
    console.error('Error getting users: ', error);
    return [];
  }
};

export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  try {
    const userDoc = doc(FIRESTORE_DB, 'Users', id);
    await updateDoc(userDoc, user);
  } catch (error) {
    console.error('Error updating user: ', error);
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const userDoc = doc(FIRESTORE_DB, 'Users', id);
    await deleteDoc(userDoc);
  } catch (error) {
    console.error('Error deleting user: ', error);
  }
};


const baristasCollection = collection(FIRESTORE_DB, 'Users');

export const getWorkdays = async (): Promise<string[]> => {
  try {
    const workdaysSet = new Set<string>();
    const querySnapshot = await getDocs(baristasCollection);
    querySnapshot.forEach(doc => {
      const workday = doc.data().workday;
      if (workday) {
        workdaysSet.add(workday);
      }
    });
    return Array.from(workdaysSet);
  } catch (error) {
    console.error('Error getting workdays: ', error);
    return [];
  }
};

export const getBaristasByWorkday = async (workday: string): Promise<User[]> => {
  try {
    const q = query(baristasCollection, where('workday', '==', workday));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  } catch (error) {
    console.error('Error getting baristas by workday: ', error);
    return [];
  }
};


const BARISTA_SALES_COLLECTION = 'baristaSales';

export const addBaristaSales = async (userId: string, sales: BaristaSales) => {
  const baristaSalesDoc = doc(FIRESTORE_DB, BARISTA_SALES_COLLECTION, userId);
  await setDoc(baristaSalesDoc, sales, { merge: true });
};

export const getBaristaSales = async (userId: string): Promise<BaristaSales | null> => {
  const baristaSalesDoc = doc(FIRESTORE_DB, BARISTA_SALES_COLLECTION, userId);
  const docSnap = await getDoc(baristaSalesDoc);

  if (docSnap.exists()) {
    return docSnap.data() as BaristaSales;
  } else {
    return null;
  }
};


export const getBaristaSalesByEmail = async (email: string): Promise<BaristaSales | null> => {
  try {
    const usersCollection = collection(FIRESTORE_DB, 'baristaSales');
    const userQuery = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userId = querySnapshot.docs[0].id; // Assuming email is unique, take the first matching document
      return await getBaristaSales(userId);
    } else {
      console.error('No user found with this email');
      return null;
    }
  } catch (error) {
    console.error('Error fetching sales data by email:', error);
    return null;
  }
};

// Get current prices
export const getPrices = async () => {
  try {
    const pricesDoc = doc(FIRESTORE_DB, 'prices', 'currentPrices');
    const docSnap = await getDoc(pricesDoc);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('No prices found');
      return null;
    }
  } catch (error) {
    console.error('Error getting prices:', error);
    return null;
  }
};

// Update current prices
export const updatePrices = async (prices: any) => {
  try {
    const pricesDoc = doc(FIRESTORE_DB, 'prices', 'currentPrices');
    await setDoc(pricesDoc, prices);
  } catch (error) {
    console.error('Error updating prices:', error);
  }
};