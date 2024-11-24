import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Alert} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import path from 'react-native-path';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Kamera İzni',
        message: 'Bu uygulama kamera erişimi gerektiriyor.',
        buttonNeutral: 'İptal',
        buttonNegative: 'Hayır',
        buttonPositive: 'Tamam',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const byteaToHex = byteaData => {
  const hexString = byteaData.toString('hex');
  return hexString;
};

const uriToBytea = async fileUri => {
  try {
    const fileData = await RNFS.readFile(fileUri, 'base64');
    const byteaData = Buffer.from(fileData, 'base64');
    const hexString = byteaToHex(byteaData);
    return hexString;
  } catch (error) {
    console.error('Dosya okuma hatası:', error);
  }
};

const getFileExtension = fileUri => {
  const extension = path.extname(fileUri);
  return extension;
};

export const pickFile = async (setFileUri, task_id) => {
  Alert.alert('Seçiniz', 'Eklemek istediğiniz dosyayı seçin:', [
    {
      text: 'Dosya (PDF, Word)',
      onPress: async () => {
        const result = await launchImageLibrary({
          includeBase64: false,
          selectionLimit: 1,
          quality: 0.8,
          maxWidth: 100,
          maxHeight: 100,
          mediaType: 'mixed',
        });

        if (result.didCancel) {
          console.log('User canceled file picker');
        } else if (result.errorCode) {
          console.log('Error: ', result.errorMessage);
        } else {
          const uri = result.assets[0].uri;
          setFileUri(uri);
          const extension = getFileExtension(uri);
          const byteaData = await uriToBytea(uri);
          byteaData;
          await sendToDocuments(byteaData, extension, task_id);
        }
      },
    },
    {
      text: 'Kamera (Fotoğraf veya Video)',
      onPress: async () => {
        const hasCameraPermission = await requestCameraPermission();
        if (!hasCameraPermission) {
          Alert.alert('Kamera izni verilmedi!');
          return;
        }

        const result = await launchCamera({
          mediaType: 'mixed',
          cameraType: 'back',
          includeBase64: false,
          quality: 0.8,
          maxWidth: 100,
          maxHeight: 100,
        });

        if (result.didCancel) {
          console.log('User canceled camera');
        } else if (result.errorCode) {
          console.log('Error: ', result.errorMessage);
        } else {
          const uri = result.assets[0].uri;
          setFileUri(uri);
          const extension = getFileExtension(uri);
          const byteaData = await uriToBytea(uri);
          byteaData;
          await sendToDocuments(byteaData, extension, task_id);
        }
      },
    },
    {
      text: 'İptal',
      style: 'cancel',
    },
  ]);
};

export const pickFileMessages = async (
  setFileUri,
  room,
  room_id,
  username,
  task_id,
) => {
  Alert.alert('Seçiniz', 'Eklemek istediğiniz dosyayı seçin:', [
    {
      text: 'Dosya (PDF, Word)',
      onPress: async () => {
        const result = await launchImageLibrary({
          includeBase64: false,
          selectionLimit: 1,
          quality: 0.8,
          maxWidth: 100,
          maxHeight: 100,
          mediaType: 'mixed',
        });

        if (result.didCancel) {
          console.log('User canceled file picker');
        } else if (result.errorCode) {
          console.log('Error: ', result.errorMessage);
        } else {
          const uri = result.assets[0].uri;
          setFileUri(uri);
          const extension = getFileExtension(uri);
          const byteaData = await uriToBytea(uri);
          byteaData;
          await sendToDocuments(byteaData, extension, task_id);
          await sendToMessages(room, room_id, username, byteaData, task_id);
        }
      },
    },
    {
      text: 'Kamera (Fotoğraf veya Video)',
      onPress: async () => {
        const hasCameraPermission = await requestCameraPermission();
        if (!hasCameraPermission) {
          Alert.alert('Kamera izni verilmedi!');
          return;
        }

        const result = await launchCamera({
          mediaType: 'mixed',
          cameraType: 'back',
          includeBase64: false,
          quality: 0.8,
          maxWidth: 100,
          maxHeight: 100,
        });

        if (result.didCancel) {
          console.log('User canceled camera');
        } else if (result.errorCode) {
          console.log('Error: ', result.errorMessage);
        } else {
          const uri = result.assets[0].uri;
          setFileUri(uri);
          const extension = getFileExtension(uri);
          const byteaData = await uriToBytea(uri);
          byteaData;
          await sendToDocuments(byteaData, extension, task_id);
          await sendToMessages(room, room_id, username, byteaData, task_id);
        }
      },
    },
    {
      text: 'İptal',
      style: 'cancel',
    },
  ]);
};

const sendToDocuments = async (byteaData, extension, task_id) => {
  const hexData = byteaData.toString('hex');
  const formattedData = `\\x${hexData}`;

  try {
    const response = await fetch('http://192.168.1.124:5000/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_id: task_id,
        dosya: formattedData,
        ext: extension,
      }),
    });

    const result = await response.json();
    if (result.success) {
      Alert.alert('Başarı', 'Dosya başarıyla yüklendi!');
    } else {
      Alert.alert('Hata', result.message);
    }
  } catch (error) {
    console.error('Backend bağlantı hatası:', error);
    Alert.alert('Hata', 'Bir hata oluştu.');
  }
};
const sendToMessages = async (room, room_id, username, image, task_id) => {
  const hexData = image.toString('hex');
  const formattedData = `\\x${hexData}`;
  try {
    const response = await fetch('http://192.168.1.124:5000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        room: room,
        room_id: room_id,
        username: username,
        image: formattedData,
        task_id: task_id,
      }),
    });

    const result = await response.json();
    if (result.success) {
      Alert.alert('Başarı', 'Dosya başarıyla yüklendi!');
    } else {
      Alert.alert('Hata', result.message);
    }
  } catch (error) {
    console.error('Backend bağlantı hatası:', error);
    Alert.alert('Hata', 'Bir hata oluştu.');
  }
};
