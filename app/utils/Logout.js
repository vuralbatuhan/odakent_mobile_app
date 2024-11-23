import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const logout = async (navigation) => {
  try {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');

    navigation.navigate('Room');
  } catch (error) {
    console.error('Çıkış yaparken hata oluştu:', error);
    Alert.alert('Hata', 'Bir hata oluştu, çıkış yapılamadı.');
  }
};
