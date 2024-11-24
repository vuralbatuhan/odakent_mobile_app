//192.168.1.124:5000
//192.168.1.36:-5000
//192.168.1.124:5000
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {TextInput} from 'react-native-element-textinput';
import styles from '../css/RoomStyle';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Room = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearAll = async () => {
    setUsername('');
    setPassword('');
    setIsChecked(false);
  };

  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPassword = await AsyncStorage.getItem('password');
        const isCheckedStored = await AsyncStorage.getItem('isChecked');

        if (storedUsername && storedPassword && isCheckedStored === 'true') {
          const response = await fetch(
            `http://192.168.1.124:5000/users/${storedUsername}/${storedPassword}`,
            {
              method: 'GET',
              headers: {'Content-Type': 'application/json'},
            },
          );
          const data = await response.json();
          if (data.user_type_id === 0) {
            navigation.replace('AdminTask', {
              username: storedUsername,
              isChecked: true,
            });
          } else {
            navigation.replace('Task', {
              username: storedUsername,
              isChecked: true,
            });
          }
        } else {
          setIsLoading(false); // Kullanıcı daha önce giriş yapmamışsa
        }
      } catch (error) {
        console.error('Error reading stored credentials:', error);
        setIsLoading(false); // Hata olursa login ekranını göster
      }
    };

    checkStoredCredentials();
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const sendRoom = async () => {
    if (username.trim() === '') {
      Alert.alert('Uyarı', 'Lütfen adınızı girin.');
      return;
    }
    if (password.trim() === '') {
      Alert.alert('Uyarı', 'Lütfen şifrenizi girin.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.124:5000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
      });

      const data = await response.json();
      if (data.success) {
        if (isChecked) {
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
          await AsyncStorage.setItem('isChecked', 'true');
        } else {
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('password');
          await AsyncStorage.removeItem('isChecked');
        }

        const userResponse = await fetch(
          `http://192.168.1.124:5000/users/${username}/${password}`,
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
          },
        );
        const userData = await userResponse.json();
        if (userData.user_type_id === 0) {
          navigation.replace('AdminTask', {
            username: username,
            isChecked: isChecked,
          });
          clearAll();
        } else {
          navigation.replace('Task', {
            username: username,
            isChecked: isChecked,
          });
          clearAll();
        }
      } else {
        Alert.alert('Hata', 'Giriş bilgileri hatalı.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Hata', 'Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  // Eğer isLoading true ise sadece loading göstergesi render edilir
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          value={username}
          style={styles.input}
          inputStyle={styles.inputStyle}
          labelStyle={styles.labelStyle}
          placeholderStyle={styles.placeholderStyle}
          textErrorStyle={styles.textErrorStyle}
          label="Kullanıcı Adı"
          focusColor="black"
          onChangeText={text => setUsername(text)}
          clearButtonMode="never"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            style={styles.input}
            inputStyle={styles.inputStyle}
            labelStyle={styles.labelStyle}
            placeholderStyle={styles.placeholderStyle}
            textErrorStyle={styles.textErrorStyle}
            label="Şifre"
            focusColor="black"
            secureTextEntry={!isPasswordVisible}
            onChangeText={text => setPassword(text)}
            clearButtonMode="never"
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}>
            {/* <Ionicons
              name={isPasswordVisible ? 'user' : 'coffee'}
              color="#ff0000"
              size={20}
            /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            size={20}
            fillColor={isChecked ? '#000000' : '#C0C0C0'}
            unfillColor="#FFFFFF"
            iconStyle={{
              borderColor: isChecked ? '#000000' : '#C0C0C0',
              borderRadius: 0,
            }}
            innerIconStyle={{borderWidth: 2, borderRadius: 0}}
            textStyle={[
              styles.checkboxText,
              {
                color: isChecked ? '#000000' : '#C0C0C0',
                textDecorationLine: 'none',
              },
            ]}
            text="Beni Unutma"
            isChecked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={sendRoom}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Room;
