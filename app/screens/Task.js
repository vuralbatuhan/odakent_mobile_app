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
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from '../css/TaskStyle';
import {Dropdown} from 'react-native-element-dropdown';
//import AntDesign from '@expo/vector-icons/AntDesign';
import {Button} from 'react-native-elements';
//import {SimpleLineIcons} from '@expo/vector-icons';
//import { Octicons } from '@expo/vector-icons';

import {
  fetchProblems,
  fetchItems,
  fetchAllItems,
  fetchRoomGroupName,
  addItem,
} from '../api/TaskApiFunctions.js';
import {pickImage} from '../utils/Utils.js';
import {logout} from '../utils/Logout';

const Task = ({navigation, route}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [problems, setProblems] = useState([]);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [selectedProblem, setSelectedProblem] = useState('ODAKENT+WEB');
  const [roomGroupName, setRoomGroupName] = useState('');
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(true);
  const [modalLogout, setModalLogout] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocus, setIsFocus] = useState(true);
  const [statu, setStatu] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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
        break;
      case 1:
        filteredList = items.filter(item => item.statu_id === 2);
        break;
      case 2:
        filteredList = items.filter(item => item.statu_id === 3);
        break;
      default:
        filteredList = items;
        break;
    }

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
        const data = await fetchRoomGroupName(username);
        setRoomGroupName(data.room);
        navigation.setOptions({
          title: `${data.room} görevler`,
        });
        fetchProblemList();
      } catch (error) {
        console.error('Hata oluştu:', error);
      }
    };

    getRoomGroupName();
  }, [username, navigation]);

  useEffect(() => {
    handleCheckboxPress(3);
  }, [selectedProblem]);

  const fetchProblemList = async () => {
    const problemsData = await fetchProblems();
    setProblems(problemsData);
  };

  const fetchData = async problem => {
    try {
      let data;
      if (selectedProblem === 'all') {
        data = await fetchAllItems(roomGroupName);
        setVisible(false);
      } else {
        data = await fetchItems(selectedProblem, roomGroupName);
        setVisible(true);
      }
      setItems(data);
      setFilteredItems(data);
      const statuList = data.map(item => ({statu: item.statu}));
      setStatu(statuList);
      const statusCountsData = {
        status1: data.filter(item => item.statu_id === 1).length,
        status2: data.filter(item => item.statu_id === 2).length,
        status3: data.filter(item => item.statu_id === 3).length,
      };

      setStatusCounts(statusCountsData);
    } catch (error) {}
  };

  useEffect(() => {
    if (roomGroupName) {
      fetchData(selectedProblem);
    }
  }, [roomGroupName, selectedProblem]);

  const handleAddItem = async () => {
    const result = await addItem(
      title,
      text,
      selectedProblem,
      imageUri,
      roomGroupName,
    );
    if (result) {
      fetchData(selectedProblem);
      setTitle('');
      setText('');
      setImageUri('');
      setModalVisible(false);
    } else {
      alert('Error adding item.');
    }
  };

  const closeAndReset = () => {
    setTitle('');
    setText('');
    setImageUri('');
    setModalVisible(false);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const lowercasedQuery = text.toLowerCase();
    const filteredItems = items.filter(item => {
      const title = item.title ? item.title.toLowerCase() : '';
      const description = item.description
        ? item.description.toLowerCase()
        : '';

      return (
        title.includes(lowercasedQuery) || description.includes(lowercasedQuery)
      );
    });

    setFilteredItems(filteredItems);
  };

  const handleRowPress = item => {
    navigation.navigate('Detail', {
      title: item.title,
      description: item.description,
      image: item.image,
      id: item.id,
      room: item.room,
      username: username,
    });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        {visibleLogout && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setModalLogout(true)}>
            {/* <SimpleLineIcons name="logout" size={24} color="black" /> */}
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        )}
        <Dropdown
          style={[styles.dropdown]}
          selectedValue={selectedProblem}
          onValueChange={itemValue => {
            setSelectedProblem(itemValue);
            fetchItems(itemValue);
          }}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={problems}
          search
          maxHeight={300}
          width={'100%'}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={selectedProblem}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectedProblem(item.value);
            setIsFocus(false);
            fetchData();
          }}
          // renderLeftIcon={() => (
          //   <AntDesign style={styles.icon} name="check" size={20} />
          // )}
        />
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
          <View style={[styles.checkboxColumn, {marginLeft: 20}]}>
            {['Bitenler', 'Hepsi'].map((label, index) => (
              <TouchableOpacity
                key={index + 2}
                style={styles.checkboxContainer}
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
        {/* <AntDesign
          name="search1"
          size={20}
          color="gray"
          style={styles.searchIcon}
        /> */}
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={filteredItems}
          keyExtractor={item =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleRowPress(item)}>
              <View style={styles.itemContainer}>
                <Text style={styles.titleText}>{item.title}</Text>
                <View style={styles.textAndImageContainer}>
                  {item.image && (
                    <Image
                      source={{uri: item.image}}
                      style={styles.itemImage}
                    />
                  )}
                  <Text style={styles.itemText}>{item.description}</Text>
                  {/* <View style={styles.statuButton}>
                    {item.statu_id === 1 ? (
                      <Button
                        title="Y"
                        buttonStyle={styles.statusButton}
                        titleStyle={{
                          color: 'black',
                        }}
                        disabled={true}
                        disabledStyle={{
                          backgroundColor: '#ed5247',
                        }}
                        disabledTitleStyle={{
                          fontSize: 12,
                          color: 'black',
                        }}
                      />
                    ) : item.statu_id === 2 ? (
                      <Button
                        title="D"
                        buttonStyle={styles.statusButton}
                        titleStyle={{
                          color: 'black',
                          fontSize: 12,
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
                          fontSize: 12,
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
                  </View> */}
                </View>
              </View>
            </TouchableOpacity>
          )}
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
              onPress={() => {
                setModalVisible(false);
                closeAndReset();
              }}>
              {/* <AntDesign name="close" size={24} color="black" /> */}
            </TouchableOpacity>
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
                onPress={() => pickImage(setImageUri)}>
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
      <Modal
        visible={modalLogout}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalLogout(false)}>
        <View style={styles.modalOverlayLogout}>
          <View style={styles.modalLogoutContent}>
            {/* <Octicons
              style={styles.closeButton}
              name="x"
              size={24}
              color={'black'}
              onPress={() => setModalLogout(false)}
            /> */}
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
  );
  // return (
  //   <View>
  //     <Text>Task</Text>
  //   </View>
  // );
};

export default Task;