import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { getPrices, updatePrices } from '../../services/FirestoreService';

interface Prices {
  cappucin: string;
  express: string;
  direct: string;
  water_0_5L: string;
  water_1L: string;
  TheFusion: string;
  Soda: string;
  citron: string;
  jusOrange: string;
  cake: string;
}

const AdminPrices = () => {
  const [prices, setPrices] = useState<Prices>({
    cappucin: '',
    express: '',
    direct: '',
    water_0_5L: '',
    water_1L: '',
    TheFusion: '',
    Soda: '',
    citron: '',
    jusOrange: '',
    cake: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const fetchedPrices = await getPrices();
      if (fetchedPrices) {
        setPrices({
          cappucin: fetchedPrices.cappucin || '',
          express: fetchedPrices.express || '',
          direct: fetchedPrices.direct || '',
          water_0_5L: fetchedPrices.water_0_5L || '',
          water_1L: fetchedPrices.water_1L || '',
          TheFusion: fetchedPrices.TheFusion || '',
          Soda: fetchedPrices.Soda || '',
          citron: fetchedPrices.citron || '',
          jusOrange: fetchedPrices.jusOrange || '',
          cake: fetchedPrices.cake || '',
        });
      } else {
        Alert.alert('Error', 'Failed to fetch prices');
      }
    } catch (error) {
      console.error('Error fetching prices: ', error);
      Alert.alert('Error', 'Failed to fetch prices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: keyof Prices, value: string) => {
    setPrices({ ...prices, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await updatePrices(prices);
      Alert.alert('Success', 'Prices updated successfully');
    } catch (error) {
      console.error('Error updating prices: ', error);
      Alert.alert('Error', 'Failed to update prices');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Set Product Prices</Text>
        {Object.keys(prices).map((key) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{key.replace('_', ' ')}:</Text>
            <TextInput
              style={styles.input}
              value={prices[key as keyof Prices]}
              onChangeText={(value) => handleChange(key as keyof Prices, value)}
              keyboardType="numeric"
            />
          </View>
        ))}
        <Button title="Update Prices" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default AdminPrices;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8E71C',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});