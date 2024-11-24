// import React, {useState, useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {ActivityIndicator, View} from 'react-native';

// // Bileşenler
// import {Register} from './src/pages/Register';
// import {Login} from './src/pages/Login';
// import {Home} from './src/pages/Home';
// import {JoinGroup} from './src/pages/JoinGroup';
// import {CreateGroup} from './src/pages/CreateGroup';
// import Chat from './src/pages/Chat/Chat';

// const Stack = createNativeStackNavigator();

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<null | boolean>(null); // Başlangıçta null, böylece yükleme durumu gösterilebilir

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         setIsLoggedIn(!!token); // Token varsa true, yoksa false
//       } catch (error) {
//         console.error('Kullanıcı durumu kontrol edilemedi:', error);
//         setIsLoggedIn(false); // Hata durumunda login ekranına yönlendir
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   // Yükleme sırasında bir indikatör göster
//   if (isLoggedIn === null) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName={isLoggedIn ? 'Home' : 'Login'}
//         screenOptions={{headerShown: false}}>
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="Register" component={Register} />
//         <Stack.Screen name="Home" component={Home} />
//         <Stack.Screen name="JoinGroup" component={JoinGroup} />
//         <Stack.Screen name="CreateGroup" component={CreateGroup} />
//         <Stack.Screen name="Chat" component={Chat} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;
import React, { useState } from 'react';
import Room from './app/screens/Room';
import Task from './app/screens/Task';
import Detail from './app/screens/Detail';
import AdminTask from './app/screens/AdminTask';
import AdminPanel from './app/screens/AdminPanel';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import io from 'socket.io-client';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
const socket = io.connect('http://192.168.1.124:5000');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [userType, setUserType] = useState('');

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Room">
        <Stack.Screen name="Room" options={{ headerShown: false }}>
          {(props) => (
            <Room
              {...props}
              username={username}
              room={room}
              setUsername={setUsername}
              setRoom={setRoom}
              socket={socket}
              userType={userType}
              setUserType={setUserType}
              onJoin={() => {
                props.navigation.navigate('ChatTask');
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AdminTask" options={{ headerShown: false }}>
          {(props) => (
            <AdminTask
              {...props}
              username={username}
              room={room}
              userType={userType}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AdminPanel" options={{ headerShown: false }}>
          {(props) => (
            <AdminPanel
              {...props}
              username={username}
              room={room}
              userType={userType}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Task" options={{ headerShown: false }}>
          {(props) => (
            <Task
              {...props}
              username={username}
              room={room}
              userType={userType}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Detail">
          {(props) => (
            <Detail
              {...props}
              socket={socket}
              username={username}
              room={room}
              userType={userType}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
