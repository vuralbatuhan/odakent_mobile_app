// import {launchImageLibrary} from 'react-native-image-picker';
// import {Alert} from 'react-native';
// import RNFS from 'react-native-fs';
// import {Buffer} from 'buffer';
// import path from 'react-native-path'; // path modülünü ekleyin

// // Dosya seçme fonksiyonu
// export const pickFile = async (setFileUri, statu_id) => {
//   Alert.alert('Seçiniz', 'Eklemek istediğiniz dosyayı seçin:', [
//     {
//       text: 'Dosya (PDF, Word)',
//       onPress: async () => {
//         const result = await launchImageLibrary({
//           includeBase64: false,
//           selectionLimit: 1,
//           quality: 0.1,
//           maxWidth: 100,
//           maxHeight: 100,
//           mediaType: 'mixed',
//         });

//         if (result.didCancel) {
//           console.log('User canceled file picker');
//         } else if (result.errorCode) {
//           console.log('Error: ', result.errorMessage);
//         } else {
//           const uri = result.assets[0].uri;
//           setFileUri(uri);

//           // Dosya uzantısını al
//           const extension = getFileExtension(uri);

//           // Dosya verisini Base64'e çevir
//           const byteaData = await uriToBytea(uri);

//           // Backend'e gönderme işlemi
//           await sendToBackend(byteaData, extension, statu_id);
//         }
//       },
//     },
//     {
//       text: 'İptal',
//       style: 'cancel',
//     },
//   ]);
// };

// // Dosya uzantısını elde etme fonksiyonu
// const getFileExtension = fileUri => {
//   const extension = path.extname(fileUri);
//   console.log('Dosya uzantısı:', extension);
//   return extension;
// };

// // Base64'e dönüştürme fonksiyonu
// const uriToBytea = async fileUri => {
//   try {
//     const fileData = await RNFS.readFile(fileUri, 'base64');
//     const byteaData = Buffer.from(fileData, 'base64');
//     console.log(byteaData);
//     return byteaData;
//   } catch (error) {
//     console.error('Dosya okuma hatası:', error);
//   }
// };

// // Backend'e veriyi gönderme fonksiyonu
// const sendToBackend = async (byteaData, extension, statu_id) => {
//   const hexData = byteaData.toString('hex');
//   const formattedData = `\\x${hexData}`;

//   try {
//     const response = await fetch('http://192.168.1.36:5000/messages', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         task_id: statu_id,
//         dosya: formattedData, // Base64 verisi
//         ext: extension, // Dosya uzantısı
//       }),
//     });

//     const result = await response.json();
//     if (result.success) {
//       Alert.alert('Başarı', 'Dosya başarıyla yüklendi!');
//     } else {
//       Alert.alert('Hata', result.message);
//     }
//   } catch (error) {
//     console.error('Backend bağlantı hatası:', error);
//     Alert.alert('Hata', 'Bir hata oluştu.');
//   }
// };
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
    console.log('Hex String:', hexString);
    return hexString;
  } catch (error) {
    console.error('Dosya okuma hatası:', error);
  }
};

const getFileExtension = fileUri => {
  const extension = path.extname(fileUri);
  console.log('Dosya uzantısı:', extension);
  return extension;
};

export const pickFile = async (setFileUri, statu_id) => {
  Alert.alert('Seçiniz', 'Eklemek istediğiniz dosyayı seçin:', [
    {
      text: 'Dosya (PDF, Word)',
      onPress: async () => {
        const result = await launchImageLibrary({
          includeBase64: false,
          selectionLimit: 1,
          quality: 0.1,
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

          console.log('Veritabanına kaydedilecek dosya uzantısı:', extension);

          const byteaData = await uriToBytea(uri);
          byteaData;
          await sendToBackend(byteaData, extension, statu_id);
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
          quality: 0.1,
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

          console.log('Veritabanına kaydedilecek dosya uzantısı:', extension);

          const byteaData = await uriToBytea(uri);
          byteaData;
          await sendToBackend(byteaData, extension, statu_id);
        }
      },
    },
    {
      text: 'İptal',
      style: 'cancel',
    },
  ]);
};
const sendToBackend = async (byteaData, extension, statu_id) => {
  const hexData = byteaData.toString('hex');
  const formattedData = `\\x${hexData}`;
  console.log(formattedData);

  try {
    const response = await fetch('http://192.168.1.36:5000/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_id: statu_id,
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
