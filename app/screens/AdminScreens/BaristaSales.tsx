import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { getBaristaSalesByEmail, getPrices } from '../../services/FirestoreService';
import { BaristaSales as BaristaSalesType } from '../../models/baristasales';

type BaristaSalesRouteProp = RouteProp<RootStackParamList, 'BaristaSales'>;
type BaristaSalesNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BaristaSales'>;

interface Prices {
    capuccin: number;
    express: number;
    direct: number;
    water_0_5L: number;
    water_1L: number;
    TheFusion: number;
    Soda: number;
    citron: number;
    jusOrange: number;
    cake: number;
    }

const BaristaSales = () => {
  const route = useRoute<BaristaSalesRouteProp>();
  const { email } = route.params;

  const [sales, setSales] = useState<BaristaSalesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Partial<Prices>>({});
  const [totalSales, setTotalSales] = useState<number | null>(null);

  useEffect(() => {
    fetchSales();
    fetchPrices();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    const existingSales = await getBaristaSalesByEmail(email);
    if (existingSales) {
      setSales(existingSales);
    }
    setLoading(false);
  };

  const fetchPrices = async () => {
    const fetchedPrices = await getPrices();
    if (fetchedPrices) {
      setPrices(fetchedPrices);
    }
  };

  useEffect(() => {
    if (sales && prices) {
      calculateTotalSales(sales);
    }
  }, [sales, prices]);

  const calculateTotalSales = (sales: BaristaSalesType) => {
    let total = 0;
    for (const key in sales) {
      if (prices[key as keyof Prices] !== undefined) {
        total += (sales[key as keyof BaristaSalesType] as number) * (prices[key as keyof Prices] as number);
      }
    }
    setTotalSales(total);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        {totalSales !== null && (
          <View style={styles.salesItem}>
            <Text style={styles.label}>Total Sales:</Text>
            <Text style={styles.value}>{totalSales} DT</Text>
          </View>
        )}
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
