import { StyleSheet } from 'react-native';
import { Main } from './pages/main';
import { Detail } from './pages/detail'
import { Payment } from './pages/payment'
import {List} from './pages/list'
import {User} from './pages/user'

import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Main} />
        <Stack.Screen name="List" component={List} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="Payment" component={Payment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
