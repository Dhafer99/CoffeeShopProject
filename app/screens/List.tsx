import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { CommonActions, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}


const List = ({ navigation }: RouterProps) => {

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Replace 'login' with the name of your target screen after logout
        })
      );
      
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>List</Text>
      <TouchableOpacity style={styles.blackButton} onPress={() => navigation.navigate('details')}>
        <Text style={styles.blackButtonText}>Details</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.whiteButton} onPress={handleSignOut}>
        <Text style={styles.whiteButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default List;

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
