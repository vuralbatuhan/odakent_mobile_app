import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Image,
  BackHandler,
} from 'react-native';
import styles from '../css/AdminTaskStyle';
import {Dropdown} from 'react-native-element-dropdown';
import {Button} from '@rneui/base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  fetchUserType,
  fetchRooms,
  fetchProblems,
  fetchItems,
  fetchAllItems,
  fetchAllRoomItems,
  fetchAllProblemItems,
  addItem,
} from '../api/AdminTaskApiFunctions.js';
import {pickFile} from '../utils/Utils.js';
import {logout} from '../utils/Logout';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';

const AdminTask = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filteredCheckItems, setFilteredCheckItems] = useState([]);
  const [problems, setProblems] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocus, setIsFocus] = useState(true);
  const [userTypeId, setUserTypeId] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(true);
  const [modalLogout, setModalLogout] = useState(false);
  const [statu, setStatu] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(3);
  const [statusCounts, setStatusCounts] = useState({
    status1: 0,
    status2: 0,
    status3: 0,
  });
  const {username, isChecked} = route.params;
  useEffect(() => {
    if (isChecked) {
      setVisibleLogout(true);
    } else {
      setVisibleLogout(false);
    }
  }, [isChecked]);
  const handleCheckboxPress = index => {
    setSelectedIndex(index);
    let filteredList = [];
    switch (index) {
      case 0:
        filteredList = items.filter(item => item.statu_id === 1);
        setSearchQuery('');
        break;
      case 1:
        filteredList = items.filter(item => item.statu_id === 2);
        setSearchQuery('');
        break;
      case 2:
        filteredList = items.filter(item => item.statu_id === 3);
        setSearchQuery('');
        break;
      default:
        filteredList = items;
        setSearchQuery('');
        break;
    }
    setFilteredCheckItems(filteredList);
    setFilteredItems(filteredList);
  };
  useEffect(() => {
    let backHandler;
    if (isChecked) {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        BackHandler.exitApp();
        return true;
      });
    }
    return () => {
      if (backHandler) {
        backHandler.remove();
      }
    };
  }, [isChecked]);
  useEffect(() => {
    const getRoomGroupName = async () => {
      try {
        const userData = await fetchUserType(username);
        setUserTypeId(userData.user_type_id);
      } catch (error) {
        console.error('Hata oluştu:', error);
      }
    };
    const getData = async () => {
      try {
        const fetchedProblems = await fetchProblems();
        const fetchedRooms = await fetchRooms();
        setProblems(fetchedProblems);
        setRooms(fetchedRooms);
      } catch (error) {
        console.error('Hata oluştu:', error);
      }
    };
    getData();
    getRoomGroupName();
  }, [username, navigation]);
  const fetchData = async () => {
    try {
      let data;
      if (selectedRoom === 'all' && selectedProblem === 'all') {
        data = await fetchAllItems();
        setSearchQuery('');
        setSelectedIndex(3);
        setVisible(false);
      } else if (selectedRoom === 'all' && selectedProblem !== 'all') {
        data = await fetchAllProblemItems(selectedProblem);
        setSearchQuery('');
        setSelectedIndex(3);
        setVisible(false);
      } else if (selectedRoom !== 'all' && selectedProblem === 'all') {
        data = await fetchAllRoomItems(selectedRoom, selectedProblem);
        setSearchQuery('');
        setSelectedIndex(3);
        setVisible(false);
      } else {
        data = await fetchItems(selectedProblem, selectedRoom);
        setSearchQuery('');
        setSelectedIndex(3);
        setVisible(true);
      }
      const statusCountsData = {
        status1: data.filter(item => item.statu_id === 1).length,
        status2: data.filter(item => item.statu_id === 2).length,
        status3: data.filter(item => item.statu_id === 3).length,
      };
      setStatusCounts(statusCountsData);
      setItems(data);
      setFilteredItems(data);
      setFilteredCheckItems(data);
      setStatu(data.map(item => ({statu: item.statu})));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedRoom, selectedProblem]);

  const handleAddItem = async () => {
    if (imageUri) {
      try {
        const base64Image = await RNFS.readFile(imageUri, 'base64');
        const byteArray = Buffer.from(base64Image, 'base64');

        await addItem(
          title,
          text,
          selectedProblem,
          byteArray,
          selectedRoom,
          fetchAllItems,
        );
      } catch (error) {
        console.error('Görüntü dönüştürme sırasında hata:', error);
      }
    }

    setTitle('');
    setText('');
    setImageUri('');
    setModalVisible(false);
    fetchData();
  };
  const closeAndReset = () => {
    setTitle('');
    setText('');
    setImageUri('');
    setModalVisible(false);
    setModalLogout(false);
  };
  const handleSearch = text => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filteredAllItems = filteredCheckItems.filter(item => {
      const title = item.title ? item.title.toLowerCase() : '';
      const description = item.description
        ? item.description.toLowerCase()
        : '';
      const room = item.room ? item.room.toLowerCase() : '';
      return (
        title.includes(lowercasedQuery) ||
        description.includes(lowercasedQuery) ||
        room.includes(lowercasedQuery)
      );
    });
    setFilteredItems(filteredAllItems);
  };
  const handleRowPress = item => {
    navigation.navigate('Detail', {
      title: item.title,
      description: item.description,
      image: item.image,
      id: item.id,
      room: item.room,
      statu_id: item.statu_id,
      userTypeId: userTypeId,
      username: username,
      room_id: item.room_id,
      problem_id: item.problem_id,
    });
  };
  return (
    <>
      <SafeAreaView style={styles.buttonContainerAdmin}></SafeAreaView>

      {visibleLogout && (
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalLogout(true)}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('AdminPanel')}
        style={styles.adminButtonContainer}>
        <Text style={styles.adminButtonText}>Admin Panel</Text>
      </TouchableOpacity>

      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.container}>
          <View>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={rooms}
              search
              maxHeight={300}
              width="100%"
              labelField="label"
              valueField="value"
              searchPlaceholder="Search..."
              value={selectedRoom}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSelectedRoom(item.value);
                if (item.value === 'all') {
                  fetchAllRoomItems(
                    item.value,
                    selectedProblem,
                    setItems,
                    setFilteredItems,
                    setStatu,
                  );
                } else {
                  fetchData();
                }
              }}
            />
          </View>

          <View>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={problems}
              search
              maxHeight={300}
              width="100%"
              labelField="label"
              valueField="value"
              searchPlaceholder="Search..."
              value={selectedProblem}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSelectedProblem(item.value);
                fetchData();
              }}
            />
          </View>

          <View style={styles.checkboxAllContainer}>
            <View style={styles.checkboxColumn}>
              {['Yapılacaklar', 'Devam edenler'].map((label, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxContainer}
                  onPress={() => handleCheckboxPress(index)}>
                  <View
                    style={[
                      styles.checkbox,
                      index === 0 && styles.redCheckbox,
                      index === 1 && styles.yellowCheckbox,
                      selectedIndex === index &&
                        (index === 0
                          ? styles.selectedRed
                          : styles.selectedYellow),
                    ]}
                  />
                  <Text style={styles.label}>
                    {label} (
                    {index === 0 ? statusCounts.status1 : statusCounts.status2})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.checkboxColumn}>
              {['Bitenler', 'Hepsi'].map((label, index) => (
                <TouchableOpacity
                  key={index + 2}
                  style={[styles.checkboxContainer, {marginLeft: 20}]}
                  onPress={() => handleCheckboxPress(index + 2)}>
                  <View
                    style={[
                      styles.checkbox,
                      index === 0 ? styles.greenCheckbox : styles.blueCheckbox,
                      selectedIndex === index + 2 &&
                        (index === 0
                          ? styles.selectedGreen
                          : styles.selectedBlue),
                    ]}
                  />
                  <Text style={styles.label}>
                    {label} (
                    {index === 0
                      ? statusCounts.status3
                      : statusCounts.status1 +
                        statusCounts.status2 +
                        statusCounts.status3}
                    )
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Ara..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <View style={styles.contentContainer}>
          <FlatList
            data={filteredItems}
            keyExtractor={item =>
              item.id ? item.id.toString() : Math.random().toString()
            }
            renderItem={({item}) => {
              let base64String = '';
              if (item.image?.data) {
                const buffer = Buffer.from(item.image.data);
                base64String = buffer.toString('base64');
              }

              let imageUri = '';
              if (base64String) {
                imageUri = `data:image/jpeg;base64,${base64String}`;
              }

              return (
                <TouchableOpacity onPress={() => handleRowPress(item)}>
                  <View style={styles.itemContainer}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    <View style={styles.textAndImageContainer}>
                      {imageUri && (
                        <Image
                          source={{
                            uri: imageUri,
                          }}
                          style={{width: 50, height: 50}}
                        />
                      )}
                      <Text style={styles.itemText}>{item.description}</Text>
                      <Text
                        style={{
                          marginEnd: -22,
                          marginTop: -85,
                          color: 'blue',
                        }}>
                        {item.room}
                      </Text>
                      <View style={styles.statuButton}>
                        {item.statu_id === 1 ? (
                          <Button
                            title="Y"
                            buttonStyle={styles.statusButton}
                            titleStyle={{
                              color: 'black',
                            }}
                            disabled={true}
                            disabledStyle={{
                              backgroundColor: '#ed5250',
                            }}
                            disabledTitleStyle={{
                              fontSize: 14,
                              color: 'black',
                            }}
                          />
                        ) : item.statu_id === 2 ? (
                          <Button
                            title="D"
                            buttonStyle={styles.statusButton}
                            titleStyle={{
                              color: 'black',
                              fontSize: 14,
                            }}
                            disabled={true}
                            disabledStyle={{
                              backgroundColor: '#ffd700',
                            }}
                            disabledTitleStyle={{
                              color: 'black',
                            }}
                          />
                        ) : item.statu_id === 3 ? (
                          <Button
                            title="B"
                            buttonStyle={styles.statusButton}
                            titleStyle={{
                              color: 'black',
                              fontSize: 14,
                            }}
                            disabled={true}
                            disabledStyle={{
                              backgroundColor: '#25e00f',
                            }}
                            disabledTitleStyle={{
                              color: 'black',
                            }}
                          />
                        ) : null}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {visible && (
          <TouchableOpacity
            style={styles.addItemButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        )}

        <Modal visible={isModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => closeAndReset()}></TouchableOpacity>
              <TextInput
                placeholder="Görev başlığı"
                value={title}
                onChangeText={setTitle}
                multiline
                style={styles.textInput}
              />
              <TextInput
                placeholder="Açıklama"
                value={text}
                onChangeText={setText}
                multiline
                style={styles.textInputDescription}
              />
              {imageUri ? (
                <Image source={{uri: imageUri}} style={styles.imagePreview} />
              ) : null}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.imageCamera}
                  onPress={() => pickFile(setImageUri, 0)}>
                  <Text>buraya bas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.popupButtons}
                  onPress={handleAddItem}>
                  <Text>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for Logout */}
        <Modal
          visible={modalLogout}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalLogout(false)}>
          <View style={styles.modalOverlayLogout}>
            <View style={styles.modalLogoutContent}>
              <Text style={styles.modalTitle}>ÇIKIŞ YAP</Text>
              <Text style={styles.modalDescription}>
                Çıkış yapmak istiyor musunuz ?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    logout(navigation);
                    setModalLogout(false);
                  }}
                  style={[styles.button, styles.popupLogoutButtons]}>
                  <Text style={styles.buttonText}>Evet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalLogout(false)}
                  style={[styles.button, styles.noLogoutButton]}>
                  <Text style={styles.buttonText}>Hayır</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default AdminTask;
