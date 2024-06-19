import { collection, addDoc, onSnapshot, Firestore, doc, deleteDoc, updateDoc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../../FirebaseConfig";


import { TableSales } from "../models/tables";
export const addOrUpdateTableInFirestore = async (db: Firestore, tableData: Omit<TableSales, ''>): Promise<string> => {
    try {
        const { tableNumber, ...tableDataWithoutNumber } = tableData;

        // Check if the table already exists
        const tablesCollection = collection(db, "tablescoffee");
        const q = query(tablesCollection, where("tableNumber", "==", tableNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update the existing table
            const tableDoc = querySnapshot.docs[0].ref;
            await updateDoc(tableDoc, tableDataWithoutNumber);
            console.log("Table updated with ID: ", tableDoc.id);
            return tableDoc.id;
        } else {
            // Add a new table
            const docRef = await addDoc(tablesCollection, { ...tableDataWithoutNumber, tableNumber });
            console.log("Table added with ID: ", docRef.id);

            // Update the table document with the generated ID
            await updateDoc(docRef, { id: docRef.id });

            return docRef.id;
        }
    } catch (error) {
        console.error("Error adding/updating table: ", error);
        throw error;
    }
};
  // Function to subscribe to table changes in Firestore
  export const subscribeToTableChanges = (db: Firestore, callback: (tables: TableSales[]) => void) => {
    return onSnapshot(collection(db, "tablescoffee"), (snapshot) => {
      const tablesData: TableSales[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TableSales));
      callback(tablesData);
    });
  };
  
  // Function to delete a table from Firestore
  export const deleteTableFromFirestore = async (db: Firestore, id: string): Promise<void> => {
    try {
      const tableDocRef = doc(collection(db, 'tablescoffee'), id);
      await deleteDoc(tableDocRef);
      console.log(`Table with id ${id} successfully deleted.`);
    } catch (error) {
      console.error('Error deleting table: ', error);
      throw error;
    }
  };
  
// Function to add a coffee sale to Firestore
export const addCoffeeSaleToFirestore = async (db: Firestore, saleData: Omit<TableSales, 'id'>): Promise<string> => {
    try {
      // Add the coffee sale to Firestore
      const docRef = await addDoc(collection(db, "tablescoffee"), saleData);
      console.log("Coffee sale added with ID: ", docRef.id);
  
      // Update the sale document with the generated ID
      await updateDoc(docRef, { id: docRef.id });
  
      return docRef.id;
    } catch (error) {
      console.error("Error adding coffee sale: ", error);
      throw error;
    }
  };
  
  // Function to subscribe to coffee sales changes in Firestore
  export const subscribeToCoffeeSalesChanges = (db: Firestore, callback: (sales: TableSales[]) => void) => {
    return onSnapshot(collection(db, "tablescoffee"), (snapshot) => {
      const salesData: TableSales[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as TableSales));
      callback(salesData);
    });
  };
  
  // Function to delete a coffee sale from Firestore
  export const deleteCoffeeSaleFromFirestore = async (db: Firestore, id: string): Promise<void> => {
    try {
      const saleDocRef = doc(collection(db, 'tablescoffee'), id);
      await deleteDoc(saleDocRef);
      console.log(`Coffee sale with id ${id} successfully deleted.`);
    } catch (error) {
      console.error('Error deleting coffee sale: ', error);
      throw error;
    }
  };

  // Function to delete a table from Firestore and its corresponding coffee table
export const deleteTableAndRelatedCoffeeTable = async (db: Firestore, id: string): Promise<void> => {
    try {
      // Reference to the table document
      const tableDocRef = doc(collection(db, 'tables'), id);
      
      // Get the table document
      const tableDoc = await getDoc(tableDocRef);
      if (!tableDoc.exists()) {
        throw new Error(`Table with id ${id} does not exist.`);
      }
  
      // Assuming there is a field in the table document that holds the ID for the corresponding coffee table
      const coffeeTableId = tableDoc.data().coffeeTableId;
      
      if (!coffeeTableId) {
        throw new Error(`No corresponding coffee table ID found for table with id ${id}.`);
      }
  
      // Reference to the coffee table document
      const coffeeTableQuery = query(collection(db, 'tablescoffee'), where('id', '==', coffeeTableId));
      const coffeeTableQuerySnapshot = await getDocs(coffeeTableQuery);
  
      // Delete the coffee table document
      if (!coffeeTableQuerySnapshot.empty) {
        coffeeTableQuerySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log(`Coffee table with id ${doc.id} successfully deleted.`);
        });
      } else {
        throw new Error(`No corresponding coffee table found with id ${coffeeTableId}.`);
      }
  
      // Delete the table document
      await deleteDoc(tableDocRef);
      console.log(`Table with id ${id} successfully deleted.`);
    } catch (error) {
      console.error('Error deleting table and related coffee table: ', error);
      throw error;
    }
  };

  export const getTableSalesByNumber = async (tableNumber: number): Promise<TableSales | null> => {
    try {
      const q = query(collection(FIRESTORE_DB, 'tablescoffee'), where('tableNumber', '==', tableNumber));
      const querySnapshot = await getDocs(q);
      const sales = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TableSales[];
      console.log("Fetched sales:", sales);
      return sales.length > 0 ? sales[0] : null;
    } catch (error) {
      console.error("Error fetching sales:", error);
      return null;
    }
  };