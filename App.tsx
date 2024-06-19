import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import Login from './app/screens/Login';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import Details from './app/screens/Details';
import List from './app/screens/List';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';
import AdminScreen from './app/screens/AdminScreens/Admin';
import { fetchUserDataByUid } from './app/services/FirestoreService';
import AdminList from './app/screens/AdminScreens/AdminList';
import AdminDetails from './app/screens/AdminScreens/AdminDetails';
import addBaristas from './app/screens/AdminScreens/AddServers';
import WorkdayList from './app/screens/AdminScreens/WorkdayList';
import BaristaDetails from './app/screens/AdminScreens/BaristaDetails';
import BaristaSales from './app/screens/AdminScreens/BaristaSales';
import AdminPrices from './app/screens/AdminScreens/AdminPrices';
import tables from './app/screens/BaristaScreens/tables';
import tablesales from './app/screens/BaristaScreens/tablesales';

type RootStackParamList = {
  WorkdayList: undefined;
  BaristaDetails: { workday: string };
};

const Stack = createNativeStackNavigator();
const insideStack = createNativeStackNavigator();


function InsideLayout({ firestoreUser }: { firestoreUser: any }) {
  return (

    <insideStack.Navigator  initialRouteName='Admin'>
      {firestoreUser?.isAdmin ? (
          <>
        <insideStack.Screen name="Admin" component={AdminScreen} options={{ headerShown: false }}/>
        <insideStack.Screen name="AdminTodos" component={AdminList} options={{ headerShown: false }}/>
        <insideStack.Screen name="AdminDetails" component={AdminDetails} options={{ headerShown: false }}/>
        <insideStack.Screen name="addServers" component={addBaristas} options={{ headerShown: false }}/>
        <insideStack.Screen name="WorkdayList" component={WorkdayList} options={{ headerShown: false }}/>
        <insideStack.Screen name="BaristaDetails" component={BaristaDetails} options={{ headerShown: false }}/>
        <insideStack.Screen name="BaristaSales" component={BaristaSales} options={{ headerShown: false }}/>
        <insideStack.Screen name="AdminPrices" component={AdminPrices} options={{ headerShown: false }}/>
       
        
        </>
      ) : (
        <>
          <insideStack.Screen name="Todos" component={List} options={{ headerShown: false }}/>
          <insideStack.Screen name="tables" component={tables} options={{ headerShown: false }}/>
          <insideStack.Screen name="tablesales" component={tablesales} options={{ headerShown: false }}/>
        </>
      )}
    </insideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [firestoreUser, setFirestoreUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (authUser) => {
      if (authUser) {
        const userData = await fetchUserDataByUid(authUser.uid);
        setUser(authUser);
        setFirestoreUser(userData);
      } else {
        setUser(null);
        setFirestoreUser(null);
      }
      
      setLoading(false);
    });
    

    return () => unsubscribe();
  }, []);

  const [fontsLoaded] = useFonts({
    'Gloriana': require('./assets/fonts/Gloriana.ttf'),
  });

  if (loading || !fontsLoaded) {
    return null; // Optionally show a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name="Barista interface">
            {props => <InsideLayout {...props} firestoreUser={firestoreUser} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});