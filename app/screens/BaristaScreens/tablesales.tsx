import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { TableSales } from "../../models/tables";
import { addOrUpdateTableInFirestore, subscribeToTableChanges, deleteTableFromFirestore, getTableSalesByNumber } from '../../services/FireStoreBaristaService'; // Adjust import path as necessary
import { RootStackParamList } from '../navigation/types';

interface CoffeeType {
  type: string;
  count: number;
}
type BaristaDetailsRouteProp = RouteProp<RootStackParamList, 'tablesales'>;
const coffeeTypes: CoffeeType[] = [
  { type: 'Direct', count: 0 },
  { type: 'Express', count: 0 },
  { type: 'Cappucin', count: 0 },
  { type: 'Water 0.5L', count: 0 },
  { type: 'Water 1L', count: 0 }
];

const CoffeeSales: React.FC = () => {
    const route = useRoute<BaristaDetailsRouteProp>();
    const { tablenumber } = route.params;
    const [sales, setSales] = useState<CoffeeType[]>(coffeeTypes);
    const [confirmedsales, setConfirmedSales] = useState<CoffeeType[]>(coffeeTypes); 
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [previousSales, setPreviousSales] = useState<CoffeeType[]>(coffeeTypes);
    const [tables, setTables] = useState<TableSales[]>([]);
    const tableNumber = tablenumber; 

    useEffect(() => {
        const fetchSales = async () => {
            try {
                console.log("Fetching sales for table number:", tableNumber);
                const tableData = await getTableSalesByNumber(tableNumber);
                if (tableData && Array.isArray(tableData.sales) && tableData.sales.length === 0) {
                    setSales(coffeeTypes);
                } else if (tableData && tableData.sales) {
                    const mappedSales: CoffeeType[] = coffeeTypes.map(coffeeType => {
                        const matchingSale = tableData.sales.find((sale: any) => sale.type === coffeeType.type);
                        return matchingSale ? { ...coffeeType, count: matchingSale.count } : coffeeType;
                    });
                    console.log("Mapped sales data:", mappedSales);
                    setSales(mappedSales);
                }
            } catch (error) {
                console.error('Error fetching table sales:', error);
            }
        };

        fetchSales();
    }, [tableNumber]);

    // Subscribe to table changes
    useEffect(() => {
        const unsubscribe = subscribeToTableChanges(FIRESTORE_DB, (tablesData) => {
            console.log("Tables data on change:", tablesData);
            setTables(tablesData);
            const currentTable = tablesData.find(table => table.tableNumber === tableNumber);
            if (currentTable) {
                console.log("Current table found:", currentTable);
                setConfirmed(currentTable.confirmed);
            } else {
                setConfirmed(false);
            }
        });

        return () => unsubscribe();
    }, [tableNumber]);

    const handleAdd = (type: string) => {
        setPreviousSales(sales);
        setSales(sales.map(item => item.type === type ? { ...item, count: item.count + 1 } : item));
    };

    const handleRemove = (type: string) => {
        setPreviousSales(sales);
        setSales(sales.map(item => item.type === type && item.count > 0 ? { ...item, count: item.count - 1 } : item));
    };

    const handleCancel = () => {
        setSales(coffeeTypes);
        setConfirmed(false);
    };


    const handleConfirm = async () => {
        try {
            const salesData = sales.filter(item => item.count > 0);
            let existingTable = tables.find(table => table.tableNumber === tableNumber);
            if (existingTable) {
                const tableData: Omit<TableSales, ''> = {
                    sales: salesData,
                    timestamp: new Date(),
                    confirmed: true,
                    status: 'Not paid',
                    tableNumber: tableNumber,
                    id: existingTable.id 
                };

                await addOrUpdateTableInFirestore(FIRESTORE_DB, tableData);
                setConfirmed(true);
            }
        } catch (error) {
            console.error("Error confirming sales: ", error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTableFromFirestore(FIRESTORE_DB, id);
            setConfirmed(false);
        } catch (error) {
            console.error("Error deleting table: ", error);
        }
    };

    const renderItem: ListRenderItem<CoffeeType> = ({ item }) => (
        <View style={styles.tableItem}>
            <Text style={[styles.tableNumber, styles.Gloriana]}>{item.type}</Text>
         
            <View style={styles.counter}>
                {!confirmed ? (
                    <>
                 
                        <TouchableOpacity onPress={() => handleRemove(item.type)} style={styles.button}>
                            <Text style={styles.buttonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.tableStatus}>{item.count}</Text>
                        <TouchableOpacity onPress={() => handleAdd(item.type)} style={styles.button}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.tableStatus}>{item.count}</Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={[styles.title, styles.Gloriana]}>Coffee Sales</Text>
            <Text style={[styles.title, styles.Gloriana]}>Table Number {tableNumber}</Text>
           
            <FlatList
                data={

                   sales
                }
                renderItem={renderItem}
                keyExtractor={(item) => item.type}
                contentContainerStyle={styles.tableList}
            />
           
              
              












            
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton} >
                <Text style={styles.confirmButtonText}>{confirmed ? "Confirmed" : "Confirm Sales"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          {/*   {tables.map((table) => (
                <View key={table.id} style={styles.tableList}>
                    <Text style={styles.tableNumber}>Table {table.tableNumber}</Text>
                    <Text style={styles.tableStatus}>Status: {table.status}</Text>
                    <TouchableOpacity onPress={() => handleDelete(table.id)} style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            ))} */}
        </View>
    );
};

const styles = StyleSheet.create({
    Gloriana: {
        fontFamily: 'Gloriana',
        fontSize: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8E71C',
        padding: 20,
    },
    title: {
        fontSize: 40,
        marginBottom: 20,
        color: '#000',
        fontFamily: 'Gloriana',
    },
    tableList: {
        marginBottom: 20,
    },
    tableItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
     cancelButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#FF3B30',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tableNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    tableStatus: {
        fontSize: 18,
        color: '#000',
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    confirmButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#000',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        borderRadius: 5,
        padding: 10,
    },
    deleteButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default CoffeeSales;
