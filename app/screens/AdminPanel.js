import React, {useState, useEffect} from 'react';
import {
  TextInput,
  Alert,
  View,
  TouchableOpacity,
  BackHandler,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Portal, Modal, Text, Provider} from 'react-native-paper';
import {
  createRoom,
  createProblem,
  createStatu,
  createUser,
  fetchRooms,
  fetchProblems,
  fetchStatus,
} from '../api/AdminPanelApiFunctions';
import styles from '../css/AdminPanelStyle';
import {Dropdown} from 'react-native-element-dropdown';
import {Kohana} from 'react-native-textinput-effects';
import {TextInput as PaperTextInput} from 'react-native-paper';

const AdminPanel = ({navigation}) => {
  const [roomName, setRoomName] = useState('');
  const [problemName, setProblemName] = useState('');
  const [statuName, setStatuName] = useState('');
  const [isModalRoomVisible, setModalRoomVisible] = useState(false);
  const [isModalProblemVisible, setModalProblemVisible] = useState(false);
  const [isModalStatuVisible, setModalStatuVisible] = useState(false);
  const [isModalUserVisible, setModalUserVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [roomModalVisible, setroomModalVisible] = useState(false);
  const [problemModalVisible, setproblemModalVisible] = useState(false);
  const [statuModalVisible, setstatuModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [rooms, setRooms] = useState([]);
  const [problems, setProblems] = useState([]);
  const [status, setstatu] = useState([]);
  const [roomsSearch, setRoomsSearch] = useState(null);
  const [problemSearch, setProblemSearch] = useState(null);
  const [statuSearch, setStatuSearch] = useState(null);
  const [filteredRoomItems, setfilteredRoomItems] = useState([]);
  const [filteredProblemItems, setfilteredProblemItems] = useState([]);
  const [filteredStatuItems, setfilteredStatuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const roles = [
    {label: 'User', value: 'user'},
    {label: 'Admin', value: 'admin'},
  ];
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
  useEffect(() => {
    const fetchData = async () => {
      const roomData = await fetchRooms();
      setRooms(roomData);
      setfilteredRoomItems(roomData);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const problemData = await fetchProblems();
      setProblems(problemData);
      setfilteredProblemItems(problemData);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const statuData = await fetchStatus();
      setstatu(statuData);
      setfilteredStatuItems(statuData);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (role === 'admin') {
      setSelectedRoom('admin');
    } else {
      setSelectedRoom(null);
    }
  }, [role]);
  const handleCreateRoom = async () => {
    try {
      const newRoom = await createRoom(roomName);
      Alert.alert('Başarılı', `Şirket oluşturuldu: ${newRoom.room}`);
      setroomModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Şirket zaten mevcut');
    } finally {
      setModalRoomVisible(false);
    }
  };
  const handleCreateProblem = async () => {
    try {
      const newProblem = await createProblem(problemName);
      Alert.alert('Başarılı', `Konu oluşturuldu: ${newProblem.problem}`);
      setproblemModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Konu zaten mevcut.');
    } finally {
      setModalProblemVisible(false);
    }
  };
  const handleCreateStatu = async () => {
    try {
      const newStatu = await createStatu(statuName);
      Alert.alert('Başaılı', `Durum oluşturuldu: ${newStatu.statu}`);
      setstatuModalVisible(false);
    } catch (error) {
      Alert.alert('Hata', 'Durum zaten mevcut.');
    } finally {
      setModalStatuVisible(false);
    }
  };
  const handleOpenRoomModal = () => {
    if (!roomName.trim()) {
      Alert.alert('Hata', 'Şirket boş bırakılamaz.');
      setroomModalVisible(true);
      return;
    }
    setModalRoomVisible(true);
  };
  const handleOpenProblemModal = () => {
    if (!problemName.trim()) {
      Alert.alert('Hata', 'Konu boş bırakılamaz.');
      setproblemModalVisible(true);
      return;
    }
    setModalProblemVisible(true);
  };
  const handleOpenStatuModal = () => {
    if (!statuName.trim()) {
      Alert.alert('Hata', 'Durum boş bırakılamaz.');
      setstatuModalVisible(true);
      return;
    }
    setModalStatuVisible(true);
  };
  const save = async () => {
    if (!username.trim() || !password.trim() || !role || !selectedRoom) {
      Alert.alert('Hata', 'Tüm alanları doldurduğunuzdan emin olun.');
      return;
    }
    setIsConfirmModalVisible(true);
    setModalUserVisible(false);
  };
  const closeAndClear = () => {
    setUsername('');
    setPassword('');
    setRole('');
    setSelectedRoom('');
    setRoomName('');
    setProblemName('');
    setStatuName('');
  };
  const handleSaveUser = async () => {
    try {
      const result = await createUser(username, password, selectedRoom, role);
      console.log('User created successfully:', result);
      Alert.alert('Başarılı', 'Kullanıcı başarıyla oluşturuldu.');
      closeAndClear;
      setIsConfirmModalVisible(false);
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Hata', 'Kullanıcı zaten mevcut.');
    }
  };
  const handleDeclineSave = () => {
    setIsConfirmModalVisible(false);
  };
  const handleCancel = () => {
    closeAndClear();
    setModalRoomVisible(false);
    setModalProblemVisible(false);
    setModalStatuVisible(false);
    setModalUserVisible(false);
    setIsConfirmModalVisible(false);
    setroomModalVisible(false);
    setproblemModalVisible(false);
    setstatuModalVisible(false);
  };
  const handleSearchRoom = text => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filteredAllItems = rooms.filter(item => {
      const label = item.label ? item.label.toLowerCase() : '';
      return label.includes(lowercasedQuery);
    });
    setfilteredRoomItems(filteredAllItems);
  };
  const handleSearchProblem = text => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filteredAllItems = problems.filter(item => {
      const label = item.label ? item.label.toLowerCase() : '';
      return label.includes(lowercasedQuery);
    });
    setfilteredProblemItems(filteredAllItems);
  };
  const handleSearchStatu = text => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filteredAllItems = status.filter(item => {
      const label = item.label ? item.label.toLowerCase() : '';
      return label.includes(lowercasedQuery);
    });
    setfilteredStatuItems(filteredAllItems);
  };
  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.textOdakent}>
          <Text style={styles.odakentText}>ODAKENT</Text>
        </SafeAreaView>
        <TouchableOpacity
          onPress={() => {
            setModalUserVisible(true);
          }}
          style={styles.userButton}>
          {/* <Feather
            style={styles.iconInButton}
            name="user"
            size={24}
            color="white"
          /> */}
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            Kullanıcı Oluştur
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setroomModalVisible(true)}
          style={styles.button}>
          {/* <MaterialCommunityIcons
            style={styles.iconInButton}
            name="office-building"
            size={24}
            color="white"
          /> */}
          <Text style={styles.buttonText}>Şirket Oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setproblemModalVisible(true)}
          style={styles.button}>
          {/* <AntDesign
            style={styles.iconInButton}
            name="book"
            size={24}
            color="white"
          /> */}
          <Text style={styles.buttonText}>Konu Oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setstatuModalVisible(true)}
          style={styles.button}>
          {/* <MaterialCommunityIcons
            style={styles.iconInButton}
            name="list-status"
            size={24}
            color="white"
          /> */}
          <Text style={styles.buttonText}>Durum Oluştur</Text>
        </TouchableOpacity>
        <Portal>
          <Modal
            visible={isModalRoomVisible}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalText}>
              "{roomName}" şirketi eklenecektir. Onaylıyor musunuz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCreateRoom}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCancel();
                  setroomModalVisible(true);
                }}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={isModalProblemVisible}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalText}>
              "{problemName}" problemi eklenecektir. Onaylıyor musunuz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCreateProblem}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCancel();
                  setproblemModalVisible(true);
                }}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={isModalStatuVisible}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalText}>
              "{statuName}" durumu eklenecektir. Onaylıyor musunuz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleCreateStatu}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCancel();
                  setstatuModalVisible(true);
                }}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={isModalUserVisible}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainerUser}>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              {/* <Feather name="x" size={24} color="black" /> */}
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Kullanıcı Oluştur</Text>
            <PaperTextInput
              label="Kullanıcı adı"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              left={<PaperTextInput.Icon icon="account-outline" />}
            />
            <PaperTextInput
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              left={<PaperTextInput.Icon icon="key-outline" />}
            />
            <Dropdown
              data={roles}
              labelField="label"
              valueField="value"
              placeholder="Rol Seçiniz"
              value={role}
              onChange={item => setRole(item.value)}
              style={styles.dropdown}
              // renderLeftIcon={() => (
              //   <Feather style={styles.icon} name="user" size={20} />
              // )}
            />
            {role !== 'admin' && (
              <Dropdown
                data={rooms}
                labelField="label"
                valueField="value"
                placeholder="Şirket Seçin"
                value={selectedRoom}
                onChange={item => setSelectedRoom(item.value)}
                style={styles.dropdown}
                // renderLeftIcon={() => (
                //   <MaterialCommunityIcons
                //     style={styles.icon}
                //     name="office-building"
                //     size={20}
                //   />
                // )}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={save} style={styles.userModalButton}>
                <Text style={styles.modalButtonText}>Oluştur</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCancel();
                }}
                style={styles.userModalButton}>
                <Text style={styles.modalButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={isConfirmModalVisible}
            onDismiss={handleDeclineSave}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalText}>
              "{username}" kullanıcısı oluşturulacaktır. Onaylıyor musunuz?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleSaveUser}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeclineSave}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={roomModalVisible}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Şirket Oluştur</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              {/* <Feather name="x" size={24} color="black" /> */}
            </TouchableOpacity>
            <PaperTextInput
              label="Şirket giriniz"
              value={roomName}
              onChangeText={text => setRoomName(text)}
              mode="outlined"
              left={<PaperTextInput.Icon icon="office-building" />}
            />
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Mevcut şirketlerde ara..."
                value={searchQuery}
                onChangeText={handleSearchRoom}
              />
              {/* <AntDesign
                name="search1"
                size={20}
                color="gray"
                style={styles.searchIcon}
              /> */}
            </View>
            <View style={styles.contentContainer}>
              <FlatList
                data={filteredRoomItems}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : Math.random().toString()
                }
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.itemContainer,
                      {
                        backgroundColor:
                          index % 2 === 0 ? '#f9f9f9' : '#e5e5e5',
                      },
                    ]}>
                    <Text style={styles.titleText}>{item.label}</Text>
                  </View>
                )}
              />
            </View>
            <TouchableOpacity
              onPress={handleOpenRoomModal}
              style={styles.buttonModal}>
              <Text style={styles.buttonText}>Şirket Oluştur</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={problemModalVisible}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Konu Oluştur</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              {/* <Feather name="x" size={24} color="black" /> */}
            </TouchableOpacity>
            <PaperTextInput
              label="Konu giriniz"
              value={problemName}
              onChangeText={text => setProblemName(text)}
              mode="outlined"
              left={<PaperTextInput.Icon icon="book" />}
            />
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Mevcut konularda ara..."
                value={searchQuery}
                onChangeText={handleSearchProblem}
              />
              {/* <AntDesign
                name="search1"
                size={20}
                color="gray"
                style={styles.searchIcon}
              /> */}
            </View>
            <FlatList
              data={filteredProblemItems}
              keyExtractor={item =>
                item.id ? item.id.toString() : Math.random().toString()
              }
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.itemContainer,
                    {
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e5e5e5',
                    },
                  ]}>
                  <Text style={styles.titleText}>{item.label}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => {
                handleOpenProblemModal();
              }}
              style={styles.buttonModal}>
              <Text style={styles.buttonText}>Konu Oluştur</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={statuModalVisible}
            onDismiss={handleCancel}
            contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Durum Oluştur</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCancel}>
              {/* <Feather name="x" size={24} color="black" /> */}
            </TouchableOpacity>
            <PaperTextInput
              label="Durum giriniz"
              value={statuName}
              onChangeText={text => setStatuName(text)}
              mode="outlined"
              left={<PaperTextInput.Icon icon="list-status" />}
            />
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Mevcut durumlarda ara..."
                value={searchQuery}
                onChangeText={handleSearchStatu}
              />
              {/* <AntDesign
                name="search1"
                size={20}
                color="gray"
                style={styles.searchIcon}
              /> */}
            </View>
            <FlatList
              data={filteredStatuItems}
              keyExtractor={item =>
                item.id ? item.id.toString() : Math.random().toString()
              }
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.itemContainer,
                    {
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e5e5e5',
                    },
                  ]}>
                  <Text style={styles.titleText}>{item.label}</Text>
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() => {
                handleOpenStatuModal();
              }}
              style={styles.buttonModal}>
              <Text style={styles.buttonText}>Durum Oluştur</Text>
            </TouchableOpacity>
          </Modal>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};

export default AdminPanel;
