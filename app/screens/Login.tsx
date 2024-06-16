import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react'
import { FIREBASE_APP, FIREBASE_AUTH,FIRESTORE_DB } from '../../FirebaseConfig';
import { signInWithCredential, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';

type User ={
    id : string,
    displayName : string ,
    email: string,
    isAdmin: boolean ,
    uid: string 
}

  

const Login = () => {


    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [loading,setLoading] = useState(false);

    const [users,setUsers] = useState<Array<User>>([])

    const auth = FIREBASE_AUTH;

 

   
   

    const handleLogin = async () => {
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth,email,password)
            const user = userCredential.user;
          
            const usersCollection = collection(FIRESTORE_DB, 'Users');
            const usersQuery = query(usersCollection);
            const querySnapshot= await getDocs(usersQuery);
            console.log(querySnapshot)
            const fetchedData : Array<User> = [];
            querySnapshot.forEach((doc)=> {

                fetchedData.push({ id: doc.id, ...doc.data()} as User)

            })
            setUsers(fetchedData) ;  
            console.log("TABLLLLLLLLLLLLLLLLLLLLLLLLLLLEEEE")     
            console.log(fetchedData);

            const loggeduser = fetchedData.find((item) => item.isAdmin == true && user.uid == item.uid)
            if(loggeduser){
                console.log("adminConnected");
            }else
            {
                console.log("normal user connected")
            }
            } catch (error) {
              console.error('Error signing in:', error);
            } finally {
              setLoading(false);
            }
       
    };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/BrothersLogo.jpg')} style={styles.logo} />
      <Text style={styles.title}>Brother's CoffeeShop</Text>
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" keyboardType="email-address" onChangeText={(text) => setEmail(text)}/>
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry onChangeText={(text) => setPassword(text)}/>
      <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
      {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <Text style={styles.buttonText} >Login</Text>
                )}
      </TouchableOpacity>
      
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    Gloriana: {
        fontFamily: 'Gloriana',
        fontSize: 20,
      },
    container: {
      flex: 1,
      backgroundColor: '#F8E71C',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    logo: {
      width: 200,
      height: 150,
      marginBottom: 20,
      borderRadius: 20, // Added borderRadius to make the image borders rounded
    },
    title: {
      fontSize: 40,
     
      marginBottom: 40,
      fontFamily: 'Gloriana', // Apply the Gloriana font here
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
  });