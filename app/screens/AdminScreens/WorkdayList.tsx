// src/components/WorkdayList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getWorkdays } from '../../services/FirestoreService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    WorkdayList: undefined;
    BaristaDetails: { workday: string };
  };
  
type WorkdayListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'WorkdayList'>;

const WorkdayList = () => {
  const [workdays, setWorkdays] = useState<string[]>([]);
  
  const navigation = useNavigation<WorkdayListNavigationProp>();
  useEffect(() => {
    fetchWorkdays();
  }, []);

  const fetchWorkdays = async () => {
    const days = await getWorkdays();
    setWorkdays(days);
  };

  const handleWorkdayPress = (workday: string) => {
    navigation.navigate('BaristaDetails', { workday });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workdays</Text>
      <FlatList
        data={workdays}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.workdayItem} onPress={() => handleWorkdayPress(item)}>
            <Text style={styles.workdayText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default WorkdayList;

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
  workdayItem: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  workdayText: {
    fontSize: 18,
    fontFamily: 'Gloriana',
  },
});
