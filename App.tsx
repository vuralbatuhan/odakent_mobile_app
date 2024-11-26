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
const socket = io.connect('http://192.168.1.36:5000');

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
