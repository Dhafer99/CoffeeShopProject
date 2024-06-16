import { View, Text,StyleSheet, TextInput, Button, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User } from '../../models/user';
import { addUser, deleteUser, getUsers } from '../../services/FirestoreService';

const addBaristas = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
      const userList = await getUsers();
      setUsers(userList);
    };
  
    const handleAddUser = async () => {
      if (Name && email) {
        await addUser({ Name, email });
        setName('');
        setEmail('');
        fetchUsers();
      } else {
        alert('Please fill out all fields.');
      }
    };
  
    const handleDeleteUser = async (id: string) => {
      await deleteUser(id);
      fetchUsers();
    };
  
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Admin User Management</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={Name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddUser}>
              <Text style={styles.buttonText}>Add User</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={users}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Text style={styles.userText}>Name: {item.Name}</Text>
                <Text style={styles.userText}>Email: {item.email}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item.id!)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      );
    };



export default addBaristas
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8E71C',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 40,
      marginBottom: 40,
      fontFamily: 'Gloriana', // Apply the Gloriana font here
    },
    form: {
      width: '100%',
      alignItems: 'center',
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
      marginTop: 20,
    },
    buttonText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Gloriana', // Apply the Gloriana font here
    },
    userItem: {
      width: '100%',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 10,
      alignItems: 'center',
    },
    userText: {
      fontSize: 18,
      fontFamily: 'Gloriana',
    },
    deleteButton: {
      marginTop: 10,
      backgroundColor: '#FF0000',
      padding: 10,
      borderRadius: 25,
    },
  });