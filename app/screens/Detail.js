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
import ImageResizer from 'react-native-image-resizer';
import {Buffer} from 'buffer';
import {RNFS} from 'react-native-fs';

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

  const filePath =
    'data/user/0/comsocketapp2/cache/rn/image/picker/lib/temp/f521757e+e2f5+4766+b528+4f2a1197319djpg=';

  // const getBase64Image = async filePath => {
  //   try {
  //     const base64String = await RNFS.readFile(filePath, 'base64');
  //     return base64String;
  //   } catch (error) {
  //     console.error("Resim Base64'e çevrilemedi:", error);
  //   }
  // };

  // getBase64Image(filePath).then(base64String => {
  //   console.log(base64String); // Bu Base64 string'ini Image bileşeninde kullanabilirsiniz.
  // });

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
    return `data:image/jpeg;base64,${base64String}`;
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const messages = await fetchMessages(room, id);
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
  }, [room, statu_id, id]);

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
      room: room,
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
        const timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const imageMessage = {
          username: username,
          message: null,
          image: messageFile,
          room: room,
          time: timestamp,
          task_id: id,
        };

        setMessageList(prevMessages => [...prevMessages, imageMessage]);
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
        // Resize image before displaying it
        const base64Image = await data[0].image.uri; // Resize the image
        setTaskImageUri(base64Image);
      }
    } catch (error) {
      console.error('Veri alınırken hata oluştu:', error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.itemText}>{description}</Text>
        {taskImageUri ? (
          <Image
            source={{uri: taskImageUri}}
            style={{width: 300, height: 200}}
            onError={error => {
              console.error('Resim yüklenemedi:', error.nativeEvent);
            }}
          />
        ) : (
          <Text>Resim yüklenemedi</Text>
        )}
        <Image
          source={{
            uri: 'file:///data/user/0/com.socketapp2/cache/rn_image_picker_lib_temp_a4ce060f-72bf-48fb-b9e8-5e0f29034994.jpg',
          }}
          style={{width: 100, height: 100}}
        />

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
                      {msg.base64Image ? (
                        <Image
                          source={{uri: msg.base64Image}}
                          style={styles.chatImage}
                        />
                      ) : (
                        <Text style={styles.messageText}>{msg.message}</Text>
                      )}
                      <Text style={styles.messageTime}>{msg.time}</Text>
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
    </SafeAreaView>
  );
};

export default Detail;
