// src/components/BaristaDetails.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { getBaristasByWorkday } from '../../services/FirestoreService';
import { User } from '../../models/user';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BaristaDetailsRouteProp = RouteProp<RootStackParamList, 'BaristaDetails'>;
type BaristaDetailsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BaristaDetails'>;

const BaristaDetails = () => {
  const route = useRoute<BaristaDetailsRouteProp>();
  const { workday } = route.params;
  const [baristas, setBaristas] = useState<User[]>([]);
  const navigation = useNavigation<BaristaDetailsNavigationProp>();

  useEffect(() => {
    fetchBaristas();
  }, []);

  const fetchBaristas = async () => {
    const baristaList = await getBaristasByWorkday(workday);
    setBaristas(baristaList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baristas for {workday}</Text>
      <FlatList
        data={baristas}
        keyExtractor={(item) => item.email!}
        renderItem={({ item }) => (
          <View style={styles.baristaItem}>
            <Text style={styles.baristaText}>Name: {item.Name}</Text>
            <Text style={styles.baristaText}>Email: {item.email}</Text>
            <Button
              title="View Sales"
              onPress={() => navigation.navigate('BaristaSales', { email: item.email! })}
            />
          </View>
        )}
      />
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Stats</Text>
        {/* Add your stats components or elements here */}
      </View>
    </View>
  );
};

export default BaristaDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8E71C',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    fontFamily: 'Gloriana',
    textAlign: 'center',
  },
  baristaItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
  },
  baristaText: {
    fontSize: 18,
    fontFamily: 'Gloriana',
  },
  statsContainer: {
    marginTop: 20,
    // Add styles for your stats container
  },
  statsTitle: {
    fontSize: 24,
    fontFamily: 'Gloriana',
    textAlign: 'center',
  },
});
