import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Alert, Linking} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import path from 'react-native-path';
import DocumentPicker from 'react-native-document-picker';

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
      text: 'Dosya (PDF)',
      onPress: async () => {
        try {
          const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.allFiles],
            allowMultiSelection: false,
          });
          console.log(result);

          console.log('Seçilen dosya:', result);
          console.log('Seçilen dosya uri:', result.uri);

          await RNFS.readFile(result.uri, 'base64').then(data => {});

          if (!result.uri) {
            console.log('Dosya URI bulunamadı:', result);
            throw new Error('Dosya URI alınamadı');
          }

          const contentUri = result.uri;
          setFileUri(contentUri);

          const extension = getFileExtension(contentUri);

          const byteaData = await uriToBytea(contentUri);

          await sendToDocuments(byteaData, extension, task_id);
        } catch (error) {
          console.error('Hata:', error);
          if (DocumentPicker.isCancel(error)) {
            console.log('Kullanıcı dosya seçimini iptal etti');
          } else {
            console.error('Dosya seçme hatası: ', error);
          }
        }
      },
    },
    {
      text: 'Galeri',
      onPress: async () => {
        const result = await launchImageLibrary({
          includeBase64: false,
          selectionLimit: 1,
          quality: 1,
          maxWidth: 100,
          maxHeight: 100,
          mediaType: 'document',
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
          quality: 1,
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

const convertUriToFilePath = async uri => {
  try {
    const filePath = await RNFS.copyAssetsFileIOS(
      uri,
      RNFS.TemporaryDirectoryPath + '/tempfile',
    );
    console.log('Dönüştürülmüş dosya yolu:', filePath);
    return filePath;
  } catch (error) {
    console.error('URI dönüştürme hatası:', error);
    throw new Error('Dosya yoluna erişilemedi');
  }
};

export const pickFileMessages = async (
  room,
  room_id,
  username,
  setFileUri,
  task_id,
) => {
  Alert.alert('Seçiniz', 'Eklemek istediğiniz dosyayı seçin:', [
    {
      text: 'Dosya (PDF)',
      onPress: async () => {
        try {
          const result = await DocumentPicker.pickSingle({
            type: [DocumentPicker.types.allFiles],
            allowMultiSelection: false,
          });
          console.log(result);

          console.log('Seçilen dosya:', result);
          console.log('Seçilen dosya uri:', result.uri);

          await RNFS.readFile(result.uri, 'base64').then(data => {});

          if (!result.uri) {
            console.log('Dosya URI bulunamadı:', result);
            throw new Error('Dosya URI alınamadı');
          }

          const contentUri = result.uri;
          setFileUri(contentUri);

          const extension = getFileExtension(contentUri);

          const byteaData = await uriToBytea(contentUri);

          await sendToDocuments(byteaData, extension, task_id);
          await sendToMessages(room, room_id, username, byteaData, task_id);
        } catch (error) {
          console.error('Hata:', error);
          if (DocumentPicker.isCancel(error)) {
            console.log('Kullanıcı dosya seçimini iptal etti');
          } else {
            console.error('Dosya seçme hatası: ', error);
          }
        }
      },
    },
    {
      text: 'Galeri',
      onPress: async () => {
        const result = await launchImageLibrary({
          includeBase64: false,
          selectionLimit: 1,
          quality: 1,
          maxWidth: 100,
          maxHeight: 100,
          mediaType: 'photo',
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
          mediaType: 'video',
          cameraType: 'back',
          includeBase64: false,
          quality: 1,
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

// const sendToDocuments = async (byteaData, extension, task_id) => {
//   const hexData = byteaData.toString('hex');
//   const formattedData = `\\x${hexData}`;

//   try {
//     const response = await fetch('http://192.168.1.36:5000/documents', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         task_id: task_id,
//         dosya: formattedData,
//         ext: extension,
//       }),
//     });

//     const result = await response.json();
//     if (result.success) {
//     } else {
//       Alert.alert('Hata', result.message);
//     }
//   } catch (error) {
//     console.error('Backend bağlantı hatası:', error);
//     Alert.alert('Hata', 'Bir hata oluştu.');
//   }
// };

const sendToDocuments = async (byteaData, extension, task_id) => {
  const formattedData = `\\x${byteaData}`;

  try {
    const response = await fetch('http://192.168.1.36:5000/documents', {
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

    const textResponse = await response.text();
    console.log('Raw Yanıt:', textResponse);

    try {
      const result = JSON.parse(textResponse);
      console.log('Parsed Yanıt:', result);

      if (result.success) {
        console.log('Başarı mesajı:', result.message);
      } else {
        console.error('Hata mesajı:', result.message);
      }
    } catch (parseError) {
      console.error(
        'JSON parse hatası:',
        parseError,
        'Raw Yanıt:',
        textResponse,
      );
    }
  } catch (error) {
    console.error('Hata:', error);
  }
};

const sendToMessages = async (room, room_id, username, image, task_id) => {
  const hexData = image.toString('hex');
  const formattedData = `\\x${hexData}`;
  try {
    const response = await fetch('http://192.168.1.36:5000/messages', {
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
    } else {
      Alert.alert('Hata', result.message);
    }
  } catch (error) {
    console.error('Backend bağlantı hatası:', error);
    Alert.alert('Hata', 'Bir hata oluştu.');
  }
};
