import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Adjust the import path as needed
import { getBaristaSalesByEmail } from '../../services/FirestoreService'; // Adjust the import path as needed
import { BaristaSales as BaristaSalesType } from '../../models/baristasales'; // Adjust the import path as needed

type BaristaSalesRouteProp = RouteProp<RootStackParamList, 'BaristaSales'>;
type BaristaSalesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BaristaSales'>;

const BaristaSales = () => {
  const route = useRoute<BaristaSalesRouteProp>();
  const { email } = route.params;

  const [sales, setSales] = useState<BaristaSalesType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    const existingSales = await getBaristaSalesByEmail(email);
    if (existingSales) {
      setSales(existingSales);
    }
    setLoading(false);
  };

  const calculateTotalSales = (sales: BaristaSalesType) => {
    const prices = {
      cappucin: 1.5,
      express: 1.5,
      direct: 2,
      water_0_5L: 1,
      water_1L: 1.5,
      TheFusion: 1.5,
      Soda: 2.5,
      citron: 2.5,
      jusOrange: 3,
      cake: 1,
    };

    let total = 0;

    for (const key in sales) {
      if (key !== 'email' && prices[key as keyof typeof prices] !== undefined) {
        total += (sales[key as keyof BaristaSalesType] as number) * prices[key as keyof typeof prices];
      }
    }

    return total;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading sales data...</Text>
      </View>
    );
  }

  if (!sales) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No sales data found for {email}</Text>
      </View>
    );
  }

  const totalSales = calculateTotalSales(sales);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Data</Text>
      <View style={styles.salesContainer}>
        {Object.keys(sales).filter(key => key !== 'email').map((key) => (
          <View key={key} style={styles.salesItem}>
            <Text style={styles.label}>{key.replace('_', ' ')}:</Text>
            <Text style={styles.value}>{sales[key as keyof BaristaSalesType]}</Text>
          </View>
        ))}
        <View style={styles.salesItem}>
          <Text style={styles.label}>Total Sales:</Text>
          <Text style={styles.value}>{totalSales.toFixed(2)} DT</Text>
        </View>
      </View>
    </View>
  );
};

export default BaristaSales;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8E71C',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontFamily: 'Gloriana',
    textAlign: 'center',
  },
  salesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  salesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
    fontFamily: 'Gloriana',
  },
  value: {
    fontSize: 18,
  },
});