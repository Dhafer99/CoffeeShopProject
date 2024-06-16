import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AdminDetails = () => {
  const [coffees, setCoffees] = useState([
    { name: 'Espresso', price: 2.5, quantity: 0 },
    { name: 'Latte', price: 3.0, quantity: 0 },
    { name: 'Cappuccino', price: 3.5, quantity: 0 },
    // Add more coffee items as needed
  ]);

  const incrementQuantity = (index:any) => {
    const newCoffees = [...coffees];
    newCoffees[index].quantity++;
    setCoffees(newCoffees);
  };

  const calculateTotalPrice = () => {
    return coffees.reduce((total, coffee) => total + coffee.quantity * coffee.price, 0);
  };

  return (
    <View style={styles.container}>
      {coffees.map((coffee, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.text}>{coffee.name}</Text>
          <Text style={styles.text}>{coffee.price}$</Text>
          <TouchableOpacity onPress={() => incrementQuantity(index)}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
          <Text style={styles.text}>{coffee.quantity}</Text>
        </View>
      ))}
      <View style={styles.row}>
        <Text style={styles.text}>Total:</Text>
        <Text style={styles.text}>{calculateTotalPrice()}$</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    color: 'yellow',
    fontSize: 18,
  },
  plus: {
    color: 'yellow',
    fontSize: 20,
    marginLeft: 10,
  },
});

export default AdminDetails;
