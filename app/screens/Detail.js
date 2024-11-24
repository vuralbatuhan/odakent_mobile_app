// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Alert,
//   ImageBackground,
//   BackHandler,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import styles from '../css/DetailStyle';
// import backgroundImage from '../assets/chat_background.jpg';
// import {
//   fetchMessages,
//   updateProblem,
//   deleteTask,
// } from '../api/DeatilApiFunctions.js';
// import {pickFile, pickFileMessages} from '../utils/Utils.js';
// import {Buffer} from 'buffer';

// const Detail = ({route, navigation, socket}) => {
//   const {
//     title,
//     description,
//     image,
//     id,
//     room,
//     statu_id: initialStatuId,
//     userTypeId,
//     username,
//     room_id,
//   } = route.params;
//   const [message, setMessage] = useState('');
//   const [messageList, setMessageList] = useState([]);
//   const [imageUri, setImageUri] = useState('');
//   const [visible, setVisible] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [buttonStates, setButtonStates] = useState([false, false, false]);
//   const [disabledStates, setDisabledStates] = useState([false, false, false]);
//   const [statu_id, setStatu_id] = useState(initialStatuId);
//   const [base64Image, setBase64Image] = useState(null);

//   const handlePress = index => {
//     const newButtonStates = [false, false, false];
//     newButtonStates[index] = true;
//     setButtonStates(newButtonStates);
//     if (index === 0) {
//       setStatu_id(1);
//     } else if (index === 1) {
//       setStatu_id(2);
//     } else if (index === 2) {
//       setStatu_id(3);
//     }
//   };

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         navigation.goBack();
//         return true;
//       },
//     );
//     return () => backHandler.remove();
//   }, []);

//   const openModal = imageUri => {
//     setSelectedImage(imageUri);
//     setModalVisible(true);
//   };

//   const closeModal = () => setModalVisible(false);

//   useEffect(() => {
//     const newDisabledStates = [false, false, false];
//     if (userTypeId === 0) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//     const initialButtonState = [false, false, false];
//     if (statu_id === 1) {
//       initialButtonState[0] = true;
//     } else if (statu_id === 2) {
//       initialButtonState[1] = true;
//       newDisabledStates[0] = true;
//     } else if (statu_id === 3) {
//       initialButtonState[2] = true;
//       newDisabledStates[0] = true;
//       newDisabledStates[1] = true;
//     }
//     setButtonStates(initialButtonState);
//     setDisabledStates(newDisabledStates);

//     const getMessages = async () => {
//       try {
//         const messages = await fetchMessages(room, id);
//         setMessageList(messages);
//         console.log(messages);
//         console.log(messages[0].image.data);
//         setBase64Image(messages[0].image.data);
//       } catch (error) {
//         console.error('Mesajlar alınırken hata oluştu:', error);
//       }
//     };
//     getMessages();
//   }, [room, statu_id, userTypeId, id, imageUri]);

//   useEffect(() => {
//     socket.on('messageReturn', data => {
//       const bas = Buffer.from(data.image.data).toString('base64');
//       console.log(bas);
//       console.log('Alınan Mesaj:', data);
//       if (data.image) {
//         console.log('Resim Base64:', byteArrayToBase64(data.image.data));
//       }
//       setMessageList(prev => [...prev, data]);
//     });
//     return () => {
//       socket.off('messageReturn');
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (statu_id) {
//       handleUpdateProblem();
//     }
//   }, [statu_id]);

//   const handleUpdateProblem = async () => {
//     try {
//       const updatedTask = await updateProblem(id, statu_id);
//     } catch (error) {
//       alert('Error updating task: ' + error.message);
//     }
//   };

//   const handleDeleteTask = async () => {
//     try {
//       await deleteTask(id);
//       navigation.goBack();
//     } catch (error) {
//       console.error('Silme işlemi başarısız:', error);
//       Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
//     }
//   };

//   const sendMessage = async () => {
//     if (!message.trim() && !imageUri) {
//       return;
//     }
//     const timestamp = new Date().toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//     const messageContent = {
//       username: username,
//       message: message || null,
//       image: imageUri || null,
//       room: room,
//       time: timestamp,
//       task_id: id,
//     };

//     console.log('Gönderilen Mesaj:', messageContent);

//     setMessageList(prevMessages => [...prevMessages, messageContent]);
//     await socket.emit('message', messageContent);
//     setMessage('');
//     setImageUri('');
//   };

//   const isImageUri = uri => {
//     return uri && uri.match(/\.(jpeg|jpg|gif|png)$/) !== null;
//   };

//   const byteArrayToBase64 = byteArray => {
//     const uintArray = new Uint8Array(byteArray);
//     const base64String = Buffer.from(base64String).toString('base64');
//     console.log('Base64 Resim Verisi:', base64String);
//     return `data:image/jpeg;base64,${base64String}`;
//   };

//   return (
//     <SafeAreaView style={styles.mainContainer}>
//       <ScrollView style={styles.scrollViewContainer}>
//         <View style={styles.buttonStatuContainer}>
//           {visible && (
//             <TouchableOpacity
//               onPress={() => visible && handlePress(0)}
//               disabled={disabledStates[0]}
//               style={[
//                 styles.buttonStatu,
//                 {
//                   backgroundColor: buttonStates[0] ? 'red' : '#d1a8a3',
//                   borderWidth: buttonStates[0] ? 4 : 0,
//                   borderColor: 'darkred',
//                   opacity: 1,
//                 },
//               ]}>
//               <Text style={styles.buttonStatuText}>Yapılacak</Text>
//             </TouchableOpacity>
//           )}
//           {visible && (
//             <TouchableOpacity
//               onPress={() => visible && handlePress(1)}
//               disabled={disabledStates[1]}
//               style={[
//                 styles.buttonStatu,
//                 {
//                   backgroundColor: buttonStates[1] ? '#ffff00' : 'lightyellow',
//                   borderWidth: buttonStates[1] ? 4 : 0,
//                   borderColor: 'gold',
//                   opacity: 1,
//                 },
//               ]}>
//               <Text style={styles.buttonStatuText}>Yapılıyor</Text>
//             </TouchableOpacity>
//           )}
//           {visible && (
//             <TouchableOpacity
//               onPress={() => visible && handlePress(2)}
//               disabled={disabledStates[2]}
//               style={[
//                 styles.buttonStatu,
//                 {
//                   backgroundColor: buttonStates[2] ? 'green' : '#bccfbe',
//                   borderWidth: buttonStates[2] ? 4 : 0,
//                   borderColor: 'darkgreen',
//                   opacity: 1,
//                 },
//               ]}>
//               <Text style={styles.buttonStatuText}>Yapıldı</Text>
//             </TouchableOpacity>
//           )}
//           {visible && (
//             <TouchableOpacity
//               onPress={() => setModalVisibleDelete(true)}
//               style={styles.deleteButton}>
//               {/* <Feather name="trash" size={22} color="red" /> */}
//             </TouchableOpacity>
//           )}
//         </View>
//         <Text style={styles.titleText}>{title}</Text>
//         <Text style={styles.itemText}>{description}</Text>
//         {image && (
//           <TouchableOpacity onPress={openModal.bind(null, image)}>
//             <Image source={{uri: image}} style={styles.itemImage} />
//           </TouchableOpacity>
//         )}
//         <Text style={styles.chatTitle}>SOHBET</Text>
//         <View>
//           <ImageBackground
//             source={backgroundImage}
//             resizeMode="cover"
//             blurRadius={0}
//             style={{height: 550, flex: 1}}>
//             <ScrollView
//               nestedScrollEnabled={true}
//               style={styles.chatContainer}
//               keyboardShouldPersistTaps="handled"
//               ref={ref => {
//                 if (ref) {
//                   ref.scrollToEnd({animated: true});
//                 }
//               }}>
//               <View style={{opacity: 1}}>
//                 {messageList.map((msg, i) => (
//                   <View
//                     key={i}
//                     style={[
//                       styles.messageRow,
//                       username === msg.username ? styles.ownMessageRow : null,
//                     ]}>
//                     <View
//                       style={[
//                         styles.messageBox,
//                         username === msg.username
//                           ? styles.ownMessage
//                           : styles.otherMessage,
//                       ]}>
//                       {msg.isImage || isImageUri(msg.message) ? (
//                         <TouchableOpacity
//                           onPress={() =>
//                             openModal(msg.isImage ? msg.image : msg.message)
//                           }>
//                           <Image
//                             source={{
//                               uri: msg.isImage
//                                 ? byteArrayToBase64(msg.image.data)
//                                 : msg.message,
//                             }}
//                             style={styles.chatImage}
//                           />
//                         </TouchableOpacity>
//                       ) : (
//                         <Text style={styles.messageText}>{msg.message}</Text>
//                       )}
//                       <View style={styles.messageInfoContainer}>
//                         <Text style={styles.messageTime}>{msg.time}</Text>
//                         <Text style={styles.messageUsername}>
//                           {msg.username}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>
//           </ImageBackground>
//           <TextInput
//             style={styles.messageInput}
//             value={message}
//             onChangeText={setMessage}
//             placeholder="Mesajınızı yazın"
//             multiline
//           />
//           <View style={styles.inputRow}>
//             <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//               <Text style={styles.sendButtonText}>Gönder</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.cameraButton}
//               onPress={() => {
//                 pickFile(setImageUri, id);
//                 pickFileMessages(setImageUri, room, room_id, username, id);
//               }}>
//               <Text style={styles.cameraButtonText}>Resim Seç</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeModal}>
//         <SafeAreaView style={styles.modalContainer}>
//           <Image source={{uri: selectedImage}} style={styles.modalImage} />
//           <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
//             <Text style={styles.closeButtonText}>X</Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>

//       <Modal
//         visible={modalVisibleDelete}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisibleDelete(false)}>
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>
//               Görevi silmek istediğinizden emin misiniz?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleDeleteTask}>
//                 <Text style={styles.modalButtonText}>Evet</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={() => setModalVisibleDelete(false)}>
//                 <Text style={styles.modalButtonText}>Hayır</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default Detail;
// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Alert,
//   ImageBackground,
//   BackHandler,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import styles from '../css/DetailStyle';
// import backgroundImage from '../assets/chat_background.jpg';
// import {
//   fetchMessages,
//   updateProblem,
//   deleteTask,
// } from '../api/DeatilApiFunctions.js';
// import {pickFile, pickFileMessages} from '../utils/Utils.js';
// import {Buffer} from 'buffer';

// const Detail = ({route, navigation, socket}) => {
//   const {
//     title,
//     description,
//     image,
//     id,
//     room,
//     statu_id: initialStatuId,
//     userTypeId,
//     username,
//     room_id,
//   } = route.params;
//   const [message, setMessage] = useState('');
//   const [messageList, setMessageList] = useState([]);
//   const [imageUri, setImageUri] = useState('');
//   const [visible, setVisible] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [buttonStates, setButtonStates] = useState([false, false, false]);
//   const [disabledStates, setDisabledStates] = useState([false, false, false]);
//   const [statu_id, setStatu_id] = useState(initialStatuId);
//   const [base64Image, setBase64Image] = useState(null);

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         navigation.goBack();
//         return true;
//       },
//     );
//     return () => backHandler.remove();
//   }, []);

//   const openModal = imageUri => {
//     setSelectedImage(imageUri);
//     setModalVisible(true);
//   };

//   const closeModal = () => setModalVisible(false);

//   useEffect(() => {
//     const newDisabledStates = [false, false, false];
//     if (userTypeId === 0) {
//       setVisible(true);
//     } else {
//       setVisible(false);
//     }
//     const initialButtonState = [false, false, false];
//     if (statu_id === 1) {
//       initialButtonState[0] = true;
//     } else if (statu_id === 2) {
//       initialButtonState[1] = true;
//       newDisabledStates[0] = true;
//     } else if (statu_id === 3) {
//       initialButtonState[2] = true;
//       newDisabledStates[0] = true;
//       newDisabledStates[1] = true;
//     }
//     setButtonStates(initialButtonState);
//     setDisabledStates(newDisabledStates);

//     const getMessages = async () => {
//       try {
//         const messages = await fetchMessages(room, id);
//         const updatedMessages = messages.map(msg => {
//           if (msg.image && msg.image.data) {
//             msg.base64Image = byteArrayToBase64(msg.image.data);
//           }
//           return msg;
//         });
//         setMessageList(updatedMessages); // Mesajları güncel haliyle set ediyoruz
//       } catch (error) {
//         console.error('Mesajlar alınırken hata oluştu:', error);
//       }
//     };
//     getMessages();
//   }, [room, statu_id, userTypeId, id, imageUri]);

//   useEffect(() => {
//     socket.on('messageReturn', data => {
//       if (data.image) {
//         data.base64Image = byteArrayToBase64(data.image.data); // Gelen yeni mesajda base64 dönüşümü
//       }
//       setMessageList(prev => [...prev, data]);
//     });
//     return () => {
//       socket.off('messageReturn');
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (statu_id) {
//       handleUpdateProblem();
//     }
//   }, [statu_id]);

//   const handleUpdateProblem = async () => {
//     try {
//       const updatedTask = await updateProblem(id, statu_id);
//     } catch (error) {
//       alert('Error updating task: ' + error.message);
//     }
//   };

//   const handleDeleteTask = async () => {
//     try {
//       await deleteTask(id);
//       navigation.goBack();
//     } catch (error) {
//       console.error('Silme işlemi başarısız:', error);
//       Alert.alert('Hata', 'Görev silinirken bir hata oluştu.');
//     }
//   };

//   const sendMessage = async () => {
//     if (!message.trim() && !imageUri) {
//       return;
//     }
//     const timestamp = new Date().toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//     const messageContent = {
//       username: username,
//       message: message || null,
//       image: imageUri || null,
//       room: room,
//       time: timestamp,
//       task_id: id,
//     };

//     console.log('Gönderilen Mesaj:', base64Image);

//     setMessageList(prevMessages => [...prevMessages, messageContent]);
//     await socket.emit('message', messageContent);
//     setMessage('');
//     setImageUri('');
//   };

//   const isImageUri = uri => {
//     return uri && uri.match(/\.(jpeg|jpg|gif|png)$/) !== null;
//   };

//   const byteArrayToBase64 = byteArray => {
//     const uintArray = new Uint8Array(byteArray);
//     const base64String = Buffer.from(uintArray).toString('base64');
//     return `data:image/jpeg;base64,${base64String}`;
//   };

//   return (
//     <SafeAreaView style={styles.mainContainer}>
//       <ScrollView style={styles.scrollViewContainer}>
//         <Text style={styles.titleText}>{title}</Text>
//         <Text style={styles.itemText}>{description}</Text>
//         {base64Image && (
//           <Image
//             source={{uri: base64Image}}
//             style={{width: 300, height: 300, marginTop: 20}}
//           />
//         )}
//         <Text style={styles.chatTitle}>SOHBET</Text>
//         <View>
//           <ImageBackground
//             source={backgroundImage}
//             resizeMode="cover"
//             blurRadius={0}
//             style={{height: 550, flex: 1}}>
//             <ScrollView
//               nestedScrollEnabled={true}
//               style={styles.chatContainer}
//               keyboardShouldPersistTaps="handled"
//               ref={ref => {
//                 if (ref) {
//                   ref.scrollToEnd({animated: true});
//                 }
//               }}>
//               <View style={{opacity: 1}}>
//                 {messageList.map((msg, i) => (
//                   <View
//                     key={i}
//                     style={[
//                       styles.messageRow,
//                       username === msg.username ? styles.ownMessageRow : null,
//                     ]}>
//                     <View
//                       style={[
//                         styles.messageBox,
//                         username === msg.username
//                           ? styles.ownMessage
//                           : styles.otherMessage,
//                       ]}>
//                       {msg.isImage || isImageUri(msg.message) ? (
//                         <TouchableOpacity
//                           onPress={() =>
//                             openModal(msg.isImage ? msg.image : msg.message)
//                           }>
//                           <Image
//                             source={{
//                               uri: msg.isImage
//                                 ? byteArrayToBase64(msg.image.data)
//                                 : msg.message,
//                             }}
//                             style={styles.chatImage}
//                           />
//                         </TouchableOpacity>
//                       ) : (
//                         <Text style={styles.messageText}>{msg.message}</Text>
//                       )}
//                       <View style={styles.messageInfoContainer}>
//                         <Text style={styles.messageTime}>{msg.time}</Text>
//                         <Text style={styles.messageUsername}>
//                           {msg.username}
//                         </Text>
//                       </View>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             </ScrollView>
//           </ImageBackground>
//           <TextInput
//             style={styles.messageInput}
//             value={message}
//             onChangeText={setMessage}
//             placeholder="Mesajınızı yazın"
//             multiline
//           />
//           <View style={styles.inputRow}>
//             <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//               <Text style={styles.sendButtonText}>Gönder</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.cameraButton}
//               onPress={() => {
//                 pickFile(setImageUri, id);
//                 pickFileMessages(setImageUri, room, room_id, username, id);
//               }}>
//               <Text style={styles.cameraButtonText}>Resim Seç</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={closeModal}>
//         <SafeAreaView style={styles.modalContainer}>
//           <Image source={{uri: selectedImage}} style={styles.modalImage} />
//           <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
//             <Text style={styles.closeButtonText}>X</Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       </Modal>

//       <Modal
//         visible={modalVisibleDelete}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisibleDelete(false)}>
//         <SafeAreaView style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>
//               Görevi silmek istediğinizden emin misiniz?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleDeleteTask}>
//                 <Text style={styles.modalButtonText}>Evet</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={() => setModalVisibleDelete(false)}>
//                 <Text style={styles.modalButtonText}>Hayır</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default Detail;
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
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
import {Buffer} from 'buffer';

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
  } = route.params;
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [imageUri, setImageUri] = useState('');
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [buttonStates, setButtonStates] = useState([false, false, false]);
  const [disabledStates, setDisabledStates] = useState([false, false, false]);
  const [statu_id, setStatu_id] = useState(initialStatuId);

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

  const openModal = imageUri => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  useEffect(() => {
    const newDisabledStates = [false, false, false];
    if (userTypeId === 0) {
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

    const getMessages = async () => {
      try {
        const messages = await fetchMessages(room, id);
        // Her mesajın resmini base64'e dönüştürüp mesaj listesine ekliyoruz
        const updatedMessages = messages.map(msg => {
          if (msg.image && msg.image.data) {
            msg.base64Image = byteArrayToBase64(msg.image.data); // Resim base64 formatına dönüşüyor
          }
          return msg;
        });
        setMessageList(updatedMessages); // Güncellenmiş mesaj listesi
      } catch (error) {
        console.error('Mesajlar alınırken hata oluştu:', error);
      }
    };
    getMessages();
  }, [room, statu_id, userTypeId, id, imageUri]);

  useEffect(() => {
    socket.on('messageReturn', data => {
      if (data.image && data.image.data) {
        data.base64Image = byteArrayToBase64(data.image.data); // Gelen yeni mesajın resmini base64 formatına dönüştürme
      }
      setMessageList(prev => [...prev, data]); // Yeni mesajı listeye ekliyoruz
    });
    return () => {
      socket.off('messageReturn');
    };
  }, [socket]);

  const handleUpdateProblem = async () => {
    try {
      await updateProblem(id, statu_id);
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
      message: message || null,
      image: imageUri || null,
      room: room,
      time: timestamp,
      task_id: id,
    };

    setMessageList(prevMessages => [...prevMessages, messageContent]);
    await socket.emit('message', messageContent);
    setMessage('');
    setImageUri('');
  };

  const byteArrayToBase64 = byteArray => {
    const uintArray = new Uint8Array(byteArray);
    const base64String = Buffer.from(uintArray).toString('base64');
    return `data:image/jpeg;base64,${base64String}`;
  };
  const isImageUri = uri => {
    return uri && uri.match(/\.(jpeg|jpg|gif|png)$/) !== null;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.scrollViewContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.itemText}>{description}</Text>

        <Text style={styles.chatTitle}>SOHBET</Text>
        <View>
          <ImageBackground
            source={backgroundImage}
            resizeMode="cover"
            blurRadius={0}
            style={{height: 550, flex: 1}}>
            <ScrollView
              nestedScrollEnabled={true}
              style={styles.chatContainer}
              keyboardShouldPersistTaps="handled"
              ref={ref => {
                if (ref) {
                  ref.scrollToEnd({animated: true});
                }
              }}>
              <View style={{opacity: 1}}>
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
                      {msg.base64Image || isImageUri(msg.message) ? (
                        <TouchableOpacity
                          onPress={() =>
                            openModal(msg.base64Image || msg.message)
                          }>
                          <Image
                            source={{
                              uri: msg.base64Image || msg.message,
                            }}
                            style={styles.chatImage}
                          />
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.messageText}>{msg.message}</Text>
                      )}
                      <View style={styles.messageInfoContainer}>
                        <Text style={styles.messageTime}>{msg.time}</Text>
                        <Text style={styles.messageUsername}>
                          {msg.username}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
        <TextInput
          style={styles.messageInput}
          value={message}
          onChangeText={text => setMessage(text)}
          placeholder="Mesajınızı yazın..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Gönder</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Detail;
