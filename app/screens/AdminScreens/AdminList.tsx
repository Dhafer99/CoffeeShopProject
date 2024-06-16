import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { CommonActions, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';


interface RouterProps {
  navigation: NavigationProp<any, any>;
}


const AdminList = ({ navigation }: RouterProps) => {

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
     
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin List</Text>
      <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('AdminDetails')}>
        <Text style={styles.blackButtonText}>Servers Details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('Admin')}>
        <Text style={styles.blackButtonText}>Admin Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('addServers')}>
        <Text style={styles.blackButtonText}>Add a server</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('WorkdayList')}>
        <Text style={styles.blackButtonText}>Work days</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('AdminPrices')}>
        <Text style={styles.blackButtonText}>Admin Prices</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.whiteButton} onPress={handleSignOut}>
        <Text style={styles.whiteButtonText}>Logout</Text>
      </TouchableOpacity>

    </View>
  );
}

export default AdminList;
//make a better styling 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8E71C',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    fontFamily: 'Gloriana',
  },
  blackButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  blackButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Gloriana',
  },
  whiteButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  whiteButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Gloriana',
  },
});
