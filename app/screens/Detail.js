import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  BackHandler,
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../css/DetailStyle';
import backgroundImage from '../assets/chat_background.jpg';
import {
  fetchMessages,
  updateProblem,
  deleteTask,
} from '../api/DeatilApiFunctions.js';
import {pickFile, pickFileMessages} from '../utils/Utils.js';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import ImageResizer from 'react-native-image-resizer';
import Pdf from 'react-native-pdf';

const Detail = ({route, navigation, socket}) => {
  const {
    title,
    description,
    image,
    id,
    room,
    statu_id: initialStatuId,
    userTypeId,
    username,
    room_id,
    problem_id,
  } = route.params;
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [imageUri, setImageUri] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [statu_id, setStatu_id] = useState(initialStatuId);
  const [taskImageUri, setTaskImageUri] = useState(null);
  const [visible, setVisible] = useState(1);
  const [buttonStates, setButtonStates] = useState([false, false, false]);
  const [disabledStates, setDisabledStates] = useState([false, false, false]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);

  let base64String = '';
  const buffer = Buffer.from(image);
  base64String = buffer.toString('base64');

  let imageUriByte = '';
  if (base64String) {
    imageUriByte = `data:application/pdf;base64,${base64String}`;
  }
  const extractMimeType = base64String => {
    if (!base64String) {
      return null;
    }

    const mimeTypeMatch = base64String.match(/^data:(.*?);base64,/);
    return mimeTypeMatch ? mimeTypeMatch[1] : null;
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Depolama İzni Gerekli',
          message:
            'Bu uygulama dosya indirme işlemi için depolama iznine ihtiyaç duyar.',
          buttonNeutral: 'Sonra Sor',
          buttonNegative: 'Reddet',
          buttonPositive: 'Kabul Et',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        Alert.alert(
          'İzin Gerekli',
          'Dosya indirme işlemi için depolama iznine ihtiyaç var.',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // useEffect(() => {
  //   requestStoragePermission();
  // }, []);

  const downloadPdfFromBase64 = async (base64Data, fileName) => {
    try {
      const cleanedBase64 = base64Data.replace(
        /^data:application\/\w+;base64,/,
        '',
      );

      const filePath = `${RNFS.ExternalStorageDirectoryPath}/Download/${fileName}`;

      await RNFS.writeFile(filePath, cleanedBase64, 'base64');

      Alert.alert('Başarılı!', `Dosya indirildi: ${filePath}`);
    } catch (error) {
      console.error('Dosya indirme hatası:', error);
      Alert.alert('Hata!', 'Dosya indirilemedi.');
    }
  };

  const resizeImage = async uri => {
    try {
      await ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80);
    } catch (error) {
      console.error('Resim boyutlandırma hatası:', error);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const byteArrayToBase64 = byteArray => {
    const uintArray = new Uint8Array(byteArray);
    const base64String = Buffer.from(uintArray).toString('base64');
    return `data:application/pdf;base64,${base64String}`;
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const messages = await fetchMessages(room_id, id);
        const updatedMessages = messages.map(msg => {
          if (msg.image && msg.image.data) {
            msg.base64Image = byteArrayToBase64(msg.image.data);
          }
          return msg;
        });
        setMessageList(updatedMessages);
      } catch (error) {
        console.error('Mesajlar alınırken hata oluştu:', error);
      }
    };
    getMessages();
    fetchTaskDetails();
  }, [room_id, statu_id, id]);

  useEffect(() => {
    socket.on('messageReturn', data => {
      if (data.image && data.image.data) {
        data.base64Image = byteArrayToBase64(data.image.data);
      }
      setMessageList(prev => [...prev, data]);
    });
    return () => {
      socket.off('messageReturn');
    };
  }, [socket]);

  const sendMessage = async () => {
    if (!message.trim() && !imageUri) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const messageContent = {
      username: username,
      message: message.trim() ? message : null,
      image: imageUri ? imageUri : null,
      room_id: room_id,
      time: timestamp,
      task_id: id,
    };

    setMessageList(prevMessages => [...prevMessages, messageContent]);

    await socket.emit('message', messageContent);

    setMessage('');
    setImageUri('');
  };

  const handleFilePicker = async () => {
    try {
      const messageFile = await pickFileMessages(
        room,
        room_id,
        username,
        setImageUri,
        id,
      );

      if (messageFile) {
        const resizedImage = await resizeImage(messageFile.uri);
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const fileMessage = {
          username: username,
          message: null,
          fileType: messageFile.type.split('/')[0],
          fileUri: resizedImage,
          room: room,
          time: timestamp,
          task_id: id,
        };

        setMessageList(prevMessages => [...prevMessages, fileMessage]);
      }
    } catch (error) {
      console.error('Dosya seçilirken hata:', error);
    }
  };

  const fetchTaskDetails = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.36:5000/tasks/${problem_id}/${room_id}/${id}`,
      );
      const data = await response.json();

      if (data[0]?.image) {
        const base64Image = await data[0].image.uri;
        setTaskImageUri(base64Image);
      }
    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error);
    }
  };

  const handleUpdateProblem = async () => {
    try {
      const updatedTask = await updateProblem(id, statu_id);
    } catch (error) {
      alert('Error updating task: ' + error.message);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(id);
      navigation.goBack();
    } catch (error) {
      console.error('Silme işlemi başarısız:', error);
      Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
    }
  };

  const handlePress = index => {
    const newButtonStates = [false, false, false];
    newButtonStates[index] = true;
    setButtonStates(newButtonStates);

    if (index === 0) {
      setStatu_id(1);
    } else if (index === 1) {
      setStatu_id(2);
    } else if (index === 2) {
      setStatu_id(3);
    }
  };
  const openModal = imageUri => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const newDisabledStates = [false, false, false];

    if (userTypeId === 2) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const initialButtonState = [false, false, false];
    if (statu_id === 1) {
      initialButtonState[0] = true;
    } else if (statu_id === 2) {
      initialButtonState[1] = true;
      newDisabledStates[0] = true;
    } else if (statu_id === 3) {
      initialButtonState[2] = true;
      newDisabledStates[0] = true;
      newDisabledStates[1] = true;
    }
    setButtonStates(initialButtonState);
    setDisabledStates(newDisabledStates);
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.buttonStatuContainer}>
          {visible && (
            <TouchableOpacity
              onPress={() => visible && handlePress(0)}
              disabled={disabledStates[0]}
              style={[
                styles.buttonStatu,
                {
                  backgroundColor: buttonStates[0] ? 'red' : '#d1a8a3',
                  borderWidth: buttonStates[0] ? 4 : 0,
                  borderColor: 'darkred',
                  opacity: 1,
                },
              ]}>
              <Text style={styles.buttonStatuText}>Yapılacak</Text>
            </TouchableOpacity>
          )}
          {visible && (
            <TouchableOpacity
              onPress={() => visible && handlePress(1)}
              disabled={disabledStates[1]}
              style={[
                styles.buttonStatu,
                {
                  backgroundColor: buttonStates[1] ? '#ffff00' : 'lightyellow',
                  borderWidth: buttonStates[1] ? 4 : 0,
                  borderColor: 'gold',
                  opacity: 1,
                },
              ]}>
              <Text style={styles.buttonStatuText}>Yapılıyor</Text>
            </TouchableOpacity>
          )}
          {visible && (
            <TouchableOpacity
              onPress={() => visible && handlePress(2)}
              disabled={disabledStates[2]}
              style={[
                styles.buttonStatu,
                {
                  backgroundColor: buttonStates[2] ? 'green' : '#bccfbe',
                  borderWidth: buttonStates[2] ? 4 : 0,
                  borderColor: 'darkgreen',
                  opacity: 1,
                },
              ]}>
              <Text style={styles.buttonStatuText}>Yapıldı</Text>
            </TouchableOpacity>
          )}
          {visible && (
            <TouchableOpacity
              onPress={() => setModalVisibleDelete(true)}
              style={styles.deleteButton}>
              <Text>sil</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.itemText}>{description}</Text>
        {imageUriByte ? (
          <TouchableOpacity onPress={openModal.bind(null, imageUriByte)}>
            <Image
              source={{uri: imageUriByte}}
              style={{width: 100, height: 100}}
              onError={error => {
                console.error('Resim yüklenemedi:', error.nativeEvent);
              }}
            />
          </TouchableOpacity>
        ) : (
          <Text>Resim yüklenemedi</Text>
        )}

        <Text style={styles.chatTitle}>SOHBET</Text>
        <View>
          <ImageBackground
            source={backgroundImage}
            resizeMode="cover"
            blurRadius={0}
            style={styles.chatBackground}>
            <ScrollView
              nestedScrollEnabled={true}
              style={styles.chatContainer}
              keyboardShouldPersistTaps="handled"
              ref={ref => {
                if (ref) {
                  ref.scrollToEnd({animated: true});
                }
              }}>
              <View>
                {messageList.map((msg, i) => (
                  <View
                    key={i}
                    style={[
                      styles.messageRow,
                      username === msg.username ? styles.ownMessageRow : null,
                    ]}>
                    <View
                      style={[
                        styles.messageBox,
                        username === msg.username
                          ? styles.ownMessage
                          : styles.otherMessage,
                      ]}>
                      <Text
                        style={[
                          styles.usernameText,
                          username === msg.username
                            ? styles.ownUsername
                            : styles.otherUsername,
                        ]}>
                        {msg.username}
                      </Text>

                      {msg.ext === '.jpg' || msg.ext === '.png' ? (
                        <>
                          <TouchableOpacity
                            onPress={openModal.bind(null, msg.base64Image)}>
                            <Image
                              source={{uri: msg.base64Image}}
                              style={{width: 200, height: 200}}
                              controls
                              resizeMode="stretch"
                            />
                          </TouchableOpacity>
                          {/* <TouchableOpacity
                            onPress={() => {
                              downloadPdfFromBase64(
                                msg.base64Image,
                                'downloadDeneme',
                              );
                            }}>
                            <Text>İndir</Text>
                          </TouchableOpacity> */}
                        </>
                      ) : extractMimeType(msg.base64Image) ===
                        'application/pdf' ? (
                        <>
                          <Pdf
                            source={{uri: msg.base64Image}}
                            style={styles.chatImage}
                          />
                          {/* <TouchableOpacity
                            onPress={() => {
                              downloadPdfFromBase64(
                                msg.base64Image,
                                'downloadDeneme',
                              );
                            }}>
                            <Text>İndir</Text>
                          </TouchableOpacity> */}
                        </>
                      ) : msg.ext === '.mp4' ? (
                        <Video
                          source={{uri: msg.base64Image}}
                          style={styles.chatImage}
                        />
                      ) : (
                        <Text style={styles.messageText}>{msg.message}</Text>
                      )}

                      <Text style={styles.messageTime}>
                        {' '}
                        {new Date(msg.create_date).toLocaleString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            value={message}
            onChangeText={text => setMessage(text)}
            placeholder="Mesajınızı yazın..."
          />
          <TouchableOpacity
            onPress={handleFilePicker}
            style={styles.iconButton}>
            <Text style={styles.iconText}>📎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Gönder</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButton}>XXXXX</Text>
          </TouchableOpacity>
          <Image source={{uri: selectedImage}} style={styles.modalImage} />
        </SafeAreaView>
      </Modal>

      <Modal
        visible={modalVisibleDelete}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisibleDelete(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerDelete}>
            <Text style={styles.modalTitle}>Silmek İstiyor Musunuz?</Text>
            <Text style={styles.modalDescription}>
              Bu işlemi geri alamazsınız. Devam etmek istiyor musunuz?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleDeleteTask}
                style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisibleDelete(false)}
                style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Detail;
