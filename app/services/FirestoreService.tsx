import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, setDoc, getDoc, limit, QueryDocumentSnapshot, DocumentReference } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FirebaseConfig';
import { Prices } from '../models/prices';

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
const priceHistoryCollection = collection(FIRESTORE_DB, 'priceHistory');


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

export const getPriceForWorkday = async (workday: string): Promise<BaristaSales | null> => {
  try {
    const workdayDate = new Date(workday.split('/').reverse().join('-')); // Convert DD/MM/YYYY to Date
    const pricesQuery = query(
      priceHistoryCollection,
      where('effective_from', '<=', workdayDate),
      limit(1)
    );
    const querySnapshot = await getDocs(pricesQuery);
    if (!querySnapshot.empty) {
      const priceDoc = querySnapshot.docs[0];
      const priceData = priceDoc.data();
      return {
        ...priceData,
        effective_from: priceData.effective_from,
        effective_to: priceData.effective_to
      } as BaristaSales;
    }
    return null;
  } catch (error) {
    console.error('Error getting price for workday:', error);
    return null;
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
// Define the BaristaSales interface
export interface BaristaSales {
  cappucin: number;
  express: number;
  direct: number;
  water_0_5L: number;
  water_1L: number;
  TheFusion: number;
  Soda: number;
  citron: number;
  jusOrange: number;
  cake: number;
  effective_from: string;
  effective_to: string | null;
}

// Define an interface for BaristaSales with ID
interface BaristaSalesWithId extends BaristaSales {
  id: string;
}

// Helper function to format the date as DD/MM/YYYY
const formatDate = (date: Date): string => {
  const day = (`0${date.getDate()}`).slice(-2);
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getPricesForWorkday = async (workday: string): Promise<Partial<Prices> | null> => {
  try {
    const pricesRef = collection(FIRESTORE_DB, 'priceshistory');
    const q = query(pricesRef, where('effective_from', '<=', workday), where('effective_to', '>=', workday));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data() as Prices;
    }
    return null;
  } catch (error) {
    console.error("Error fetching prices for workday:", error);
    return null;
  }
};

// Get current prices
export const getPrices = async (): Promise<BaristaSalesWithId | null> => {
  try {
    const pricesQuery = query(
      collection(FIRESTORE_DB, 'priceHistory'),
      where('effective_to', '==', null),
      limit(1)
    );
    const querySnapshot = await getDocs(pricesQuery);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0] as QueryDocumentSnapshot<BaristaSales>;
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error('No current prices found');
      return null;
    }
  } catch (error) {
    console.error('Error getting prices:', error);
    return null;
  }
};

// Update current prices
export const updatePrices = async (newPrices: Omit<BaristaSales, 'effective_from' | 'effective_to'>): Promise<void> => {
  try {
    const now = new Date();
    const formattedDate = formatDate(now);

    // Fetch the current prices document
    const pricesQuery = query(
      collection(FIRESTORE_DB, 'priceHistory'),
      where('effective_to', '==', null),
      limit(1)
    );
    const querySnapshot = await getDocs(pricesQuery);

    if (!querySnapshot.empty) {
      const currentPriceDoc = querySnapshot.docs[0];
      const currentPriceDocRef: DocumentReference<BaristaSales> = currentPriceDoc.ref as DocumentReference<BaristaSales>;

      // Update the effective_to field of the current prices document
      await updateDoc(currentPriceDocRef, {
        effective_to: formattedDate
      });
    }

    // Add new prices document
    await addDoc(collection(FIRESTORE_DB, 'priceHistory'), {
      ...newPrices,
      effective_from: formattedDate,
      effective_to: null
    } as BaristaSales);
  } catch (error) {
    console.error('Error updating prices:', error);
  }
};