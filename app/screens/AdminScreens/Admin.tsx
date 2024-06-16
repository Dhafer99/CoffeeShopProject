import { useNavigation, useNavigationState } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminScreen = ({ navigation }: { navigation: any }) => {



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() =>
        navigation.navigate('AdminTodos', {name: 'Jane'})
      }>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.text}>Welcome, Admin!</Text>
    </View>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
});