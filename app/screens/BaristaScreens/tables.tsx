import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import { TableSales as Table } from '../../models/tables';
import { addOrUpdateTableInFirestore, subscribeToTableChanges, deleteTableFromFirestore } from '../../services/FireStoreBaristaService';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TableSalesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'tables'>;

const Tables: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableNumber, setNewTableNumber] = useState<string>('');
  const [newTableStatus, setNewTableStatus] = useState<string>('Not Paid');
  const navigation = useNavigation<TableSalesNavigationProp>();

  useEffect(() => {
    const unsubscribe = subscribeToTableChanges(FIRESTORE_DB, setTables);
    return () => unsubscribe();
  }, []);

  const addTable = async () => {
    try {
      await addOrUpdateTableInFirestore(FIRESTORE_DB, {
        id :'',
      status: newTableStatus,
    tableNumber: parseInt(newTableNumber), // Assuming newTableNumber is a string
    sales: [],
    timestamp: new Date(),
    confirmed: false
      });
      setNewTableNumber('');
      setNewTableStatus('Not Paid');
    } catch (error) {
      console.error('Error adding table: ', error);
    }
  };

  const deleteTable = async (id: string) => {
    try {
      await deleteTableFromFirestore(FIRESTORE_DB, id);
    } catch (error) {
      console.error('Error deleting table: ', error);
    }
  };

  const goToAnotherComponent = (tablenumber:number) => {
    navigation.navigate('tablesales', { tablenumber });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.Gloriana]}>Tables</Text>
      <View style={styles.tableList}>
        {tables.map(table => (
          <View key={table.id} style={styles.tableItem}>
            <Text style={styles.tableNumber}>Table {table.tableNumber}</Text>
            <Text style={styles.tableStatus}>{table.status}</Text>

            <TouchableOpacity style={styles.navButton} onPress={() => goToAnotherComponent(table.tableNumber)}>
              <Text style={styles.navButtonText}>Table Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTable(table.id)}>
              <Text style={styles.deleteButtonText}>Table Paid</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Table Number"
        value={newTableNumber}
        onChangeText={text => setNewTableNumber(text)}
      />
      <TouchableOpacity style={styles.button} onPress={addTable}>
        <Text style={styles.buttonText}>Add Table</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Tables;

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
    tableNumber: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    tableStatus: {
      fontSize: 18,
    },
    input: {
      width: '100%',
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 25,
      paddingHorizontal: 20,
      fontSize: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#000',
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#000',
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    navButton: {
      backgroundColor: '#007AFF',
      borderRadius: 5,
      padding: 10,
    },
    navButtonText: {
      color: '#FFF',
      fontSize: 16,
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